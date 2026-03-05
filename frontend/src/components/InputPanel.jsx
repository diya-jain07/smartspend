import React, { useState } from 'react'
import { CATEGORIES } from '../utils/model.js'

const META = {
  groceries:     { label: 'Groceries',     icon: '🛒', color: '#6366f1' },
  rent:          { label: 'Rent',          icon: '🏠', color: '#22d3ee' },
  utilities:     { label: 'Utilities',     icon: '⚡', color: '#f59e0b' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: '#f43f5e' },
  misc:          { label: 'Miscellaneous', icon: '📦', color: '#a78bfa' },
}

const PRESETS = {
  tight: {
    label: 'Tight Budget',
    emoji: '😬',
    spend:  [480, 1200, 140, 320, 180],
    budget: [420, 1200, 130, 200, 150],
  },
  comfortable: {
    label: 'Comfortable',
    emoji: '😌',
    spend:  [380, 1800, 110, 150, 90],
    budget: [450, 1800, 130, 200, 120],
  },
  overspender: {
    label: 'Overspender',
    emoji: '😰',
    spend:  [620, 1200, 180, 550, 310],
    budget: [400, 1200, 150, 300, 200],
  },
}

export default function InputPanel({ onPredict, isLoading }) {
  const [spend,  setSpend]  = useState(Object.fromEntries(CATEGORIES.map(c => [c, ''])))
  const [budget, setBudget] = useState(Object.fromEntries(CATEGORIES.map(c => [c, ''])))
  const [activePreset, setActivePreset] = useState(null)
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState(null)

  function applyPreset(key) {
    const p = PRESETS[key]
    const s = {}, b = {}
    CATEGORIES.forEach((cat, i) => { s[cat] = p.spend[i]; b[cat] = p.budget[i] })
    setSpend(s); setBudget(b); setActivePreset(key); setErrors({})
  }

  function validate() {
    const errs = {}
    CATEGORIES.forEach(cat => {
      if (spend[cat] === '' || isNaN(spend[cat])  || Number(spend[cat])  < 0) errs[`s_${cat}`] = true
      if (budget[cat] === '' || isNaN(budget[cat]) || Number(budget[cat]) < 0) errs[`b_${cat}`] = true
    })
    setErrors(errs)
    return !Object.keys(errs).length
  }

  function handleSubmit() {
    if (!validate()) return
    onPredict(
      CATEGORIES.map(c => Number(spend[c])),
      CATEGORIES.map(c => Number(budget[c]))
    )
  }

  return (
    <div style={s.panel}>
      <div style={s.panelHeader}>
        <div style={s.panelTitle}>Enter Your Spending Data</div>
        <div style={s.panelSub}>Last month's spending + planned budget</div>
      </div>

      {/* Presets */}
      <div style={s.presetRow}>
        {Object.entries(PRESETS).map(([key, p]) => (
          <button key={key} style={{ ...s.preset, ...(activePreset === key ? s.presetActive : {}) }}
            onClick={() => applyPreset(key)}>
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div style={s.inputsHeader}>
        <span style={s.colLabel} />
        <span style={s.colLabel}>Last Month ($)</span>
        <span style={s.colLabel}>Budget ($)</span>
        <span style={s.colLabel}>Ratio</span>
      </div>

      <div style={s.rows}>
        {CATEGORIES.map((cat, i) => {
          const meta = META[cat]
          const ratio = spend[cat] && budget[cat] && Number(budget[cat]) > 0
            ? Number(spend[cat]) / Number(budget[cat]) : null
          const over = ratio !== null && ratio > 1

          return (
            <div key={cat} style={s.row}>
              <div style={s.rowLabel}>
                <div style={{ ...s.rowDot, background: meta.color }} />
                <span style={s.rowIcon}>{meta.icon}</span>
                <span style={s.rowName}>{meta.label}</span>
              </div>

              <input
                style={{
                  ...s.input,
                  ...(errors[`s_${cat}`] ? s.inputErr : {}),
                  ...(focused === `s_${cat}` ? s.inputFocus : {}),
                }}
                type="number" min="0" placeholder="0"
                value={spend[cat]}
                onFocus={() => setFocused(`s_${cat}`)}
                onBlur={() => setFocused(null)}
                onChange={e => { setSpend(p => ({ ...p, [cat]: e.target.value })); setActivePreset(null); setErrors(p => ({ ...p, [`s_${cat}`]: false })) }}
              />

              <input
                style={{
                  ...s.input,
                  ...(errors[`b_${cat}`] ? s.inputErr : {}),
                  ...(focused === `b_${cat}` ? s.inputFocus : {}),
                }}
                type="number" min="0" placeholder="0"
                value={budget[cat]}
                onFocus={() => setFocused(`b_${cat}`)}
                onBlur={() => setFocused(null)}
                onChange={e => { setBudget(p => ({ ...p, [cat]: e.target.value })); setActivePreset(null); setErrors(p => ({ ...p, [`b_${cat}`]: false })) }}
              />

              <div style={s.ratioCell}>
                {ratio !== null ? (
                  <span style={{
                    ...s.ratio,
                    color: over ? '#f43f5e' : '#10b981',
                    background: over ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
                    border: `1px solid ${over ? 'rgba(244,63,94,0.25)' : 'rgba(16,185,129,0.25)'}`,
                  }}>
                    {ratio.toFixed(2)}×
                  </span>
                ) : <span style={s.ratioDash}>—</span>}
              </div>
            </div>
          )
        })}
      </div>

      <button style={{ ...s.btn, ...(isLoading ? s.btnLoading : {}) }}
        onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <span style={s.btnInner}>
            <span style={s.spinner} />
            Calculating risk...
          </span>
        ) : (
          <span style={s.btnInner}>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M3 8l4 4 6-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Run Prediction
          </span>
        )}
      </button>
    </div>
  )
}

const s = {
  panel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '24px 24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  panelHeader: {},
  panelTitle: { fontSize: 17, fontWeight: 700, color: '#eef2ff', letterSpacing: '-0.02em' },
  panelSub:   { fontSize: 13, color: '#7c8db5', marginTop: 3 },
  presetRow:  { display: 'flex', gap: 8 },
  preset: {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '8px 4px',
    fontSize: 12, fontWeight: 500, color: '#7c8db5',
    cursor: 'pointer', fontFamily: 'var(--font)',
    transition: 'all 0.15s',
  },
  presetActive: {
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.35)',
    color: '#a5b4fc',
  },
  inputsHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 100px 100px 64px',
    gap: 8,
    paddingBottom: 6,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  colLabel: { fontSize: 11, color: '#3d4a63', fontWeight: 600, letterSpacing: '0.04em' },
  rows: { display: 'flex', flexDirection: 'column', gap: 8 },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 100px 100px 64px',
    gap: 8,
    alignItems: 'center',
  },
  rowLabel: { display: 'flex', alignItems: 'center', gap: 8 },
  rowDot:   { width: 3, height: 24, borderRadius: 99 },
  rowIcon:  { fontSize: 15 },
  rowName:  { fontSize: 13, fontWeight: 500, color: '#c4d0e8' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: '#eef2ff',
    fontFamily: 'var(--font-num)',
    fontSize: 13,
    padding: '8px 10px',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  inputFocus: {
    borderColor: 'rgba(99,102,241,0.5)',
    boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
  },
  inputErr: {
    borderColor: 'rgba(244,63,94,0.5)',
    boxShadow: '0 0 0 3px rgba(244,63,94,0.1)',
  },
  ratioCell: { display: 'flex', justifyContent: 'center' },
  ratio: {
    fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-num)',
    padding: '3px 7px', borderRadius: 6,
  },
  ratioDash: { color: '#3d4a63', fontSize: 12 },
  btn: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontSize: 14, fontWeight: 600,
    padding: '14px',
    cursor: 'pointer',
    fontFamily: 'var(--font)',
    transition: 'opacity 0.15s, transform 0.15s',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
  },
  btnLoading: { opacity: 0.7, cursor: 'wait' },
  btnInner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinner: {
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
}
