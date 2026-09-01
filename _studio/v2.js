'use strict';
// PONSI V2 brand assets — lime liquid-glass house style.
// Writes ponsi-v2-*.html into out/; rasterize with render-v2 loop below or render.js sizes.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const BASE = `
:root{--accent:#d4fc50;--accent-soft:#f3ffd4;--bg:#f4f4f4;--card:#fff;--ink:#111;
  --sub:rgba(17,17,17,.55);--mut:rgba(17,17,17,.4);--line:rgba(17,17,17,.1);--lime-ink:#6f9f18;--deep:#5f7d10}
*{margin:0;padding:0;box-sizing:border-box}
html,body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--bg);overflow:hidden;-webkit-font-smoothing:antialiased}
.stage{width:2400px;height:1350px;position:relative;overflow:hidden;background:
  radial-gradient(52% 46% at 50% -8%,rgba(212,252,80,.42),transparent 64%),
  radial-gradient(38% 34% at 94% 20%,rgba(212,252,80,.18),transparent 60%),
  radial-gradient(56% 44% at 6% 104%,rgba(212,252,80,.16),transparent 62%),var(--bg)}
.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
.mark{font-family:'Instrument Serif',Georgia,serif;line-height:.8;
  background:linear-gradient(165deg,#ffffff 3%,#eefbc4 24%,var(--accent) 56%,#93b52f 92%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 0 rgba(255,255,255,.9)) drop-shadow(0 10px 30px rgba(140,180,40,.5))}
.pill{display:inline-flex;align-items:center;gap:12px;font-size:26px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--deep);
  background:var(--accent-soft);border:2px solid rgba(212,252,80,.65);border-radius:999px;padding:14px 34px}
.glass{background:rgba(255,255,255,.72);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.9);border-radius:36px;
  box-shadow:0 30px 80px rgba(17,17,17,.10),inset 0 1px 0 rgba(255,255,255,.95)}
.foot{position:absolute;left:130px;right:130px;bottom:56px;display:flex;justify-content:space-between;font-size:25px;color:var(--mut);font-weight:600}
.foot b{color:var(--deep)}
`;

const page = (body, extra) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}${extra || ''}</style></head><body><div class="stage">${body}</div></body></html>`;

// 1) V2 KEY ART — the announcement
fs.writeFileSync(path.join(OUT, 'ponsi-v2-keyart.html'), page(`
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 130px">
    <div class="pill">Ω · THE SELF-AWARE RESERVE · ON PONS</div>
    <div class="serif" style="font-size:200px;letter-spacing:-3px;margin-top:40px">PONSI <span class="mark" style="font-size:200px">V2</span></div>
    <div style="font-size:44px;color:var(--sub);max-width:1550px;line-height:1.45;margin-top:26px">
      V1 simulated. <b style="color:var(--ink)">V2 marks to reality</b> — live pool price, real $PONSI contract,
      treasury telemetry tied to the actual market. Still (3,3). Still honest about the name.</div>
    <div style="display:flex;gap:20px;margin-top:56px">
      <div class="glass" style="padding:26px 44px;font-size:30px;font-weight:700">📡 marked to the live pool</div>
      <div class="glass" style="padding:26px 44px;font-size:30px;font-weight:700">🏦 treasury tracks real mcap</div>
      <div class="glass" style="padding:26px 44px;font-size:30px;font-weight:700">Ω (3,3) · 50,000% APY</div>
    </div>
  </div>
  <div class="foot"><span>the name is the risk disclosure</span><span><b>$PONSI · ponsponzi.xyz</b></span></div>`));

