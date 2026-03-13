import { useState, useEffect } from 'react'

// ── palette & data ──────────────────────────────────────────────────────────
const COUNTRIES = [
  { id: 'ng', name: 'Nigeria',      risk: 78, trend: -4, region: [9,8],    pop: 220 },
  { id: 'et', name: 'Ethiopia',     risk: 82, trend: -7, region: [9,38],   pop: 123 },
  { id: 'ke', name: 'Kenya',        risk: 52, trend:  2, region: [-1,37],  pop: 55  },
  { id: 'tz', name: 'Tanzania',     risk: 61, trend: -3, region: [-6,35],  pop: 63  },
  { id: 'za', name: 'South Africa', risk: 44, trend:  5, region: [-29,25], pop: 60  },
  { id: 'gh', name: 'Ghana',        risk: 38, trend:  3, region: [8,-1],   pop: 33  },
  { id: 'sn', name: 'Senegal',      risk: 49, trend: -6, region: [14,-14], pop: 17  },
  { id: 'ml', name: 'Mali',         risk: 88, trend: -9, region: [17,-4],  pop: 22  },
  { id: 'cm', name: 'Cameroon',     risk: 71, trend: -5, region: [4,12],   pop: 27  },
  { id: 'cd', name: 'DRC',          risk: 85, trend: -8, region: [-4,24],  pop: 100 },
  { id: 'ug', name: 'Uganda',       risk: 67, trend: -2, region: [1,32],   pop: 47  },
  { id: 'mz', name: 'Mozambique',   risk: 63, trend: -4, region: [-18,35], pop: 33  },
  { id: 'zw', name: 'Zimbabwe',     risk: 74, trend: -3, region: [-20,30], pop: 15  },
  { id: 'zm', name: 'Zambia',       risk: 55, trend:  1, region: [-14,28], pop: 19  },
  { id: 'rw', name: 'Rwanda',       risk: 57, trend: -1, region: [-2,30],  pop: 13  },
  { id: 'bj', name: 'Benin',        risk: 46, trend: -5, region: [9,2],    pop: 13  },
]

const PILLARS = [
  {
    id: 'electoral', label: 'Electoral Integrity', icon: '🗳',
    score: 52, trend: -6, velocity: 'fast',
    metrics: [
      { name: 'Election Fairness Index',          val: 48, src: 'V-Dem 2024' },
      { name: 'Voter Suppression Signals',        val: 63, src: 'IFES 2024'  },
      { name: 'Electoral Commission Independence',val: 41, src: 'V-Dem'      },
    ],
  },
  {
    id: 'civic', label: 'Civic Space', icon: '🏛',
    score: 44, trend: -4, velocity: 'moderate',
    metrics: [
      { name: 'CSO Restrictions',  val: 58, src: 'CIVICUS 2024' },
      { name: 'Media Freedom',     val: 39, src: 'RSF 2024'     },
      { name: 'Internet Shutdowns',val: 71, src: 'NetBlocks'    },
    ],
  },
  {
    id: 'ruleoflaw', label: 'Rule of Law', icon: '⚖',
    score: 41, trend: -3, velocity: 'slow',
    metrics: [
      { name: 'Judicial Independence', val: 37, src: 'WJP 2024' },
      { name: 'Corruption Perception', val: 29, src: 'TI 2024'  },
      { name: 'Executive Overreach',   val: 64, src: 'V-Dem'    },
    ],
  },
  {
    id: 'violence', label: 'Political Violence', icon: '⚡',
    score: 66, trend: -9, velocity: 'fast',
    metrics: [
      { name: 'Protest Density',     val: 72, src: 'ACLED 2024' },
      { name: 'Opposition Arrests',  val: 68, src: 'V-Dem'      },
      { name: 'Civil Unrest Events', val: 59, src: 'ACLED'      },
    ],
  },
  {
    id: 'digital', label: 'Digital Governance', icon: '📡',
    score: 57, trend: -7, velocity: 'fast',
    metrics: [
      { name: 'AI Surveillance Laws',  val: 61, src: 'EFF 2024'     },
      { name: 'Disinformation Spikes', val: 74, src: 'DFRLab'       },
      { name: 'Platform Regulation',   val: 48, src: 'Freedom House' },
    ],
  },
]

const SCENARIOS = [
  {
    id: 'election', label: 'Election Shock', icon: '🗳',
    prob: 34, recovery: 62,
    summary: 'Contested results trigger 4–8 weeks of civic unrest. Judicial capacity critical. CSO networks absorb ~40% of mobilisation energy.',
    drivers: ['Electoral commission independence', 'Diaspora networks', 'International observation presence'],
  },
  {
    id: 'coup', label: 'Coup Attempt', icon: '🎖',
    prob: 18, recovery: 41,
    summary: 'Military factions exploit governance vacuum. Recovery strongly correlated with regional body response (AU/ECOWAS) within 72 hrs.',
    drivers: ['Civil-military relations', 'Economic grievance index', 'Regional solidarity'],
  },
  {
    id: 'repression', label: 'Severe Repression', icon: '🔒',
    prob: 51, recovery: 55,
    summary: 'Incremental civic space closure. Digital repression precedes physical. Underground civil society becomes primary resilience layer.',
    drivers: ['Internet freedom index', 'CSO density', 'International media attention'],
  },
  {
    id: 'economic', label: 'Economic Crash', icon: '📉',
    prob: 44, recovery: 48,
    summary: 'GDP contraction >5% historically correlates with 2.3× protest frequency. Youth unemployment is the primary transmission mechanism.',
    drivers: ['Youth unemployment', 'Food price volatility', 'Remittance dependency'],
  },
]

