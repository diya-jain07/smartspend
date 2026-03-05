import React, { useState } from 'react'
import Header from './components/Header.jsx'
import StatCards from './components/StatCards.jsx'
import InputPanel from './components/InputPanel.jsx'
import RiskDashboard from './components/RiskDashboard.jsx'
import { predictRisk } from './utils/model.js'

export default function App() {
  const [predictions, setPredictions] = useState(null)
  const [isLoading,   setIsLoading]   = useState(false)
  const [lastSpend,   setLastSpend]   = useState([])
  const [lastBudget,  setLastBudget]  = useState([])

  async function handlePredict(spend, budget) {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400))
    const result = predictRisk(spend, budget)
    setPredictions(result)
    setLastSpend(spend)
    setLastBudget(budget)
    setIsLoading(false)
  }

  return (
    <div style={s.app}>
      <Header />

      <main style={s.main}>
        <div style={s.inner}>

          {/* Page title */}
          <div style={s.hero}>
            <div style={s.heroTitle}>
              Will you overspend next month?
            </div>
            <div style={s.heroSub}>
              Enter your spending history and planned budget — our ML model predicts your risk per category.
            </div>
          </div>

          {/* Stat cards */}
          <StatCards predictions={predictions} />

          {/* Main grid */}
          <div style={s.grid}>
            <InputPanel onPredict={handlePredict} isLoading={isLoading} />
            <RiskDashboard
              predictions={predictions}
              spend={lastSpend}
              budget={lastBudget}
            />
          </div>

        </div>
      </main>
    </div>
  )
}

const s = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '40px 24px 64px',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  hero: {
    textAlign: 'center',
    padding: '8px 0 4px',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 800,
    color: '#eef2ff',
    letterSpacing: '-0.04em',
    lineHeight: 1.15,
    background: 'linear-gradient(135deg, #eef2ff 30%, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 15,
    color: '#7c8db5',
    maxWidth: 480,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    alignItems: 'start',
  },
}
