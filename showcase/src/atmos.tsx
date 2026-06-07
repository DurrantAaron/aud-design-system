import React from "react"
import { createRoot } from "react-dom/client"
import "@aud/brand/fonts.css"
import "@aud/brand/tokens.css"
import { SplashScreen, AppMark, FamilyProvider, accents } from "@aud/brand"

const G:Record<string,string> = {"venue-audit":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2\"/><rect x=\"9\" y=\"3.5\" width=\"6\" height=\"3\" rx=\"1\"/><path d=\"m8.5 13 2.5 2.5 4.5-5\"/></svg>","precinct-compliance":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3 5 5.5v6c0 4.4 2.9 7.6 7 9 4.1-1.4 7-4.6 7-9v-6L12 3Z\"/><path d=\"m8.5 12 2.5 2.5 4.5-5\"/></svg>","first-aid-register":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"3.5\"/><path d=\"M12 8.5v7M8.5 12h7\"/></svg>","security-tracker":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 3.5v17\"/><circle cx=\"7\" cy=\"7\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"7\" cy=\"12\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"7\" cy=\"17\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M9 7h8\"/><path d=\"M9 12h6\"/><path d=\"M9 17h8\"/></svg>"}
const Glyph = ({name}:{name:string}) => <span dangerouslySetInnerHTML={{__html:G[name]}} />
const MS = (<span style={{width:22,height:22,borderRadius:5,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><svg viewBox="0 0 21 21" width={14} height={14}><rect x={1} y={1} width={9} height={9} fill="#f25022"/><rect x={11} y={1} width={9} height={9} fill="#7fba00"/><rect x={1} y={11} width={9} height={9} fill="#00a4ef"/><rect x={11} y={11} width={9} height={9} fill="#ffb900"/></svg></span>)

const field = (label:string, el:React.ReactNode) => (<div style={{display:"flex",flexDirection:"column",gap:6,textAlign:"left"}}><label style={{fontFamily:"var(--aud-font-mono, monospace)",fontSize:10,letterSpacing:"0.22em",color:"var(--aud-mid)",textTransform:"uppercase"}}>{label}</label>{el}</div>)
const inp = (ph:string) => <input placeholder={ph} style={{padding:"13px 14px",borderRadius:12,background:"var(--aud-surface)",border:"1px solid var(--aud-rule)",color:"var(--aud-ink)",fontSize:15}} />

const APPS:Record<string,any> = {
  "venue-audit":{family:"audits",accent:accents.brass,eyebrow:"AUDITS",title:"Venue Audit",subtitle:"Venue inspection & scoring",glyph:"venue-audit",primary:{label:"Sign in with Microsoft",icon:MS},secondary:{label:"Use team passcode"}},
  "precinct-compliance":{family:"dashboards",accent:accents.steel,eyebrow:"DASHBOARDS",title:"Precinct Compliance",subtitle:"Checklist analytics",glyph:"precinct-compliance",primary:{label:"Sign in with Microsoft",icon:MS},secondary:{label:"Continue with static data"}},
  "first-aid-register":{family:"registers",accent:accents.clay,eyebrow:"REGISTERS",title:"First Aid Register",subtitle:"Incident & treatment log",glyph:"first-aid-register",form:true,primary:{label:"Open register"},fields:[field("Role",inp("First aid officer")),field("PIN",inp("••••"))]},
  "security-tracker":{family:"logs",accent:accents.sage,eyebrow:"LOGS & TRACKERS",title:"Security Tracker",subtitle:"Patrol & incident tracking",glyph:"security-tracker",form:true,primary:{label:"Open tracker"},fields:[field("Access code",inp("------"))]},
}
const app = new URLSearchParams(location.search).get("app") || "venue-audit"
const c = APPS[app]
createRoot(document.getElementById("root")!).render(
  <FamilyProvider family={c.family} style={{minHeight:"100vh"}}>
    <SplashScreen atmosphere mark={<AppMark accent={c.accent}><Glyph name={c.glyph}/></AppMark>}
      eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} accent={c.accent}
      status={<>SECURE CONNECTION · BUILT IN AUSTRALIA</>}
      primary={c.primary} secondary={c.secondary} formMode={c.form}>
      {c.fields ? <>{c.fields}</> : null}
    </SplashScreen>
  </FamilyProvider>
)
