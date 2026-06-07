// House style "Calibrated" — generate per-app splash HTML (light-first, critique-fixed).
import { readFileSync, writeFileSync } from 'node:fs';
const G = '/home/pi/design-lab/glyphs/final';
const glyph = (n) => readFileSync(`${G}/${n}.svg`, 'utf8').trim();

const ACC = { brass:'#C8A84B', steel:'#5E7C93', clay:'#C26B52', sage:'#7C8A5C', eucalypt:'#4F8A80' };

const FONTS = `
@font-face{font-family:'Bebas Neue';src:url('../_fonts/bebas-neue-400.woff2') format('woff2')}
@font-face{font-family:'Share Tech Mono';src:url('../_fonts/share-tech-mono-400.woff2') format('woff2')}
@font-face{font-family:'Barlow';src:url('../_fonts/barlow-400.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Barlow';src:url('../_fonts/barlow-600.woff2') format('woff2');font-weight:600}
@font-face{font-family:'Barlow Condensed';src:url('../_fonts/barlow-condensed-600.woff2') format('woff2');font-weight:600}`;

function css(mode, accent, accentName){
  const dark = mode === 'dark';
  const ground = dark ? '#17160F' : '#F2F0EB';
  const ink    = dark ? '#F2F0EB' : '#14130F';
  const mid    = dark ? '#9B9788' : '#5F5B50';        // telemetry/eyebrow — both >=4.5:1
  const sub    = dark ? '#B9B5A6' : '#4E4A41';        // subtitle
  const tick   = dark ? 'rgba(242,240,235,.20)' : 'rgba(20,19,15,.22)'; // frame ticks (graphic)
  const glowA  = dark ? 0.16 : 0.10;
  const gridA  = dark ? 0.030 : 0.040;
  // Secondary button surfaces (clear affordance, both modes)
  const secBg  = dark ? 'rgba(242,240,235,.05)' : 'rgba(20,19,15,.035)';
  const secBd  = dark ? 'rgba(242,240,235,.22)' : 'rgba(20,19,15,.20)';
  const secInk = dark ? '#D7D3C6' : '#3A372F';
  // CTA fill — steel is mid-luminance and fails AA with dark ink, so lift it slightly.
  const cta    = accentName === 'steel' ? '#6E899E' : accent;
  const ctaBd  = `color-mix(in srgb, ${cta} 78%, #000)`;
  // Accent pip/marks: vivid on dark, darkened on light so they clear 3:1 on cream.
  const pip    = dark ? accent : `color-mix(in srgb, ${accent}, ${ink} 25%)`;
  // Tile hairline so the shape separates even for pale accents on cream.
  const tileBd = `color-mix(in srgb, ${accent}, #000 16%)`;
  const fieldBg= dark ? 'rgba(242,240,235,.05)' : '#FFFFFF';
  const fieldBd= dark ? 'rgba(242,240,235,.16)' : 'rgba(20,19,15,.16)';
  return `
  :root{--ground:${ground};--ink:${ink};--mid:${mid};--sub:${sub};--accent:${accent};--onAccent:#17160F;
        --cta:${cta};--pip:${pip};--tileBd:${tileBd};
        --tick:${tick};--secBg:${secBg};--secBd:${secBd};--secInk:${secInk};--ctaBd:${ctaBd};
        --fieldBg:${fieldBg};--fieldBd:${fieldBd};
        --display:'Bebas Neue',sans-serif;--mono:'Share Tech Mono',ui-monospace,monospace;
        --body:'Barlow',system-ui,sans-serif;--cond:'Barlow Condensed',sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{display:flex;align-items:center;justify-content:center;font-family:var(--body);background:var(--ground);color:var(--ink);overflow:hidden}
  .stage{position:relative;width:100vw;height:100vh;background:var(--ground);display:flex;align-items:center;justify-content:center;padding:30px}
  /* atmosphere: faint edge-faded grid + warm accent glow */
  .stage::before{content:"";position:absolute;inset:0;pointer-events:none;
    background-image:linear-gradient(color-mix(in srgb,var(--ink) ${gridA*100}%,transparent) 1px,transparent 1px),
                     linear-gradient(90deg,color-mix(in srgb,var(--ink) ${gridA*100}%,transparent) 1px,transparent 1px);
    background-size:30px 30px;
    -webkit-mask-image:radial-gradient(circle at 50% 44%,#000,transparent 78%);
            mask-image:radial-gradient(circle at 50% 44%,#000,transparent 78%)}
  .stage::after{content:"";position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(circle at 50% 40%, color-mix(in srgb,var(--accent) ${glowA*100}%,transparent), transparent 60%)}
  /* faint neutral corner registration ticks (the tamed "frame") */
  .tk{position:absolute;width:13px;height:13px;border:0 solid var(--tick);z-index:1}
  .tk.tl{top:20px;left:20px;border-top-width:1.5px;border-left-width:1.5px}
  .tk.tr{top:20px;right:20px;border-top-width:1.5px;border-right-width:1.5px}
  .tk.bl{bottom:20px;left:20px;border-bottom-width:1.5px;border-left-width:1.5px}
  .tk.br{bottom:20px;right:20px;border-bottom-width:1.5px;border-right-width:1.5px}

  .col{position:relative;z-index:2;width:100%;max-width:328px;display:flex;flex-direction:column;align-items:center;gap:24px}
  .head{display:flex;flex-direction:column;align-items:center;gap:13px}
  .tile{width:62px;height:62px;border-radius:16px;background:var(--accent);color:var(--onAccent);display:flex;align-items:center;justify-content:center;
        box-shadow:0 6px 22px color-mix(in srgb,var(--accent) 26%,transparent), inset 0 1px 0 rgba(255,255,255,.22), inset 0 0 0 1px var(--tileBd)}
  .tile svg{width:32px;height:32px}
  .eyebrow{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;letter-spacing:.4em;color:var(--mid);text-transform:uppercase}
  .eyebrow .pip{width:6px;height:6px;background:var(--pip);border-radius:1px}
  .title{font-family:var(--cond);font-weight:600;font-size:31px;line-height:1.04;letter-spacing:.01em;color:var(--ink);text-align:center}
  .subtitle{margin-top:6px;font-size:13.5px;line-height:1.4;color:var(--sub);text-align:center}

  .actions{width:100%;display:flex;flex-direction:column;gap:11px}
  .btn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 16px;border-radius:13px;font-family:var(--body);font-weight:600;font-size:14.5px;cursor:pointer;border:1px solid transparent}
  .btn.primary{background:var(--cta);color:var(--onAccent);border-color:var(--ctaBd);
        box-shadow:0 2px 10px color-mix(in srgb,var(--cta) 30%,transparent), inset 0 1px 0 rgba(255,255,255,.28)}
  .btn.ghost{background:var(--secBg);color:var(--secInk);border-color:var(--secBd)}
  .mschip{width:22px;height:22px;border-radius:5px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.2)}
  .divider{display:flex;align-items:center;gap:9px;font-size:11px;color:var(--mid);font-family:var(--mono);letter-spacing:.2em}
  .divider .line{flex:1;height:1px;background:var(--secBd)}

  /* form fields */
  .field{width:100%;display:flex;flex-direction:column;gap:6px;text-align:left}
  .field label{font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--mid);text-transform:uppercase}
  .field input,.field select{width:100%;padding:13px 14px;border-radius:12px;background:var(--fieldBg);border:1px solid var(--fieldBd);color:var(--ink);font-family:var(--body);font-size:15px}
  .field input::placeholder{color:var(--mid)}
  .codebox{width:100%;display:flex;gap:8px}
  .codebox .cell{flex:1;aspect-ratio:1/1.15;border-radius:11px;background:var(--fieldBg);border:1px solid var(--fieldBd);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:22px;color:var(--ink)}
  .codebox .cell.f{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 28%,transparent)}

  .statusline{position:absolute;left:0;right:0;bottom:56px;text-align:center;font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--mid);z-index:2}
  .statusline .dot{color:var(--accent)}
  .footer{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--mid);z-index:2}
  .footer .aud{font-family:var(--display);letter-spacing:.05em;font-size:15px;vertical-align:-1px}
  .footer .aud b{color:var(--ink);font-weight:400}.footer .aud i{color:var(--accent);font-style:normal}`;
}

