import React from 'react'
import { createRoot } from 'react-dom/client'
import { EditorialSplash, DuotoneSplash } from '@aud/brand'
import venue from '../../src/glyphs/venue-audit.svg?raw'
import compliance from '../../src/glyphs/precinct-compliance.svg?raw'
import firstaid from '../../src/glyphs/first-aid-register.svg?raw'
const G:Record<string,string> = { 'venue-audit':venue, 'precinct-compliance':compliance, 'first-aid-register':firstaid }
const Glyph = ({n}:{n:string}) => <span dangerouslySetInnerHTML={{__html:G[n]}} />
const APPS:Record<string,any> = {
  'venue-audit':{appName:'Venue Audit',category:'Audits',family:'audits',description:'Venue inspection & scoring'},
  'precinct-compliance':{appName:'Precinct Compliance',category:'Dashboards',family:'dashboards',description:'Checklist analytics'},
  'first-aid-register':{appName:'First Aid Register',family:'registers',category:'Registers',description:'Incident & treatment log'},
}
const q=new URLSearchParams(location.search)
const skin=q.get('skin')||'editorial', appKey=q.get('app')||'venue-audit', theme=(q.get('theme')||'dark') as 'light'|'dark'
const a=APPS[appKey]
const common={...a, theme, mark:<Glyph n={appKey}/>, primary:{label:'Sign in with Microsoft'}}
const el = skin==='duotone'
  ? <DuotoneSplash {...common} meta={{mode:'On-site',sync:'Live · Cloud',access:'SSO'}} secondary={{label:'Continue with access code'}}/>
  : <EditorialSplash {...common} secondary={{label:'Enter with a team passcode'}}/>
createRoot(document.getElementById('root')!).render(el)
