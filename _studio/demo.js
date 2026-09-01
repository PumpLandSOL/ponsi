'use strict';
// PONSI V2 demo — drives the LIVE site over CDP, lime glass caption overlay,
// walks landing → dashboard → stake → bond desk → CA, encodes real-timing 30fps MP4.
//   node _studio/demo.js                       # records https://ponsponsi.xyz
//   SITE=http://localhost:8150 node _studio/demo.js
const { spawn, execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const pexec = promisify(execFile);

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9449, W = 1280, H = 720;
const SITE = process.env.SITE || 'https://ponsponsi.xyz';
const CA = '0xf98AD5Bf92170e1C121128d87666Bd10A98B41Bc';
const OUT = path.join(__dirname, 'out', 'ponsi-v2-demo.mp4');
const FRAMES = path.join(__dirname, 'demo-frames');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitDevtools() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) return; } catch (e) {}
    await sleep(200);
  }
  throw new Error('devtools never came up');
}
async function pageTarget() {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
  const p = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!p) throw new Error('no page target');
  return p.webSocketDebuggerUrl;
}
function makeCdp(ws) {
  let id = 0; const pending = new Map(); const listeners = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(m.error.message)) : resolve(m.result); }
    else if (m.method) listeners.forEach((fn) => fn(m));
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const mid = ++id; pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params })); });
  return { send, on: (fn) => listeners.push(fn) };
}

const OVERLAY = String.raw`
(() => {
  if (window.__cap) return true;
  const s = document.createElement('style');
  s.textContent = ` + '`' + `
    #dmTitle{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
      background:radial-gradient(52% 46% at 50% 30%,rgba(212,252,80,.30),transparent 64%),#f4f4f4;opacity:0;transition:opacity .5s}
    #dmTitle .t{font-family:'Instrument Serif',Georgia,serif;font-size:110px;letter-spacing:-2px;color:#111;text-align:center}
    #dmTitle .t b{color:#93b52f;font-weight:400}
    #dmTitle .s{font-family:Inter,system-ui,sans-serif;font-size:22px;letter-spacing:4px;color:#5f7d10;font-weight:700;text-transform:uppercase;margin-top:10px}
    #dmTitle .ca{font-family:ui-monospace,monospace;font-size:20px;color:#111;background:#fff;border:2px solid rgba(212,252,80,.9);border-radius:999px;padding:12px 26px;margin-top:26px;box-shadow:0 16px 40px rgba(17,17,17,.08)}
    #dmTitle.on{opacity:1}
    #dmCap{position:fixed;left:50%;bottom:36px;transform:translateX(-50%) translateY(24px);z-index:99998;min-width:min(860px,92vw);max-width:94vw;
      background:rgba(255,255,255,.92);backdrop-filter:blur(16px);border:1px solid rgba(212,252,80,.9);border-left:6px solid #d4fc50;border-radius:20px;
      box-shadow:0 20px 60px rgba(17,17,17,.16);padding:14px 24px;opacity:0;transition:opacity .35s,transform .35s}
    #dmCap.on{opacity:1;transform:translateX(-50%) translateY(0)}
    #dmCap .k{font-family:Inter,sans-serif;font-size:11px;letter-spacing:3px;color:#5f7d10;text-transform:uppercase;font-weight:800}
    #dmCap .v{font-family:Inter,sans-serif;font-size:21px;color:#111;margin-top:4px;line-height:1.4;font-weight:500}
    #dmCap .v b{color:#5f7d10}
  ` + '`' + `;
  document.head.appendChild(s);
  const title = document.createElement('div'); title.id='dmTitle'; title.innerHTML='<div class="t"></div><div class="s"></div><div class="ca" style="display:none"></div>'; document.body.appendChild(title);
  const cap = document.createElement('div'); cap.id='dmCap'; cap.innerHTML='<div class="k"></div><div class="v"></div>'; document.body.appendChild(cap);
  window.__title = (t, sub, ca) => { title.querySelector('.t').innerHTML=t; title.querySelector('.s').textContent=sub||'';
    const c=title.querySelector('.ca'); if(ca){c.textContent=ca;c.style.display='';}else c.style.display='none'; title.classList.add('on'); };
  window.__titleHide = () => title.classList.remove('on');
  window.__cap = (k, v) => { cap.querySelector('.k').textContent=k||''; cap.querySelector('.v').innerHTML=v||''; cap.classList.add('on'); };
  window.__capHide = () => cap.classList.remove('on');
  window.__scrollToSel = (sel, dur) => new Promise((res) => {
    const el=document.querySelector(sel); if(!el){res();return;}
    const startY=window.scrollY, endY=window.scrollY+el.getBoundingClientRect().top-(window.innerHeight*0.18);
    const t0=performance.now(); dur=dur||1000;
    (function fr(t){ const k=Math.min(1,(t-t0)/dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; window.scrollTo(0,startY+(endY-startY)*e); if(k<1)requestAnimationFrame(fr); else res(); })(t0);
  });
  return true;
})()`;

