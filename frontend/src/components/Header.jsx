import React from 'react'

export default function Header() {
  return (
    <header style={s.header}>
      <div style={s.inner}>
        <div style={s.brand}>
          <div style={s.logoMark}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="url(#lg)" strokeWidth="1.5"/>
              <path d="M6 10.5L9 13.5L14 7.5" stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#22d3ee"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div style={s.name}>Budget Risk Predictor</div>
            <div style={s.sub}>ML-powered overspending forecast</div>
          </div>
        </div>
        <div style={s.badge}>
          <span style={s.dot} />
          Model ready
        </div>
      </div>
    </header>
  )
}

const s = {
  header: {
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 32px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'rgba(7,9,15,0.8)',
  },
  inner: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 36, height: 36,
    background: 'rgba(99,102,241,0.12)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid rgba(99,102,241,0.25)',
  },
  name: { fontSize: 15, fontWeight: 700, color: '#eef2ff', letterSpacing: '-0.02em' },
  sub:  { fontSize: 11, color: '#7c8db5', marginTop: 1 },
  badge: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: 99, padding: '4px 12px',
    fontSize: 12, color: '#10b981',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 6px #10b981',
    display: 'inline-block',
    animation: 'glow 2s ease infinite',
  },
}