const MSLOGO = `<span class="mschip"><svg viewBox="0 0 21 21" width="14" height="14"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg></span>`;

function actionsHtml(cfg){
  if(cfg.layout === 'form'){
    const fields = (cfg.fields||[]).map(f=>{
      if(f.type==='code') return `<div class="field"><label>${f.label}</label><div class="codebox">${Array.from({length:f.len||6}).map((_,i)=>`<div class="cell${i===0?' f':''}">${i===0?'•':''}</div>`).join('')}</div></div>`;
      if(f.type==='select') return `<div class="field"><label>${f.label}</label><select><option>${f.value||f.options?.[0]||''}</option></select></div>`;
      return `<div class="field"><label>${f.label}</label><input placeholder="${f.placeholder||''}" value="${f.value||''}"></div>`;
    }).join('');
    return `<div class="actions">${fields}<button class="btn primary">${cfg.primaryLabel||'Continue'}</button>${cfg.secondaryLabel?`<button class="btn ghost">${cfg.secondaryLabel}</button>`:''}</div>`;
  }
  // oauth layout
  return `<div class="actions">
    <button class="btn primary">${cfg.oauth?MSLOGO:''}<span>${cfg.primaryLabel||'Sign in with Microsoft'}</span></button>
    ${cfg.secondaryLabel?`<div class="divider"><span class="line"></span><span>or</span><span class="line"></span></div><button class="btn ghost">${cfg.secondaryLabel}</button>`:''}
  </div>`;
}

