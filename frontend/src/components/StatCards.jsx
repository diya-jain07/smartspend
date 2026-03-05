import React, { useEffect, useState } from 'react'
import { getRiskLevel, getHighestRisk, getSafest, CATEGORIES } from '../utils/model.js'

const CATEGORY_ICONS = {
  groceries:     '🛒',
  rent:          '🏠',
  utilities:     '⚡',
  entertainment: '🎬',
  misc:          '📦',
}

const CATEGORY_LABELS = {
  groceries:     'Groceries',
  rent:          'Rent',
  utilities:     'Utilities',
  entertainment: 'Entertainment',
  misc:          'Miscellaneous',
}

function AnimatedNumber({ value, suffix = '%', decimals = 1 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(start)
    }, step)
    return () => clearInterval(timer)
  }, [value])

  return <span>{display.toFixed(decimals)}{suffix}</span>
}

export default function StatCards({ predictions }) {
  if (!predictions) return <EmptyCards />

  const [highCat, highProb] = getHighestRisk(predictions)
  const [lowCat, lowProb]   = getSafest(predictions)
  const highRiskCount = Object.values(predictions).filter(p => p >= 0.65).length
  const highRisk = getRiskLevel(highProb)

  return (
    <div style={s.grid}>
      {/* Highest Risk */}
      <div style={{ ...s.card, ...s.cardRed, animation: 'scaleIn 0.4s ease 0.05s both' }}>
        <div style={s.cardTop}>
          <div style={{ ...s.iconWrap, background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)' }}>
            <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[highCat]}</span>
          </div>
          <div style={{ ...s.tag, color: '#f43f5e', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)' }}>
            ⚠ Highest Risk
          </div>
        </div>
        <div style={s.bigNum}>
          <AnimatedNumber value={highProb * 100} />
        </div>
        <div style={s.cardLabel}>{CATEGORY_LABELS[highCat]}</div>
        <div style={s.cardSub}>probability of overspending</div>
        <RiskMeter prob={highProb} color="#f43f5e" />
      </div>

      {/* Safest Category */}
      <div style={{ ...s.card, ...s.cardGreen, animation: 'scaleIn 0.4s ease 0.12s both' }}>
        <div style={s.cardTop}>
          <div style={{ ...s.iconWrap, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[lowCat]}</span>
          </div>
          <div style={{ ...s.tag, color: '#10b981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
            ✓ Safest
          </div>
        </div>
        <div style={{ ...s.bigNum, color: '#10b981' }}>
          <AnimatedNumber value={lowProb * 100} />
        </div>
        <div style={s.cardLabel}>{CATEGORY_LABELS[lowCat]}</div>
        <div style={s.cardSub}>lowest overspend risk</div>
        <RiskMeter prob={lowProb} color="#10b981" />
      </div>

      {/* High Risk Count */}
      <div style={{ ...s.card, ...s.cardAmber, animation: 'scaleIn 0.4s ease 0.19s both' }}>
        <div style={s.cardTop}>
          <div style={{ ...s.iconWrap, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span style={{ fontSize: 18 }}>🚨</span>
          </div>
          <div style={{ ...s.tag, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
            High Risk Count
          </div>
        </div>
        <div style={{ ...s.bigNum, color: '#f59e0b' }}>
          <AnimatedNumber value={highRiskCount} suffix={`/${CATEGORIES.length}`} decimals={0} />
        </div>
        <div style={s.cardLabel}>
          {highRiskCount === 0 ? 'All categories safe' :
           highRiskCount === 1 ? '1 category at high risk' :
           `${highRiskCount} categories at high risk`}
        </div>
        <div style={s.cardSub}>categories above 65% threshold</div>
        <div style={s.dotRow}>
          {CATEGORIES.map((cat) => {
            const r = getRiskLevel(predictions[cat])
            return (
              <div key={cat} style={{ ...s.catDot, background: r.color, boxShadow: `0 0 6px ${r.color}88` }}
                title={`${CATEGORY_LABELS[cat]}: ${(predictions[cat]*100).toFixed(1)}%`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RiskMeter({ prob, color }) {
  const [w, setW] = useState(0)
  useEffect(() => { setTimeout(() => setW(prob * 100), 200) }, [prob])
  return (
    <div style={s.meter}>
      <div style={{ ...s.meterFill, width: `${w}%`, background: color, boxShadow: `0 0 8px ${color}66`, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  )
}

function EmptyCards() {
  return (
    <div style={s.grid}>
      {['⚠ Highest Risk', '✓ Safest', 'High Risk Count'].map((label, i) => (
        <div key={i} style={{ ...s.card, ...s.cardEmpty, animationDelay: `${i * 0.08}s` }} className="fade-up">
          <div style={s.emptyLabel}>{label}</div>
          <div style={s.emptyBig}>—</div>
          <div style={s.emptySub}>run prediction to see results</div>
        </div>
      ))}
    </div>
  )
}

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    backdropFilter: 'blur(12px)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  cardRed:   { borderColor: 'rgba(244,63,94,0.2)',   background: 'rgba(244,63,94,0.05)' },
  cardGreen: { borderColor: 'rgba(16,185,129,0.2)',  background: 'rgba(16,185,129,0.05)' },
  cardAmber: { borderColor: 'rgba(245,158,11,0.2)',  background: 'rgba(245,158,11,0.05)' },
  cardEmpty: { borderColor: 'rgba(255,255,255,0.05)', opacity: 0.5 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  iconWrap: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tag: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, letterSpacing: '0.01em' },
  bigNum: {
    fontSize: 40, fontWeight: 800, color: '#f43f5e',
    fontFamily: 'var(--font-num)',
    letterSpacing: '-0.03em',
    lineHeight: 1,
    animation: 'numberPop 0.5s ease both',
  },
  cardLabel: { fontSize: 15, fontWeight: 600, color: '#eef2ff', marginTop: 2 },
  cardSub:   { fontSize: 12, color: '#7c8db5' },
  meter: { height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 8, overflow: 'hidden' },
  meterFill: { height: '100%', borderRadius: 99 },
  dotRow: { display: 'flex', gap: 6, marginTop: 8 },
  catDot: { width: 10, height: 10, borderRadius: '50%' },
  emptyLabel: { fontSize: 12, fontWeight: 600, color: '#3d4a63', letterSpacing: '0.02em' },
  emptyBig:   { fontSize: 40, fontWeight: 800, color: '#3d4a63', fontFamily: 'var(--font-num)' },
  emptySub:   { fontSize: 12, color: '#3d4a63' },
}
