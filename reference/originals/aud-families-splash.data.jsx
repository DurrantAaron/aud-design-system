/* ==========================================================================
   AuD family model — data. Function-grouped (Decision 1 = B).
   One operator, so venue/operator names stay out (kept in the apps, not here).
   ========================================================================== */

// The four function families. Accent = family identity. Mode = work context.
const FAMILIES = {
  audits: {
    key: 'audits', code: 'FAM·A', name: 'Audits', glyph: 'AU',
    accent: ACCENTS.brass, accentName: 'Brass', mode: 'light',
    line: 'Field inspection in daylight — brass is the flagship anchor of the suite.',
    context: 'On-site, handheld, daytime',
  },
  dashboards: {
    key: 'dashboards', code: 'FAM·D', name: 'Dashboards', glyph: 'DS',
    accent: ACCENTS.steel, accentName: 'Steel', mode: 'dark',
    line: 'Control-room monitoring, often after dark — steel is the night-shift signal.',
    context: 'Wall display / desk, low light',
  },
  registers: {
    key: 'registers', code: 'FAM·R', name: 'Registers', glyph: 'RG',
    accent: ACCENTS.clay, accentName: 'Clay', mode: 'light',
    line: 'Staffed point-of-service desks — clay is the warm "care & record" note.',
    context: 'Reception / care desk, daytime',
  },
  logs: {
    key: 'logs', code: 'FAM·L', name: 'Logs & Trackers', glyph: 'LG',
    accent: ACCENTS.sage, accentName: 'Sage', mode: 'dark',
    line: 'Security & control logging on the night shift — sage holds the line quietly.',
    context: 'Patrol / control point, low light',
  },
};

const RESERVE = { accent: ACCENTS.eucalypt, accentName: 'Eucalypt', note: 'Held in reserve for a 5th family.' };

// App inventory. variant = native auth → which splash layout the app uses.
// oauth = OAuth-first (button on top); form = formMode (fields above button).
const APPS = [
  { name: 'Venue Audit',        glyph: 'VA', family: 'audits',     auth: 'Microsoft OAuth + team passcode', variant: 'oauth', status: 'live',    was: 'brass' },
  { name: 'Cleaning Audit',     glyph: 'CA', family: 'audits',     auth: 'Name + access code',              variant: 'form',  status: 'live',    was: 'eucalypt' },
  { name: 'Precinct Compliance',glyph: 'PC', family: 'dashboards', auth: 'Microsoft OAuth + static data',   variant: 'oauth', status: 'live',    was: 'steel*' },
  { name: 'Cleaning Dashboard', glyph: 'CD', family: 'dashboards', auth: 'Access code',                     variant: 'form',  status: 'suite',   was: '—' },
  { name: 'Precinct Ops',       glyph: 'PO', family: 'dashboards', auth: '6-digit access code',             variant: 'form',  status: 'live',    was: 'sage' },
  { name: 'First Aid Register', glyph: 'FA', family: 'registers',  auth: 'PIN + role',                      variant: 'form',  status: 'live',    was: 'clay' },
  { name: 'Headset Issuance',   glyph: 'HI', family: 'registers',  auth: 'Name + access code',              variant: 'form',  status: 'suite',   was: '—' },
  { name: 'Security Tracker',   glyph: 'ST', family: 'logs',       auth: 'Access code',                     variant: 'form',  status: 'suite',   was: '—' },
  { name: 'Control Log',        glyph: 'CL', family: 'logs',       auth: 'Access code (TBD)',               variant: 'form',  status: 'planned', was: '—' },
];

// @aud/brand additions the splashes imply (Deliverable 4).
const BRAND_ADDITIONS = [
  { sig: '<FamilyProvider family="audits">', kind: 'new', note: 'Sets --aud-accent + data-theme for the whole subtree from one family key.' },
  { sig: 'familyPresets: Record<FamilyKey, {accent, mode}>', kind: 'new', note: 'The 4 presets as tokens. Single source of truth; eucalypt reserved.' },
  { sig: 'formMode / actionsLast?: boolean', kind: 'add', note: 'On <SplashScreen>. Renders field children ABOVE the primary action.' },
  { sig: 'fieldNote?: ReactNode', kind: 'add', note: 'On <SplashScreen>. A mono micro-line under the fields.' },
  { sig: 'glyph slot (short-code | icon)', kind: 'have', note: '<AppMark> already takes any child.' },
];

Object.assign(window, { FAMILIES, RESERVE, APPS, BRAND_ADDITIONS });
