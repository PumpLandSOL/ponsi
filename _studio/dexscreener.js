'use strict';
// DexScreener profile assets: pfp 500x500 (1:1) + header 1500x500 (3:1), V2 branding.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'out');

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const HEAD = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
:root{--accent:#d4fc50;--dark:#0d0d0d;--ink:#f2f2f2;--sub:rgba(242,242,242,.6)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--dark);overflow:hidden;-webkit-font-smoothing:antialiased}
.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400}
.mark{font-family:'Instrument Serif',Georgia,serif;line-height:.86;
  background:linear-gradient(165deg,#ffffff 3%,#f2ffd2 22%,var(--accent) 56%,#8fae2e 92%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 0 rgba(255,255,255,.14)) drop-shadow(0 12px 46px rgba(212,252,80,.55))}
`;

// PFP 500x500 — big glassy Ω + V2 tag (reads at 32px)
fs.writeFileSync(path.join(OUT, 'ponsi-v2-dex-pfp.html'), HEAD + `
.stage{width:500px;height:500px;position:relative;overflow:hidden;background:
  radial-gradient(58% 48% at 50% 32%,rgba(212,252,80,.22),transparent 62%),#0d0d0d}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.mark{font-size:280px}
.v2{margin-top:8px;font-size:44px;font-weight:800;letter-spacing:1px;color:#111;background:var(--accent);border-radius:14px;padding:4px 22px}
</style></head><body><div class="stage"><div class="wrap">
  <div class="mark">Ω</div><div class="v2">PONSI V2</div>
</div></div></body></html>`);

// HEADER 1500x500 (3:1)
fs.writeFileSync(path.join(OUT, 'ponsi-v2-dex-header.html'), HEAD + `
.stage{width:1500px;height:500px;position:relative;overflow:hidden;background:
  radial-gradient(46% 90% at 22% 30%,rgba(212,252,80,.22),transparent 62%),
  radial-gradient(40% 80% at 92% 80%,rgba(212,252,80,.12),transparent 60%),#0d0d0d}
.wrap{position:absolute;inset:0;display:flex;align-items:center;gap:56px;padding:0 90px}
.mark{font-size:330px;flex:none}
.h{font-family:'Instrument Serif',Georgia,serif;font-size:120px;line-height:.95;letter-spacing:2px}
.h .lime{color:var(--accent)}
.s{font-size:30px;color:var(--sub);margin-top:18px;font-weight:600}
.s b{color:var(--ink)}
.tag{position:absolute;right:90px;top:44px;font-size:22px;font-weight:800;letter-spacing:2px;color:#111;background:var(--accent);border-radius:999px;padding:10px 26px}
.url{position:absolute;right:90px;bottom:44px;font-size:28px;font-weight:800;color:var(--accent)}
</style></head><body><div class="stage"><div class="wrap">
  <div class="mark">Ω</div>
  <div><div class="h">PONSI <span class="lime">V2</span></div>
  <div class="s">the self-aware (3,3) reserve on PONS · <b>marked to reality</b> · real ETH bond desk</div></div>
  <div class="tag">50,000% APY</div><div class="url">ponsponsi.xyz</div>
</div></div></body></html>`);

console.log('wrote dex assets');