const ALLOCATIONS = [
  { country: 'Nigeria',      theme: 'Electoral Integrity', amount: 4.2, risk: 78, marginal: 8.4 },
  { country: 'Ethiopia',     theme: 'Civic Space',         amount: 3.1, risk: 82, marginal: 9.1 },
  { country: 'Mali',         theme: 'Rule of Law',         amount: 1.8, risk: 88, marginal: 9.7 },
  { country: 'DRC',          theme: 'Political Violence',  amount: 2.9, risk: 85, marginal: 9.4 },
  { country: 'Zimbabwe',     theme: 'Digital Governance',  amount: 1.4, risk: 74, marginal: 7.2 },
  { country: 'Ghana',        theme: 'Electoral Integrity', amount: 2.6, risk: 38, marginal: 4.1 },
  { country: 'Kenya',        theme: 'Civic Space',         amount: 3.8, risk: 52, marginal: 5.8 },
  { country: 'South Africa', theme: 'Rule of Law',         amount: 5.1, risk: 44, marginal: 3.9 },
]

const NARRATIVES = [
  { label: 'Anti-democratic rhetoric',    val: 67, delta: +8,  type: 'threat'   },
  { label: 'Pro-sovereignty framing',     val: 74, delta: +12, type: 'threat'   },
  { label: 'Civic mobilisation',          val: 52, delta: -3,  type: 'neutral'  },
  { label: 'Election integrity discourse',val: 61, delta: +5,  type: 'threat'   },
  { label: 'Disinformation campaigns',    val: 58, delta: +14, type: 'threat'   },
  { label: 'Youth democracy content',     val: 44, delta: +7,  type: 'positive' },
]

// ── helpers ─────────────────────────────────────────────────────────────────
const riskColor = (v) =>
  v >= 75 ? '#ff3b3b' : v >= 55 ? '#f5a623' : v >= 40 ? '#f5d623' : '#2ecc71'

const riskLabel = (v) =>
  v >= 75 ? 'CRITICAL' : v >= 55 ? 'ELEVATED' : v >= 40 ? 'MODERATE' : 'STABLE'

const velocityColor = (v) =>
  v === 'fast' ? '#ff3b3b' : v === 'moderate' ? '#f5a623' : '#2ecc71'

const generateSparkline = (current, trend, n = 12) => {
  const arr = []
  let v = current - trend * n
  for (let i = 0; i < n; i++) {
    v += trend + (Math.random() - 0.5) * 3
    arr.push(Math.max(5, Math.min(99, v)))
  }
  return arr
}

// ── Sub-components ──────────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#f5a623', height = 28 }) => {
  const w = 80, h = height
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min + 0.001)) * h
    return `${x},${y}`
  }).join(' ')
  const lastPt = pts.split(' ').pop().split(',')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={color} />
    </svg>
  )
}

