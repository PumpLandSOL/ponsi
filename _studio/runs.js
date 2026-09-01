'use strict';
// ponsi-v2-runs.png — "OHM forks run." ATH bar comparison: OHM / Wonderland / KLIMA / Snowbank vs PONSI V2.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

// heights scaled ~log-ish so Snowbank still reads; labels carry the truth
const BARS = [
  { name: 'OlympusDAO', tick: '$OHM', ath: '$4.4B', h: 620, note: 'the original' },
  { name: 'Wonderland', tick: '$TIME', ath: '$2B', h: 500, note: 'the degen one' },
  { name: 'KLIMA', tick: '$KLIMA', ath: '$1.2B', h: 420, note: 'the green one' },
  { name: 'Snowbank', tick: '$SB', ath: '~$250M', h: 300, note: 'the avalanche one' },
];

const bar = (b) => `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:0">
  <div style="font-family:'Instrument Serif',Georgia,serif;font-size:64px;color:#111">${b.ath}</div>
  <div style="width:78%;height:${b.h}px;background:linear-gradient(180deg,rgba(17,17,17,.85),rgba(17,17,17,.62));border-radius:22px 22px 0 0;margin-top:14px"></div>
  <div style="border-top:2px solid rgba(17,17,17,.2);width:100%;text-align:center;padding-top:18px">
    <div style="font-size:34px;font-weight:800">${b.name}</div>
    <div style="font-size:24px;color:rgba(17,17,17,.5);font-weight:600;margin-top:2px">${b.tick} · ${b.note}</div>
  </div></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{font-family:'Inter',system-ui,sans-serif;color:#111;background:#f4f4f4;overflow:hidden;-webkit-font-smoothing:antialiased}
.stage{width:2400px;height:1350px;position:relative;overflow:hidden;background:
  radial-gradient(52% 46% at 50% -8%,rgba(212,252,80,.42),transparent 64%),
  radial-gradient(38% 34% at 94% 20%,rgba(212,252,80,.18),transparent 60%),#f4f4f4}
.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
.pill{display:inline-flex;font-size:24px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5f7d10;
  background:#f3ffd4;border:2px solid rgba(212,252,80,.65);border-radius:999px;padding:12px 30px}
.foot{position:absolute;left:120px;right:120px;bottom:44px;display:flex;justify-content:space-between;font-size:24px;color:rgba(17,17,17,.4);font-weight:600}
.foot b{color:#5f7d10}
</style></head><body><div class="stage">
  <div style="position:absolute;inset:0;padding:80px 120px 120px;display:flex;flex-direction:column">
    <div class="pill" style="align-self:flex-start">THE (3,3) TRACK RECORD · ATH MARKET CAPS</div>
    <div class="serif" style="font-size:104px;letter-spacing:-2px;margin:22px 0 10px">OHM forks don't walk. <span style="color:#93b52f">They run.</span></div>
    <div style="display:flex;gap:34px;flex:1;align-items:stretch;margin-top:30px">
      ${BARS.map(bar).join('')}
      <div style="flex:1.15;display:flex;flex-direction:column;justify-content:flex-end;align-items:center">
        <div style="font-family:'Instrument Serif',Georgia,serif;font-size:64px;color:#5f7d10">unwritten</div>
        <div style="width:82%;height:680px;background:linear-gradient(180deg,#e6ff9a,#d4fc50 40%,#a8cc3e);border-radius:22px 22px 0 0;margin-top:14px;
          box-shadow:0 20px 60px rgba(140,180,40,.45);display:flex;align-items:flex-start;justify-content:center;padding-top:26px">
          <span style="font-family:'Instrument Serif',Georgia,serif;font-size:120px;color:#111">Ω</span></div>
        <div style="border-top:2px solid #93b52f;width:100%;text-align:center;padding-top:18px">
          <div style="font-size:38px;font-weight:800;color:#5f7d10">PONSI V2</div>
          <div style="font-size:24px;color:rgba(17,17,17,.55);font-weight:600;margin-top:2px">$PONSI · the honest one · day 1</div>
        </div></div>
    </div>
  </div>
  <div class="foot"><span>ATHs approximate, per public history (Oct–Nov 2021 peaks) · not affiliated</span><span><b>$PONSI · ponsponsi.xyz</b></span></div>
</div></body></html>`;

fs.writeFileSync(path.join(OUT, 'ponsi-v2-runs.html'), html);
console.log('wrote ponsi-v2-runs');
