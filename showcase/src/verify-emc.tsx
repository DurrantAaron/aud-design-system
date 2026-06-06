import React from 'react'
import { createRoot } from 'react-dom/client'
import { EditorialMissionControl } from '@aud/brand'
import type { MissionControlApp } from '@aud/brand'

const APPS: MissionControlApp[] = [
  { id: 'precinct-compliance', name: 'Precinct Compliance', family: 'dashboards', live: true },
  { id: 'cleaning-dashboard', name: 'Cleaning Dashboard', family: 'dashboards', live: true },
  { id: 'venue-audit', name: 'Venue Audit', family: 'audits', metric: '87%' },
  { id: 'cleaning-audit', name: 'Cleaning Audit', family: 'audits', metric: '92%' },
  { id: 'security-tracker', name: 'Security Tracker', family: 'logs', metric: '1 flag' },
  { id: 'headset-issuance', name: 'Headset Issuance', family: 'registers', metric: '38 out' },
  { id: 'first-aid-register', name: 'First Aid Register', family: 'registers', locked: true },
  { id: 'control-log', name: 'Control Log', family: 'logs', locked: true },
]

const q = new URLSearchParams(location.search)
const theme = (q.get('theme') || 'dark') as 'light' | 'dark'

createRoot(document.getElementById('root')!).render(
  <EditorialMissionControl
    theme={theme}
    signedInAs="A. Durrant"
    ops={{ venuesLive: 12, venuesTotal: 13, runEvents: 1482, openFlags: 3 }}
    apps={APPS}
  />,
)