const RadarChart = ({ data }) => {
  const cx = 120, cy = 120, r = 85
  const n = data.length
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2
  const pt = (i, val) => {
    const a = angle(i), rv = (val / 100) * r
    return [cx + Math.cos(a) * rv, cy + Math.sin(a) * rv]
  }
  const gridPts = (ratio) =>
    data.map((_, i) => {
      const a = angle(i)
      return `${cx + Math.cos(a) * r * ratio},${cy + Math.sin(a) * r * ratio}`
    }).join(' ')
  const valuePts = data.map((d, i) => pt(i, d.score).join(',')).join(' ')
  return (
    <svg width={240} height={240} style={{ overflow: 'visible' }}>
      {[0.25, 0.5, 0.75, 1].map(ratio => (
        <polygon key={ratio} points={gridPts(ratio)}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const a = angle(i)
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        )
      })}
      <polygon points={valuePts} fill="rgba(245,166,35,0.15)"
        stroke="#f5a623" strokeWidth="1.5" />
      {data.map((d, i) => {
        const [x, y] = pt(i, d.score)
        const a = angle(i)
        const lx = cx + Math.cos(a) * (r + 18)
        const ly = cy + Math.sin(a) * (r + 18)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#f5a623" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="'DM Mono', monospace">
              {d.icon}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const AfricaMap = ({ countries, onSelect, selected }) => {
  const toXY = ([lat, lon]) => {
    const x = ((lon + 18) / 70) * 360 + 20
    const y = ((38 - lat) / 73) * 400 + 20
    return [x, y]
  }
  return (
    <svg width="400" height="440" style={{ maxWidth: '100%', height: 'auto' }}>
      <rect width="400" height="440" fill="transparent" />
      {[...Array(8)].map((_, i) => (
        <line key={`h${i}`} x1={20} y1={20 + i * 55} x2={380} y2={20 + i * 55}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {[...Array(8)].map((_, i) => (
        <line key={`v${i}`} x1={20 + i * 50} y1={20} x2={20 + i * 50} y2={420}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {countries.map((c) => {
        const [x, y] = toXY(c.region)
        const r = Math.sqrt(c.pop) * 1.4
        const col = riskColor(c.risk)
        const isSelected = selected === c.id
        return (
          <g key={c.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(c.id)}>
            <circle cx={x} cy={y} r={r + 6} fill={col} opacity={0.08} />
            <circle cx={x} cy={y} r={r}
              fill={col} opacity={isSelected ? 1 : 0.7}
              stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.3)'}
              strokeWidth={isSelected ? 2 : 1} />
            {isSelected && (
              <circle cx={x} cy={y} r={r + 10}
                fill="none" stroke={col} strokeWidth="1"
                opacity="0.5" strokeDasharray="3,3" />
            )}
            <text x={x} y={y + r + 10} textAnchor="middle"
              fontSize="9.5" fill="rgba(255,255,255,0.7)"
              fontFamily="'DM Mono', monospace" fontWeight="500">
              {c.name}
            </text>
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fill="#fff" fontFamily="'DM Mono', monospace" fontWeight="700">
              {c.risk}
            </text>
          </g>
        )
      })}
      {[['CRITICAL', '#ff3b3b'], ['>75 ELEVATED', '#f5a623'], ['MODERATE', '#f5d623'], ['STABLE', '#2ecc71']].map(([l, c], i) => (
        <g key={l} transform={`translate(22,${390 - i * 14})`}>
          <circle r="4" fill={c} opacity="0.8" />
          <text x={10} y={1} dominantBaseline="middle" fontSize="8.5"
            fill="rgba(255,255,255,0.5)" fontFamily="'DM Mono', monospace">{l}</text>
        </g>
      ))}
    </svg>
  )
}

function InfluenceNetwork() {
  const nodes = [
    { id: 0, x: 200, y: 200, r: 22, label: 'Civil Society', col: '#2ecc71' },
    { id: 1, x: 340, y: 130, r: 18, label: 'Political',     col: '#ff3b3b' },
    { id: 2, x: 120, y: 100, r: 15, label: 'Media',         col: '#f5d623' },
    { id: 3, x: 360, y: 280, r: 16, label: 'Judiciary',     col: '#f5a623' },
    { id: 4, x: 80,  y: 280, r: 13, label: 'Philanthropy',  col: '#2ecc71' },
    { id: 5, x: 260, y: 320, r: 12, label: 'Youth Orgs',    col: '#2ecc71' },
    { id: 6, x: 440, y: 200, r: 11, label: 'Business',      col: 'rgba(255,255,255,0.4)' },
    { id: 7, x: 170, y: 330, r: 10, label: 'Religious',     col: 'rgba(255,255,255,0.4)' },
    { id: 8, x: 300, y: 60,  r: 10, label: 'Military',      col: '#ff3b3b' },
    { id: 9, x: 50,  y: 170, r: 9,  label: 'Diaspora',      col: '#f5a623' },
  ]
  const links = [
    [0,1,'weak'],[0,2,'strong'],[0,4,'strong'],[0,5,'strong'],[0,3,'weak'],
    [1,3,'strong'],[1,8,'strong'],[1,6,'moderate'],[2,0,'moderate'],[2,9,'weak'],
    [4,0,'strong'],[4,9,'moderate'],[5,7,'moderate'],[3,1,'weak'],[6,1,'moderate'],
  ]
  return (
    <svg width="500" height="380" style={{ maxWidth: '100%', height: 'auto' }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245,166,35,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="500" height="380" fill="url(#glow)" />
      {links.map(([a, b, strength], i) => {
        const na = nodes[a], nb = nodes[b]
        return (
          <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={strength === 'strong' ? 'rgba(245,166,35,0.5)' : strength === 'moderate' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}
            strokeWidth={strength === 'strong' ? 2 : 1}
            strokeDasharray={strength === 'weak' ? '4,4' : undefined} />
        )
      })}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r + 8} fill={n.col} opacity={0.06} />
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.col} opacity={0.8}
            stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
          <text x={n.x} y={n.y + n.r + 12} textAnchor="middle"
            fontSize="8" fill="rgba(255,255,255,0.6)"
            fontFamily="'DM Mono', monospace">{n.label}</text>
        </g>
      ))}
      <g transform="translate(14,340)">
        {[['Strong link', 'rgba(245,166,35,0.7)', 'solid'], ['Moderate', 'rgba(255,255,255,0.3)', 'solid'], ['Weak', 'rgba(255,255,255,0.2)', 'dashed']].map(([l, c, d], i) => (
          <g key={l} transform={`translate(${i * 110},0)`}>
            <line x1={0} y1={5} x2={18} y2={5} stroke={c} strokeWidth={1.5}
              strokeDasharray={d === 'dashed' ? '4,3' : undefined} />
            <text x={22} y={9} fontSize="8" fill="rgba(255,255,255,0.4)"
              fontFamily="'DM Mono', monospace">{l}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

// ── styles ───────────────────────────────────────────────────────────────────
const s = {
  root: {
    background: '#0e0e0e',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: '#0e0e0e',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: 12,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: { fontSize: 28, color: '#f5a623', lineHeight: 1 },
  logoTitle: { fontSize: 14, fontWeight: 800, letterSpacing: '0.12em' },
  logoSub: { fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace", marginTop: 2 },
  headerCenter: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  statChip: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, fontSize: 10, fontFamily: "'DM Mono', monospace",
    color: 'rgba(255,255,255,0.6)',
  },
  liveTag: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.4)' },
  nav: {
    display: 'flex', overflowX: 'auto',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 16px', gap: 2,
  },
  navBtn: {
    display: 'flex', alignItems: 'center',
    padding: '12px 16px', background: 'transparent', border: 'none',
    color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11,
    fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em',
    whiteSpace: 'nowrap', borderBottom: '2px solid transparent',
    transition: 'all 0.15s',
  },
  navBtnActive: { color: '#f5a623', borderBottom: '2px solid #f5a623' },
  main: { padding: '20px 24px', maxWidth: 1400, margin: '0 auto' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'start' },
  card: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8, padding: 16, overflow: 'hidden',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  cardTitle: { fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', fontWeight: 500 },
  cardSub: { fontSize: 8.5, fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' },
  badge: {
    padding: '3px 8px', borderRadius: 4, fontSize: 8,
    fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  },
  barBg: { height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2, transition: 'width 0.5s ease' },
  listRow: {
    padding: '10px 10px', marginBottom: 6,
    background: 'rgba(255,255,255,0.02)', borderRadius: 4,
    borderLeft: '3px solid rgba(255,255,255,0.1)',
  },
  statBox: { padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6 },
  statLabel: { fontSize: 8, fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 4 },
  sectionLabel: { fontSize: 8.5, fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' },
  miniCard: { padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' },
  pillarBtn: {
    display: 'flex', alignItems: 'center', gap: 6, width: '100%',
    padding: '8px 10px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)', borderRadius: 5,
    color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 10,
    fontFamily: "'DM Mono', monospace", textAlign: 'left', marginBottom: 4,
  },
  pillarBtnActive: { background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', color: '#f5a623' },
  scenarioBtn: {
    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
    padding: '12px 12px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6,
    color: '#fff', cursor: 'pointer', marginBottom: 8, textAlign: 'left',
  },
  scenarioBtnActive: { background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)' },
}

// ── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Executive Overview',  icon: '◈' },
  { id: 'health',    label: 'Democratic Health',   icon: '⬡' },
  { id: 'warning',   label: 'Early Warning',       icon: '⚠' },
  { id: 'influence', label: 'Power & Influence',   icon: '⊛' },
  { id: 'funding',   label: 'Funding Leverage',    icon: '◎' },
  { id: 'scenario',  label: 'Scenario Simulator',  icon: '⧖' },
  { id: 'narrative', label: 'Narrative Monitor',   icon: '◉' },
]

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('overview')
  const [selectedCountry, setSelectedCountry] = useState('ng')
  const [selectedScenario, setSelectedScenario] = useState('repression')
  const [selectedPillar, setSelectedPillar] = useState('electoral')
  const [fundingSlider, setFundingSlider] = useState(10)

  const country = COUNTRIES.find(c => c.id === selectedCountry)
  const scenario = SCENARIOS.find(sc => sc.id === selectedScenario)
  const pillar = PILLARS.find(p => p.id === selectedPillar)
  const avgRisk = Math.round(COUNTRIES.reduce((a, c) => a + c.risk, 0) / COUNTRIES.length)
  const escalationRisk = Math.round(COUNTRIES.filter(c => c.risk >= 75).length / COUNTRIES.length * 100)
  const topRisks = [...COUNTRIES].sort((a, b) => b.risk - a.risk).slice(0, 3)

  return (
    <div style={s.root}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={s.logo}>
          <span style={s.logoIcon}>◈</span>
          <div>
            <div style={s.logoTitle}>DEMOCRACY INTELLIGENCE</div>
            <div style={s.logoSub}>Strategic Analysis Platform · Africa</div>
          </div>
        </div>
        <div style={s.headerCenter}>
          <div style={s.statChip}>
            <span style={{ color: riskColor(avgRisk) }}>●</span>
            <span>Regional Risk: {avgRisk}</span>
          </div>
          <div style={s.statChip}>
            <span style={{ color: '#ff3b3b' }}>▲</span>
            <span>Critical: {COUNTRIES.filter(c => c.risk >= 75).length} countries</span>
          </div>
          <div style={s.statChip}>
            <span style={{ color: '#2ecc71' }}>●</span>
            <span>Stable: {COUNTRIES.filter(c => c.risk < 40).length} countries</span>
          </div>
        </div>
        <div style={s.liveTag}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#2ecc71',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }} />
          LIVE · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </header>

      {/* NAV */}
      <nav style={s.nav}>
        {TABS.map(t => (
          <button key={t.id} style={{ ...s.navBtn, ...(tab === t.id ? s.navBtnActive : {}) }}
            onClick={() => setTab(t.id)}>
            <span style={{ marginRight: 6, opacity: 0.7 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main style={s.main}>

        {/* ── EXECUTIVE OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={s.grid3}>
            <div style={{ ...s.card, gridColumn: 'span 2' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>REGIONAL RISK HEATMAP</span>
                <span style={s.cardSub}>Bubble size = population · colour = risk level · click to select</span>
              </div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <AfricaMap countries={COUNTRIES} onSelect={setSelectedCountry} selected={selectedCountry} />
                {country && (
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ ...s.badge, background: riskColor(country.risk) + '22', border: `1px solid ${riskColor(country.risk)}44`, marginBottom: 12 }}>
                      <span style={{ color: riskColor(country.risk), fontSize: 10 }}>● {riskLabel(country.risk)}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{country.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 40, fontWeight: 700, color: riskColor(country.risk), fontFamily: "'Syne', sans-serif" }}>{country.risk}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>/100 risk index</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <span style={{ color: country.trend < 0 ? '#ff3b3b' : '#2ecc71', fontSize: 13 }}>
                        {country.trend < 0 ? '▼' : '▲'}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                        {Math.abs(country.trend)} pts / 12 months
                      </span>
                    </div>
                    <Sparkline data={generateSparkline(country.risk, -country.trend / 12)}
                      color={riskColor(country.risk)} height={40} />
                    <div style={{ marginTop: 16 }}>
                      {PILLARS.map(p => (
                        <div key={p.id} style={{ marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>
                            <span>{p.icon} {p.label}</span>
                            <span style={{ color: riskColor(p.score) }}>{p.score}</span>
                          </div>
                          <div style={s.barBg}>
                            <div style={{ ...s.barFill, width: `${p.score}%`, background: riskColor(p.score) }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>⚠ TOP ESCALATION RISKS</span></div>
                {topRisks.map((c) => (
                  <div key={c.id} style={{ ...s.listRow, borderLeft: `3px solid ${riskColor(c.risk)}`, cursor: 'pointer' }}
                    onClick={() => { setSelectedCountry(c.id); setTab('overview') }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                          {c.trend < 0 ? `Declining ${Math.abs(c.trend)} pts/yr` : 'Stable'} · Pop {c.pop}M
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: riskColor(c.risk), fontFamily: "'Syne', sans-serif" }}>{c.risk}</div>
                        <div style={{ fontSize: 8, color: riskColor(c.risk) }}>{riskLabel(c.risk)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>🔥 ESCALATION PROBABILITY</span>
                  <span style={s.cardSub}>Next 12 months</span>
                </div>
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{ fontSize: 52, fontWeight: 800, color: '#f5a623', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{escalationRisk}%</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontFamily: "'DM Mono', monospace" }}>P(instability event) · CI ±8%</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  {[['3 months', 28], ['6 months', 41], ['12 months', escalationRisk]].map(([l, v]) => (
                    <div key={l} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>
                        <span>{l}</span><span style={{ color: '#f5a623' }}>{v}%</span>
                      </div>
                      <div style={s.barBg}>
                        <div style={{ ...s.barFill, width: `${v}%`, background: '#f5a623' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>🗳 UPCOMING EVENTS</span></div>
                {[
                  { country: 'Nigeria',  event: 'Gubernatorial Elections', date: 'Mar 2026', risk: 'HIGH'     },
                  { country: 'Ethiopia', event: 'Parliamentary Review',    date: 'May 2026', risk: 'CRITICAL' },
                  { country: 'Senegal',  event: 'Constitutional Reform',   date: 'Jun 2026', risk: 'ELEVATED' },
                  { country: 'Tanzania', event: 'Local Elections',          date: 'Aug 2026', risk: 'ELEVATED' },
                ].map((e, i) => (
                  <div key={i} style={{ ...s.listRow, borderLeft: `3px solid ${e.risk === 'CRITICAL' ? '#ff3b3b' : e.risk === 'HIGH' ? '#f5a623' : '#f5d623'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>{e.country}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace" }}>{e.event}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Mono', monospace" }}>{e.date}</div>
                        <div style={{ fontSize: 8, color: e.risk === 'CRITICAL' ? '#ff3b3b' : e.risk === 'HIGH' ? '#f5a623' : '#f5d623', fontWeight: 600 }}>{e.risk}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Briefing */}
            <div style={{ ...s.card, gridColumn: 'span 3', background: 'linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(26,26,26,0) 100%)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>◈ AI EXECUTIVE BRIEFING</span>
                <div style={{ ...s.badge, marginLeft: 'auto' }}>
                  <span style={{ color: '#f5a623', fontSize: 9 }}>● AUTO-GENERATED · EDITABLE</span>
                </div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', fontFamily: "'DM Mono', monospace", fontStyle: 'italic' }}>
                As of {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })},
                the Sub-Saharan Africa democratic landscape presents a <strong style={{ color: '#f5a623' }}>deteriorating
                structural risk profile</strong>, with {COUNTRIES.filter(c => c.risk >= 75).length} countries
                classified as Critical and {COUNTRIES.filter(c => c.risk >= 55 && c.risk < 75).length} Elevated.
                The primary drivers are accelerating electoral integrity erosion in the Sahel cluster,
                sustained civic space compression in the Great Lakes region, and a rapidly expanding
                digital governance risk surface across all monitored states.
                <br /><br />
                Mali, DRC, and Ethiopia represent the highest-urgency intervention opportunities, where
                structural decay trajectories suggest a <strong style={{ color: '#ff3b3b' }}>window of 6–18 months</strong> before
                institutional recovery becomes significantly harder. Civil society network density in
                Kenya and Ghana provides meaningful resilience buffers — these represent high-leverage
                programmatic anchors for regional stabilisation strategies.
              </p>
            </div>
          </div>
        )}

        {/* ── DEMOCRATIC HEALTH ── */}
        {tab === 'health' && (
          <div style={s.grid3}>
            <div style={s.card}>
              <div style={s.cardHeader}><span style={s.cardTitle}>PILLAR RADAR</span></div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                <RadarChart data={PILLARS} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 }}>
                {PILLARS.map(p => (
                  <button key={p.id}
                    style={{ ...s.pillarBtn, ...(selectedPillar === p.id ? s.pillarBtnActive : {}) }}
                    onClick={() => setSelectedPillar(p.id)}>
                    <span>{p.icon}</span>
                    <span style={{ fontSize: 9 }}>{p.label}</span>
                    <span style={{ color: riskColor(p.score), fontSize: 11, fontWeight: 700, marginLeft: 'auto' }}>{p.score}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...s.card, gridColumn: 'span 2' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>{pillar.icon} {pillar.label.toUpperCase()} — DRILL DOWN</span>
                <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
                  <div style={{ ...s.badge, background: riskColor(pillar.score) + '22', border: `1px solid ${riskColor(pillar.score)}44` }}>
                    <span style={{ color: riskColor(pillar.score) }}>{riskLabel(pillar.score)}</span>
                  </div>
                  <div style={{ ...s.badge, background: velocityColor(pillar.velocity) + '22', border: `1px solid ${velocityColor(pillar.velocity)}44` }}>
                    <span style={{ color: velocityColor(pillar.velocity) }}>VELOCITY {pillar.velocity.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div style={s.statBox}>
                  <div style={s.statLabel}>CURRENT SCORE</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: riskColor(pillar.score), fontFamily: "'Syne', sans-serif" }}>{pillar.score}</div>
                </div>
                <div style={s.statBox}>
                  <div style={s.statLabel}>12-MO TREND</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: pillar.trend < 0 ? '#ff3b3b' : '#2ecc71', fontFamily: "'Syne', sans-serif" }}>
                    {pillar.trend > 0 ? '+' : ''}{pillar.trend}
                  </div>
                </div>
                <div style={s.statBox}>
                  <div style={s.statLabel}>RISK VELOCITY</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: velocityColor(pillar.velocity), fontFamily: "'Syne', sans-serif", paddingTop: 10 }}>
                    {pillar.velocity.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={s.sectionLabel}>COMPONENT METRICS</div>
                {pillar.metrics.map((m, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{m.name}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginLeft: 8, fontFamily: "'DM Mono', monospace" }}>({m.src})</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: riskColor(m.val), fontFamily: "'DM Mono', monospace" }}>{m.val}</span>
                    </div>
                    <div style={s.barBg}>
                      <div style={{ ...s.barFill, width: `${m.val}%`, background: `linear-gradient(90deg, ${riskColor(m.val)}88, ${riskColor(m.val)})` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={s.sectionLabel}>COUNTRY COMPARISON</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {COUNTRIES.slice(0, 8).map(c => {
                    const pScore = Math.max(20, Math.min(95, c.risk - 5 + Math.floor(Math.random() * 3)))
                    return (
                      <div key={c.id} style={{ ...s.miniCard, borderTop: `2px solid ${riskColor(pScore)}` }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Mono', monospace" }}>{c.name}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: riskColor(pScore), fontFamily: "'Syne', sans-serif" }}>{pScore}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                <div style={s.sectionLabel}>DIAGNOSTIC INTERPRETATION</div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Mono', monospace", lineHeight: 1.7 }}>
                  The {pillar.label} pillar indicates <strong style={{ color: '#fff' }}>structural decay</strong> rather
                  than event-driven volatility. The velocity score ({pillar.velocity}) and consistent
                  12-month trend ({pillar.trend} pts) suggest this is not a transient shock but a
                  systemic deterioration pattern requiring long-term programmatic response.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── EARLY WARNING ── */}
        {tab === 'warning' && (
          <div style={s.grid3}>
            <div style={{ ...s.card, gridColumn: 'span 3' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>⚠ ESCALATION SIGNAL MATRIX</span>
                <span style={s.cardSub}>Real-time signal aggregation across monitored states</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr>
                      {['Country', 'GDP Shock', 'Youth Unemp.', 'Protest Density', 'Media Sentiment', 'Internet', 'Election Prox.', 'OVERALL RISK', 'TREND'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES.map((c, i) => {
                      const signals = [
                        Math.min(99, Math.max(10, c.risk - 20 + Math.floor(Math.random() * 30))),
                        Math.min(99, Math.max(10, c.risk - 15 + Math.floor(Math.random() * 30))),
                        Math.min(99, Math.max(10, c.risk + 5 + Math.floor(Math.random() * 20) - 10)),
                        Math.min(99, Math.max(10, c.risk - 10 + Math.floor(Math.random() * 25))),
                        Math.min(99, Math.max(10, c.risk - 5 + Math.floor(Math.random() * 25))),
                        Math.min(99, Math.max(10, 50 + Math.floor(Math.random() * 40))),
                      ]
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px 10px', fontWeight: 600, fontFamily: "'Syne', sans-serif", fontSize: 12 }}>{c.name}</td>
                          {signals.map((sig, si) => (
                            <td key={si} style={{ padding: '10px 10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor(sig) }} />
                                <span style={{ fontFamily: "'DM Mono', monospace", color: riskColor(sig), fontSize: 11 }}>{sig}</span>
                              </div>
                            </td>
                          ))}
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: riskColor(c.risk) }}>{c.risk}</div>
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <Sparkline data={generateSparkline(c.risk, -c.trend / 12, 8)} color={riskColor(c.risk)} height={22} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ ...s.card, gridColumn: 'span 2' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>🎯 ESCALATION PROBABILITY MODEL</span>
                <span style={s.cardSub}>Multivariate · Confidence interval ±8%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { period: '3 Months',  prob: 28, ci: 6, drivers: ['Election proximity', 'Media polarisation'] },
                  { period: '6 Months',  prob: 41, ci: 7, drivers: ['GDP contraction risk', 'Protest density'] },
                  { period: '12 Months', prob: escalationRisk, ci: 9, drivers: ['Structural decay rate', 'Youth unemployment'] },
                ].map(m => (
                  <div key={m.period} style={{ ...s.statBox, padding: 16 }}>
                    <div style={s.statLabel}>{m.period}</div>
                    <div style={{ fontSize: 42, fontWeight: 800, color: riskColor(m.prob), fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{m.prob}%</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Mono', monospace", marginTop: 4 }}>CI ±{m.ci}%</div>
                    <div style={{ marginTop: 12 }}>
                      {m.drivers.map((d, i) => (
                        <div key={i} style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", marginBottom: 3, paddingLeft: 8, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>{d}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardHeader}><span style={s.cardTitle}>TOP DRIVERS BY INFLUENCE</span></div>
              {[
                { driver: 'Youth Unemployment',  weight: 82 },
                { driver: 'GDP Contraction',     weight: 74 },
                { driver: 'Electoral Proximity', weight: 71 },
                { driver: 'Media Polarisation',  weight: 68 },
                { driver: 'CSO Restrictions',    weight: 61 },
                { driver: 'Internet Shutdowns',  weight: 54 },
                { driver: 'Opposition Arrests',  weight: 49 },
              ].map((d, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                    <span>{i + 1}. {d.driver}</span>
                    <span style={{ color: riskColor(d.weight) }}>{d.weight}%</span>
                  </div>
                  <div style={s.barBg}>
                    <div style={{ ...s.barFill, width: `${d.weight}%`, background: 'linear-gradient(90deg, rgba(245,166,35,0.3), rgba(245,166,35,0.8))' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INFLUENCE MAP ── */}
        {tab === 'influence' && (
          <div style={s.grid3}>
            <div style={{ ...s.card, gridColumn: 'span 2' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>⊛ POWER & INFLUENCE NETWORK</span>
                <span style={s.cardSub}>Actor density · Network centrality · Cluster strength</span>
              </div>
              <InfluenceNetwork />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>KEY ACTOR CATEGORIES</span></div>
                {[
                  { cat: 'Political Actors',   count: 47,  trend: '+3',  icon: '🏛', col: '#ff3b3b' },
                  { cat: 'Civil Society',      count: 312, trend: '+18', icon: '🤝', col: '#2ecc71' },
                  { cat: 'Philanthropic Orgs', count: 89,  trend: '+5',  icon: '◎',  col: '#f5a623' },
                  { cat: 'Media Outlets',      count: 204, trend: '-12', icon: '📡', col: '#f5d623' },
                  { cat: 'Judicial Networks',  count: 28,  trend: '-4',  icon: '⚖',  col: '#ff3b3b' },
                ].map((a, i) => (
                  <div key={i} style={{ ...s.listRow, borderLeft: `3px solid ${a.col}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{a.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600 }}>{a.cat}</div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace" }}>{a.count} monitored entities</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: a.trend.startsWith('+') ? '#2ecc71' : '#ff3b3b', fontFamily: "'DM Mono', monospace" }}>{a.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>LEVERAGE POINTS</span></div>
                {[
                  { action: 'Increase CSO media funding +$2M', effect: 'Electoral monitoring +18%', impact: 'HIGH' },
                  { action: 'Legal aid network expansion',      effect: 'Judicial independence +12%', impact: 'MED' },
                  { action: 'Digital literacy programs',        effect: 'Disinfo resilience +21%', impact: 'HIGH' },
                  { action: 'Cross-border CSO links',           effect: 'Network density +15%', impact: 'MED' },
                ].map((l, i) => (
                  <div key={i} style={{ ...s.listRow, borderLeft: `3px solid ${l.impact === 'HIGH' ? '#2ecc71' : '#f5a623'}` }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{l.action}</div>
                    <div style={{ fontSize: 9, color: '#2ecc71', marginTop: 3, fontFamily: "'DM Mono', monospace" }}>→ {l.effect}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FUNDING ── */}
        {tab === 'funding' && (
          <div style={s.grid3}>
            <div style={{ ...s.card, gridColumn: 'span 2' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>◎ CURRENT ALLOCATION MAP</span>
                <span style={s.cardSub}>$M deployed · Size = amount · Colour = risk level</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr>
                      {['Country', 'Theme', 'Allocation $M', 'Country Risk', 'Marginal Impact', 'Efficiency'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...ALLOCATIONS].sort((a, b) => b.marginal - a.marginal).map((a, i) => {
                      const efficiency = (a.marginal / a.amount * 2).toFixed(1)
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px 10px', fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>{a.country}</td>
                          <td style={{ padding: '10px 10px', fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Mono', monospace" }}>{a.theme}</td>
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ height: 6, width: Math.max(12, a.amount * 8), background: '#f5a623', borderRadius: 3, opacity: 0.7 }} />
                              <span style={{ fontFamily: "'DM Mono', monospace" }}>${a.amount}M</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <span style={{ color: riskColor(a.risk), fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{a.risk}</span>
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ height: 4, width: `${a.marginal * 8}px`, background: 'linear-gradient(90deg, rgba(46,204,113,0.3), #2ecc71)', borderRadius: 2 }} />
                              <span style={{ fontFamily: "'DM Mono', monospace", color: '#2ecc71' }}>{a.marginal}</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: parseFloat(efficiency) >= 2.5 ? '#2ecc71' : parseFloat(efficiency) >= 1.5 ? '#f5a623' : '#ff3b3b' }}>{efficiency}x</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>💡 MARGINAL IMPACT SIMULATOR</span></div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    <span>Additional Allocation</span>
                    <span style={{ color: '#f5a623', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>${fundingSlider}M</span>
                  </div>
                  <input type="range" min={1} max={50} value={fundingSlider}
                    onChange={e => setFundingSlider(Number(e.target.value))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Risk reduction',     val: `${(fundingSlider * 0.31).toFixed(1)} pts`, col: '#2ecc71' },
                    { label: 'Countries impacted', val: Math.min(16, Math.ceil(fundingSlider / 3)),   col: '#f5a623' },
                    { label: 'CSOs supported',     val: Math.ceil(fundingSlider * 4.2),              col: '#2ecc71' },
                    { label: 'Timeline',           val: `${Math.ceil(fundingSlider / 5) + 6} mo`,    col: '#f5a623' },
                  ].map((st, i) => (
                    <div key={i} style={s.statBox}>
                      <div style={s.statLabel}>{st.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: st.col, fontFamily: "'Syne', sans-serif" }}>{st.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>🔍 UNDERFUNDED HIGH-RISK</span></div>
                {[
                  { country: 'Mali',     gap: 6.2, risk: 88 },
                  { country: 'Ethiopia', gap: 5.1, risk: 82 },
                  { country: 'DRC',      gap: 4.7, risk: 85 },
                  { country: 'Zimbabwe', gap: 2.9, risk: 74 },
                ].map((u, i) => (
                  <div key={i} style={{ ...s.listRow, borderLeft: `3px solid ${riskColor(u.risk)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>{u.country}</div>
                        <div style={{ fontSize: 9, color: '#ff3b3b', fontFamily: "'DM Mono', monospace" }}>Gap: ${u.gap}M</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: riskColor(u.risk), fontFamily: "'Syne', sans-serif" }}>{u.risk}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>👥 DONOR OVERLAP</span></div>
                {[
                  { donor: 'USAID',    overlap: 62 },
                  { donor: 'EU',       overlap: 48 },
                  { donor: 'Ford Fdn', overlap: 34 },
                  { donor: 'NED',      overlap: 71 },
                ].map((d, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>
                      <span>{d.donor}</span><span>{d.overlap}% overlap</span>
                    </div>
                    <div style={s.barBg}>
                      <div style={{ ...s.barFill, width: `${d.overlap}%`, background: 'rgba(245,166,35,0.5)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SCENARIO ── */}
        {tab === 'scenario' && (
          <div style={s.grid3}>
            <div style={s.card}>
              <div style={s.cardHeader}><span style={s.cardTitle}>⧖ SCENARIO SELECTOR</span></div>
              {SCENARIOS.map(sc => (
                <button key={sc.id}
                  style={{ ...s.scenarioBtn, ...(selectedScenario === sc.id ? s.scenarioBtnActive : {}) }}
                  onClick={() => setSelectedScenario(sc.id)}>
                  <span style={{ fontSize: 20 }}>{sc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{sc.label}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>P(occurrence): {sc.prob}%</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: riskColor(sc.prob), fontFamily: "'Syne', sans-serif" }}>{sc.prob}%</div>
                </button>
              ))}
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                <div style={s.sectionLabel}>METHODOLOGY</div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                  Scenarios modelled using Bayesian network analysis on 47 structural indicators.
                  Probabilities represent 12-month regional P(event). Recovery scores reflect
                  institutional resilience under each scenario.
                </p>
              </div>
            </div>

            {scenario && (
              <div style={{ ...s.card, gridColumn: 'span 2' }}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>{scenario.icon} {scenario.label.toUpperCase()} — SCENARIO ANALYSIS</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={s.statBox}>
                    <div style={s.statLabel}>OCCURRENCE PROB.</div>
                    <div style={{ fontSize: 42, fontWeight: 800, color: riskColor(scenario.prob), fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{scenario.prob}%</div>
                  </div>
                  <div style={s.statBox}>
                    <div style={s.statLabel}>RECOVERY PROBABILITY</div>
                    <div style={{ fontSize: 42, fontWeight: 800, color: riskColor(100 - scenario.recovery), fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{scenario.recovery}%</div>
                  </div>
                  <div style={s.statBox}>
                    <div style={s.statLabel}>NET RISK SCORE</div>
                    <div style={{ fontSize: 42, fontWeight: 800, color: '#f5a623', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                      {Math.round(scenario.prob * (1 - scenario.recovery / 100))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 16 }}>
                  <div style={s.sectionLabel}>SCENARIO SUMMARY</div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: "'DM Mono', monospace", lineHeight: 1.8, marginTop: 6 }}>{scenario.summary}</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={s.sectionLabel}>PRIMARY DRIVERS</div>
                  {scenario.drivers.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#f5a623', flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{d}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={s.sectionLabel}>INSTITUTIONAL RESPONSE CAPACITY</div>
                  {[
                    { inst: 'Electoral Commission',    cap: 41 },
                    { inst: 'Judiciary',               cap: 37 },
                    { inst: 'Civil Society',           cap: 68 },
                    { inst: 'Regional Bodies (AU)',    cap: 52 },
                    { inst: 'International Community', cap: 44 },
                  ].map((r, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                        <span>{r.inst}</span>
                        <span style={{ color: riskColor(100 - r.cap) }}>{r.cap}%</span>
                      </div>
                      <div style={s.barBg}>
                        <div style={{ ...s.barFill, width: `${r.cap}%`, background: 'linear-gradient(90deg, rgba(46,204,113,0.3), rgba(46,204,113,0.8))' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 12, background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: 6 }}>
                  <div style={s.sectionLabel}>STRATEGIC RECOMMENDATION</div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Mono', monospace", lineHeight: 1.7, marginTop: 6 }}>
                    Under the {scenario.label.toLowerCase()} scenario, the highest-leverage intervention is
                    strengthening civil society pre-positioning — specifically digital resilience infrastructure
                    and cross-border solidarity networks — which show the highest marginal return on democratic
                    recovery probability.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NARRATIVE MONITOR ── */}
        {tab === 'narrative' && (
          <div style={s.grid3}>
            <div style={{ ...s.card, gridColumn: 'span 2' }}>
              <div style={s.cardHeader}>
                <span style={s.cardTitle}>◉ NARRATIVE LANDSCAPE</span>
                <span style={s.cardSub}>Discourse velocity · Authoritarian vs democratic frames</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {NARRATIVES.map((n, i) => (
                  <div key={i} style={{ ...s.card, padding: 14, borderLeft: `3px solid ${n.type === 'threat' ? '#ff3b3b' : n.type === 'positive' ? '#2ecc71' : '#f5a623'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, flex: 1 }}>{n.label}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: n.type === 'threat' ? '#ff3b3b' : n.type === 'positive' ? '#2ecc71' : '#f5a623', fontFamily: "'Syne', sans-serif" }}>{n.val}</div>
                        <div style={{ fontSize: 9, color: n.delta > 0 ? '#ff3b3b' : '#2ecc71', fontFamily: "'DM Mono', monospace" }}>{n.delta > 0 ? '+' : ''}{n.delta} pts/mo</div>
                      </div>
                    </div>
                    <div style={s.barBg}>
                      <div style={{ ...s.barFill, width: `${n.val}%`, background: n.type === 'threat' ? 'linear-gradient(90deg,rgba(255,59,59,0.3),rgba(255,59,59,0.8))' : n.type === 'positive' ? 'linear-gradient(90deg,rgba(46,204,113,0.3),rgba(46,204,113,0.8))' : 'linear-gradient(90deg,rgba(245,166,35,0.3),rgba(245,166,35,0.8))' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>🤖 DISINFO SIGNALS</span></div>
                {[
                  { signal: 'Coordinated inauthentic behaviour', severity: 'HIGH',     platform: 'Twitter/X' },
                  { signal: 'Election fraud narratives',          severity: 'CRITICAL', platform: 'Facebook'  },
                  { signal: 'Opposition smear campaigns',         severity: 'ELEVATED', platform: 'WhatsApp'  },
                  { signal: 'Deepfake political content',         severity: 'ELEVATED', platform: 'TikTok'    },
                  { signal: 'State-linked bot networks',          severity: 'HIGH',     platform: 'Telegram'  },
                ].map((d, i) => (
                  <div key={i} style={{ ...s.listRow, borderLeft: `3px solid ${d.severity === 'CRITICAL' ? '#ff3b3b' : d.severity === 'HIGH' ? '#f5a623' : '#f5d623'}` }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{d.signal}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 8, fontFamily: "'DM Mono', monospace", color: d.severity === 'CRITICAL' ? '#ff3b3b' : d.severity === 'HIGH' ? '#f5a623' : '#f5d623' }}>{d.severity}</span>
                      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>· {d.platform}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <div style={s.cardHeader}><span style={s.cardTitle}>💬 SOCIAL TRUST</span></div>
                {[
                  { inst: 'Electoral Institutions', trust: 32 },
                  { inst: 'National Judiciary',     trust: 29 },
                  { inst: 'Civil Society',          trust: 61 },
                  { inst: 'Independent Media',      trust: 44 },
                  { inst: 'Government',             trust: 27 },
                ].map((t, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>
                      <span>{t.inst}</span>
                      <span style={{ color: riskColor(100 - t.trust) }}>{t.trust}%</span>
                    </div>
                    <div style={s.barBg}>
                      <div style={{ ...s.barFill, width: `${t.trust}%`, background: 'linear-gradient(90deg, rgba(46,204,113,0.3), rgba(46,204,113,0.7))' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ ...s.card, background: 'rgba(255,59,59,0.05)', border: '1px solid rgba(255,59,59,0.2)' }}>
                <div style={s.cardHeader}><span style={s.cardTitle}>⚡ EPISTEMIC RISK</span></div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Mono', monospace", lineHeight: 1.7 }}>
                  Democracy weakens in ideas before institutions.
                  Current narrative trajectory shows authoritarian framing outpacing
                  civic discourse by <strong style={{ color: '#ff3b3b' }}>2.3×</strong>.
                  Disinformation velocity is at a <strong style={{ color: '#ff3b3b' }}>5-year high</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