// 2) THE EARLY CALL — PONS 10M -> 500M
fs.writeFileSync(path.join(OUT, 'ponsi-v2-early.html'), page(`
  <div style="position:absolute;inset:0;display:flex;align-items:center;gap:100px;padding:0 140px">
    <div style="flex:1.1">
      <div class="pill">WE WERE EARLY · RECEIPTS BELOW</div>
      <div class="serif" style="font-size:120px;line-height:1.02;letter-spacing:-2px;margin-top:36px">We built on PONS<br>at <span style="color:#93b52f">$10M.</span></div>
      <div style="font-size:42px;color:var(--sub);line-height:1.5;margin-top:30px;max-width:900px">
        PONSI V1 launched when the PONS launchpad was a $10M experiment.
        PONS is now a <b style="color:var(--ink)">$500M ecosystem</b> — and PONSI never left.
        V2 is the same conviction, marked to reality.</div>
    </div>
    <div class="glass" style="flex:1;padding:60px 64px">
      <div style="font-size:26px;font-weight:700;letter-spacing:.08em;color:var(--mut);text-transform:uppercase">PONS market cap</div>
      <svg viewBox="0 0 760 420" style="width:100%;margin-top:20px">
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4fc50" stop-opacity=".8"/><stop offset="1" stop-color="#d4fc50" stop-opacity=".05"/></linearGradient></defs>
        <path d="M20 390 L120 382 L200 370 L280 344 L360 330 L420 285 L500 240 L560 170 L640 95 L740 30 L740 400 L20 400 Z" fill="url(#g)"/>
        <path d="M20 390 L120 382 L200 370 L280 344 L360 330 L420 285 L500 240 L560 170 L640 95 L740 30" fill="none" stroke="#93b52f" stroke-width="8" stroke-linecap="round"/>
        <circle cx="120" cy="382" r="13" fill="#fff" stroke="#93b52f" stroke-width="6"/>
        <circle cx="740" cy="30" r="13" fill="#d4fc50" stroke="#5f7d10" stroke-width="6"/>
        <text x="60" y="340" font-family="Inter" font-weight="800" font-size="30" fill="#5f7d10">$10M · PONSI V1 launch</text>
        <text x="440" y="40" font-family="Inter" font-weight="800" font-size="32" fill="#111">$500M · today</text>
      </svg>
      <div style="display:flex;justify-content:space-between;margin-top:18px;font-size:28px;font-weight:700"><span style="color:var(--mut)">then</span><span class="serif" style="font-size:52px;color:#5f7d10">50×</span><span style="color:var(--mut)">now</span></div>
    </div>
  </div>
  <div class="foot"><span>PONS figures per public trackers · not affiliated with PONS</span><span><b>$PONSI · ponsponzi.xyz</b></span></div>`));

// 3) WHAT'S NEW IN V2
const rowHtml = (n, t, d) => `<div style="display:flex;align-items:center;gap:36px;padding:34px 46px;border-top:1px solid var(--line)">
  <div class="serif" style="font-size:56px;color:var(--deep);min-width:90px">${n}</div>
  <div style="min-width:520px;font-size:40px;font-weight:800">${t}</div>
  <div style="font-size:30px;color:var(--sub);line-height:1.45">${d}</div></div>`;
fs.writeFileSync(path.join(OUT, 'ponsi-v2-whatsnew.html'), page(`
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:90px 140px">
    <div class="pill" style="align-self:flex-start">PONSI V2 · CHANGELOG</div>
    <div class="serif" style="font-size:110px;letter-spacing:-2px;margin:26px 0 36px">Same ponzi. <span style="color:#93b52f">Better telemetry.</span></div>
    <div class="glass" style="border-radius:44px;overflow:hidden">
      ${rowHtml('01','Marked to the live pool','$PONSI price on the dashboard is the real Robinhood-chain pool price, refreshed every minute.')}
      ${rowHtml('02','Real contract, on the site','The live $PONSI CA is wired in — what you see is what trades.')}
      ${rowHtml('03','Honest treasury telemetry','The treasury ledger now tracks the actual market, not a fantasy seed number.')}
      ${rowHtml('04','Still (3,3)','Stake, bond, rebase every 5 minutes, 50,000% APY — the machine you know.')}
    </div>
  </div>
  <div class="foot"><span>the name is the risk disclosure · nothing here custodies funds</span><span><b>$PONSI · ponsponzi.xyz</b></span></div>`));

console.log('wrote 3 v2 assets');