export function render(cfg){
  const accent = ACC[cfg.accent] || cfg.accent;
  const g = glyph(cfg.glyph);
  const status = cfg.status || 'SECURE CONNECTION';
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${FONTS}\n${css(cfg.mode, accent, cfg.accent)}</style></head>
<body><div class="stage">
  <span class="tk tl"></span><span class="tk tr"></span><span class="tk bl"></span><span class="tk br"></span>
  <div class="col">
    <div class="head">
      <div class="tile">${g}</div>
      <div class="eyebrow"><span class="pip"></span>${cfg.eyebrow}</div>
      <div><div class="title">${cfg.title}</div><div class="subtitle">${cfg.subtitle}</div></div>
    </div>
    ${actionsHtml(cfg)}
  </div>
  <div class="statusline">${status} <span class="dot">·</span> BUILT IN AUSTRALIA</div>
  <div class="footer">POWERED BY <span class="aud"><b>A</b><i>u</i><b>D</b></span></div>
</div></body></html>`;
}

// ---- The application map (sibling mode: each app shows its own glyph) ----
export const APPS = [
  { id:'venue-audit', accent:'brass', mode:'light', eyebrow:'AUDITS', title:'Venue Audit', subtitle:'Venue inspection & scoring', glyph:'venue-audit', layout:'oauth', oauth:true, primaryLabel:'Sign in with Microsoft', secondaryLabel:'Use team passcode' },
  { id:'cleaning-audit', accent:'brass', mode:'light', eyebrow:'AUDITS', title:'Cleaning Audit', subtitle:'Cleaning inspection & sign-off', glyph:'cleaning-audit', layout:'form', primaryLabel:'Continue', fields:[{type:'text',label:'Your name',placeholder:'e.g. Sam Rivera'},{type:'code',label:'Access code',len:6}] },
  { id:'precinct-compliance', accent:'steel', mode:'dark', eyebrow:'DASHBOARDS', title:'Precinct Compliance', subtitle:'Checklist analytics', glyph:'precinct-compliance', layout:'oauth', oauth:true, primaryLabel:'Sign in with Microsoft', secondaryLabel:'Continue with static data' },
  { id:'cleaning-dashboard', accent:'steel', mode:'dark', eyebrow:'DASHBOARDS', title:'Cleaning Dashboard', subtitle:'Cleaning status board', glyph:'cleaning-dashboard', layout:'form', primaryLabel:'Open dashboard', fields:[{type:'code',label:'Access code',len:6}] },
  { id:'precinct-ops', accent:'steel', mode:'dark', eyebrow:'DASHBOARDS', title:'Precinct Ops', subtitle:'Live operations overview', glyph:'precinct-ops', layout:'form', primaryLabel:'Open operations', fields:[{type:'code',label:'6-digit access code',len:6}] },
  { id:'first-aid-register', accent:'clay', mode:'light', eyebrow:'REGISTERS', title:'First Aid Register', subtitle:'Incident & treatment log', glyph:'first-aid-register', layout:'form', primaryLabel:'Open register', fields:[{type:'select',label:'Role',value:'First aid officer'},{type:'code',label:'PIN',len:4}] },
  { id:'headset-issuance', accent:'clay', mode:'light', eyebrow:'REGISTERS', title:'Headset Issuance', subtitle:'Equipment sign-out', glyph:'headset-issuance', layout:'form', primaryLabel:'Continue', fields:[{type:'text',label:'Your name',placeholder:'e.g. Jordan Lee'},{type:'code',label:'Access code',len:6}] },
  { id:'security-tracker', accent:'sage', mode:'dark', eyebrow:'LOGS & TRACKERS', title:'Security Tracker', subtitle:'Patrol & incident tracking', glyph:'security-tracker', layout:'form', primaryLabel:'Open tracker', fields:[{type:'code',label:'Access code',len:6}] },
  { id:'control-log', accent:'sage', mode:'dark', eyebrow:'LOGS & TRACKERS', title:'Control Log', subtitle:'Control-point logging', glyph:'control-log', layout:'form', primaryLabel:'Open log', fields:[{type:'code',label:'Access code',len:6}] },
];

// identical mode: every app in a family shows the FAMILY mark + family name
export const FAMILY_MARKS = {
  brass:{glyph:'family-audits', name:'AUDITS'}, steel:{glyph:'family-dashboards', name:'DASHBOARDS'},
  clay:{glyph:'family-registers', name:'REGISTERS'}, sage:{glyph:'family-logs', name:'LOGS & TRACKERS'},
};

if (process.argv[2] === 'build') {
  for (const a of APPS) writeFileSync(`/home/pi/design-lab/family/${a.id}.html`, render(a));
  console.log('family written:', APPS.length);
}