async function main() {
  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${W},${H}`,
    `--remote-debugging-port=${PORT}`, '--remote-allow-origins=*',
    `--user-data-dir=${path.join(__dirname, 'demo-profile')}`,
    SITE,
  ], { stdio: 'ignore' });

  const frames = [];
  try {
    await waitDevtools();
    const ws = new WebSocket(await pageTarget());
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
    const { send, on } = makeCdp(ws);
    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    const ev = (expr, awaitPromise = false) => send('Runtime.evaluate', { expression: expr, awaitPromise, returnByValue: true });
    const inject = async () => { await ev("document.fonts && document.fonts.ready.then(()=>1)", true).catch(() => {}); await ev(OVERLAY, true); };
    await sleep(3500); await inject();

    on((m) => {
      if (m.method === 'Page.screencastFrame') {
        frames.push({ buf: Buffer.from(m.params.data, 'base64'), t: Date.now() });
        send('Page.screencastFrameAck', { sessionId: m.params.sessionId }).catch(() => {});
      }
    });
    await send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });

    // ---- ACT I: landing ----
    await ev("window.scrollTo(0,0)");
    await ev("window.__title('PONSI <b>V2</b>','the self-aware reserve · on pons', '" + CA + "')"); await sleep(3200);
    await ev("window.__titleHide()"); await sleep(500);
    await ev("window.__cap('marked to reality','V1 simulated. V2 runs on the <b>live pool</b> — real price, real market cap, honest treasury.')"); await sleep(4200);

    // ---- ACT II: the dashboard ----
    await send('Page.navigate', { url: SITE + '/app' });
    await sleep(3000); await inject();
    await ev("window.__cap('the dashboard','Price and market cap are the <b>real $PONSI pool</b>, refreshed every minute. The treasury tracks the actual market.')"); await sleep(4600);
    await ev("window.__scrollToSel('#mRebase',900)", true).catch(() => {});
    await ev("window.__cap('the rebase','Every <b>5 minutes</b> the index steps up — 50,000% APY, the OHM engine you know.')"); await sleep(4200);

    // ---- ACT III: stake ----
    await ev("const t=document.querySelector('[data-view\\x3d\\x22stake\\x22]'); if(t) t.click()"); await sleep(1200);
    await ev("window.__cap('(3,3) — stake','Stake $PONSI, receive sPONSI, compound every epoch. Unstake anytime.')"); await sleep(4200);

    // ---- ACT IV: bond desk ----
    await ev("const t=document.querySelector('[data-view\\x3d\\x22bond\\x22]'); if(t) t.click()"); await sleep(1200);
    await ev("window.__cap('the bond desk — real ETH','Bond ETH at a discount. Your deposit is a <b>real on-chain transfer to the treasury</b>, verified tx-by-tx before the bond vests.')"); await sleep(5200);
    await ev("window.__cap('the treasury','Every bonded ETH lands in the treasury wallet on Robinhood Chain. <b>No fantasy numbers — receipts.</b>')"); await sleep(4600);

    // ---- endcard w/ CA ----
    await ev("window.__capHide()"); await sleep(300);
    await ev("window.__title('the name is<br>the <b>risk disclosure</b>','$PONSI · ponsponsi.xyz')");
    await ev("(function(){var c=document.querySelector('#dmTitle .ca'); c.textContent='" + CA + "'; c.style.display='inline-block';})()");
    await sleep(4600);

    await send('Page.stopScreencast');
    await sleep(300);
    ws.close();
  } finally {
    chrome.kill();
  }

  if (frames.length < 5) throw new Error('too few frames: ' + frames.length);
  const list = [];
  for (let i = 0; i < frames.length; i++) {
    const name = `f_${String(i).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(FRAMES, name), frames[i].buf);
    const dur = i < frames.length - 1 ? Math.max(0.016, (frames[i + 1].t - frames[i].t) / 1000) : 0.5;
    list.push(`file '${name}'`, `duration ${dur.toFixed(3)}`);
  }
  list.push(`file 'f_${String(frames.length - 1).padStart(5, '0')}.jpg'`);
  fs.writeFileSync(path.join(FRAMES, 'list.txt'), list.join('\n'));
  console.log(`captured ${frames.length} frames over ${((frames[frames.length - 1].t - frames[0].t) / 1000).toFixed(1)}s — encoding…`);
  await pexec('ffmpeg', [
    '-y', '-f', 'concat', '-safe', '0', '-i', path.join(FRAMES, 'list.txt'),
    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '19', '-preset', 'slow',
    '-movflags', '+faststart', OUT,
  ], { maxBuffer: 1 << 28 });
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log('✓', OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
