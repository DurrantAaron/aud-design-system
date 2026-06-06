import React from 'react'
import { createRoot } from 'react-dom/client'
import { DuotoneMissionControl, EditorialMissionControl, MissionControlHub } from '@aud/brand'
const apps = [
  { id:'venue-audit', name:'Venue Audit', family:'audits', metric:'87% pass' },
  { id:'cleaning-audit', name:'Cleaning Audit', family:'audits', metric:'92%' },
  { id:'precinct-compliance', name:'Precinct Compliance', family:'dashboards', live:true },
  { id:'cleaning-dashboard', name:'Cleaning Dashboard', family:'dashboards', live:true },
  { id:'first-aid-register', name:'First Aid Register', family:'registers', locked:true },
  { id:'headset-issuance', name:'Headset Issuance', family:'registers', metric:'38 out' },
  { id:'security-tracker', name:'Security Tracker', family:'logs', metric:'1 flag' },
  { id:'control-log', name:'Control Log', family:'logs', locked:true },
] as any
const ops = { venuesLive:12, venuesTotal:13, runEvents:1482, openFlags:3 }
const q=new URLSearchParams(location.search)
const hub=q.get('hub')||'duotone', theme=(q.get('theme')||'dark') as 'light'|'dark'
const common={ apps, ops, theme, suiteName:'Precinct Ops', signedInAs:'A. Durrant' } as any
const el = hub==='editorial' ? <EditorialMissionControl {...common}/>
  : hub==='os' ? <MissionControlHub {...common} view="home"/>
  : <DuotoneMissionControl {...common}/>
createRoot(document.getElementById('root')!).render(el)
