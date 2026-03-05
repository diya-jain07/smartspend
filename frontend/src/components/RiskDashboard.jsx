import React, { useEffect, useState } from 'react'
import { CATEGORIES, getRiskLevel } from '../utils/model.js'

const META = {
  groceries:     { label: 'Groceries',     icon: '🛒' },
  rent:          { label: 'Rent',          icon: '🏠' },
  utilities:     { label: 'Utilities',     icon: '⚡' },
  entertainment: { label: 'Entertainment', icon: '🎬' },
  misc:          { label: 'Miscellaneous', icon: '📦' },
}

const RISK_CONFIG = {
  HIGH:   { label: 'High',   color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.25)' },
  MEDIUM: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  LOW:    { label: 'Low',    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
}

export default function RiskDashboard({ predictions, spend, budget }) {
  if (!predictions) return <EmptyState />

  const totalBudget = budget.reduce((a, b) => a + b, 0)

  return (
    <div style={s.panel}>
      <div style={s.panelHeader}>
        <div style={s.panelTitle}>Category Risk Breakdown</div>
        <div style={s.panelSub}>Probability of overspending per category</div>
      </div>

      <div style={s.rows}>
        {CATEGORIES.map((cat, i) => {
          const prob = predictions[cat]
          const risk = getRiskLevel(prob)
          const cfg  = RISK_CONFIG[risk.label.toUpperCase()]
          const budgetShare = totalBudget > 0 ? (budget[i] / totalBudget * 100).toFixed(0) : 0
          const meta = META[cat]

          return (
            <RiskRow
              key={cat}
              cat={cat}
              meta={meta}
              prob={prob}
              risk={risk}
              cfg={cfg}
              spend={spend[i]}
              budgetVal={budget[i]}
              budgetShare={budgetShare}
              delay={i * 70}
            />
          )
        })}
      </div>
    </div>
  )
}

function RiskRow({ cat, meta, prob, risk, cfg, spend, budgetVal, budgetShare, delay }) {
  const [barW, setBarW] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setBarW(prob * 100), delay + 150)
    return () => clearTimeout(t)
  }, [prob, delay])

  const pct = Math.round(prob * 100)

  return (
    <div style={{ ...s.row, animation: `fadeUp 0.4s ease ${delay}ms both` }}>
      <div style={s.rowTop}>
        <div style={s.rowLeft}>
          <div style={{ ...s.iconBox, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <span style={{ fontSize: 14 }}>{meta.icon}</span>
          </div>
          <div>
            <div style={s.catName}>{meta.label}</div>
            <div style={s.catSub}>${spend} spent · ${budgetVal} budget · {budgetShare}% of total</div>
          </div>
        </div>
        <div style={s.rowRight}>
          <span style={{ ...s.riskBadge, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            {risk.label}
          </span>
          <span style={{ ...s.pctNum, color: cfg.color }}>{pct}%</span>
        </div>
      </div>

      <div style={s.barTrack}>
        <div style={{
          ...s.barFill,
          width: `${barW}%`,
          background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})`,
          boxShadow: `0 0 10px ${cfg.color}44`,
          transition: `width 0.75s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        }} />
        {/* Threshold markers */}
        <div style={{ ...s.marker, left: '40%' }} title="Medium threshold (40%)" />
        <div style={{ ...s.marker, left: '65%' }} title="High threshold (65%)" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={s.empty}>
      <div style={s.emptyIcon}>
        <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4 3"/>
          <path d="M20 12v10M20 26v2" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={s.emptyTitle}>No prediction yet</div>
      <div style={s.emptySub}>Enter your spending data and click Run Prediction</div>
    </div>
  )
}

const s = {
  panel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  panelHeader: {},
  panelTitle: { fontSize: 17, fontWeight: 700, color: '#eef2ff', letterSpacing: '-0.02em' },
  panelSub:   { fontSize: 13, color: '#7c8db5', marginTop: 3 },
  rows: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'flex', flexDirection: 'column', gap: 8 },
  rowTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  iconBox: { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 13, fontWeight: 600, color: '#c4d0e8' },
  catSub:  { fontSize: 11, color: '#4a5568', marginTop: 2 },
  rowRight: { display: 'flex', alignItems: 'center', gap: 10 },
  riskBadge: { fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99 },
  pctNum: { fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-num)', minWidth: 48, textAlign: 'right' },
  barTrack: {
    position: 'relative',
    height: 6, background: 'rgba(255,255,255,0.06)',
    borderRadius: 99, overflow: 'visible',
  },
  barFill: { height: '100%', borderRadius: 99 },
  marker: {
    position: 'absolute',
    top: -3, width: 1, height: 12,
    background: 'rgba(255,255,255,0.15)',
  },
  empty: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
    gap: 10,
  },
  emptyIcon:  { marginBottom: 6, opacity: 0.5 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: '#4a5568' },
  emptySub:   { fontSize: 13, color: '#3d4a63', textAlign: 'center', maxWidth: 260 },
}
