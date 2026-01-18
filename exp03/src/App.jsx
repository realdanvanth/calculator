import { useState } from 'react'
import './App.css'

function App() {
  const [basicPay, setBasicPay] = useState('')
  const [result, setResult] = useState(null)

  // Calculate allowances based on Basic Pay
  const calculateDA = (bp) => bp * 0.40  // 40% of Basic Pay
  const calculateHRA = (bp) => bp * 0.20 // 20% of Basic Pay
  const calculatePF = (bp) => bp * 0.12  // 12% of Basic Pay
  const calculateTax = (gross) => {
    if (gross <= 250000) return 0
    if (gross <= 500000) return (gross - 250000) * 0.05
    if (gross <= 1000000) return 12500 + (gross - 500000) * 0.20
    return 112500 + (gross - 1000000) * 0.30
  }

  // Determine Grade based on Basic Pay
  const getGrade = (bp) => {
    if (bp >= 50000) return 'A'
    if (bp >= 30000) return 'B'
    if (bp >= 20000) return 'C'
    return 'D'
  }

  // Calculate Bonus based on Grade
  const getBonus = (bp, grade) => {
    switch (grade) {
      case 'A': return bp * 0.20
      case 'B': return bp * 0.15
      case 'C': return bp * 0.10
      default: return bp * 0.05
    }
  }

  const calculate = () => {
    const bp = parseFloat(basicPay)
    if (isNaN(bp) || bp <= 0) {
      setResult({ error: 'Please enter a valid Basic Pay amount' })
      return
    }

    const da = calculateDA(bp)
    const hra = calculateHRA(bp)
    const pf = calculatePF(bp)
    const grossSalary = bp + da + hra
    const annualGross = grossSalary * 12
    const tax = calculateTax(annualGross)
    const monthlyTax = tax / 12
    const netSalary = grossSalary - pf - monthlyTax
    const grade = getGrade(bp)
    const bonus = getBonus(bp, grade)
    const totalSalary = netSalary + bonus

    setResult({
      basicPay: bp,
      da, hra, pf,
      grossSalary,
      monthlyTax,
      netSalary,
      grade,
      bonus,
      totalSalary
    })
  }

  const reset = () => {
    setBasicPay('')
    setResult(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Employee Tax Calculator</h1>
        <p className="subtitle">Calculate Salary, Grade, and Bonus</p>
      </header>

      <div className="calculator-card">
        <div className="input-section">
          <label htmlFor="basic-pay">Enter Basic Pay (Monthly):</label>
          <input
            id="basic-pay"
            type="number"
            value={basicPay}
            onChange={(e) => setBasicPay(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
            placeholder="e.g., 35000"
          />
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={calculate}>Calculate</button>
          <button className="btn-secondary" onClick={reset}>Reset</button>
        </div>

        {result && (
          <div className={`result ${result.error ? 'error' : 'success'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div className="result-content">
                <div className="result-section">
                  <h3>Salary Breakdown</h3>
                  <div className="result-row">
                    <span>Basic Pay:</span>
                    <span>{formatCurrency(result.basicPay)}</span>
                  </div>
                  <div className="result-row">
                    <span>DA (40%):</span>
                    <span>{formatCurrency(result.da)}</span>
                  </div>
                  <div className="result-row">
                    <span>HRA (20%):</span>
                    <span>{formatCurrency(result.hra)}</span>
                  </div>
                  <div className="result-row">
                    <span>Gross Salary:</span>
                    <span>{formatCurrency(result.grossSalary)}</span>
                  </div>
                </div>

                <div className="result-section">
                  <h3>Deductions</h3>
                  <div className="result-row">
                    <span>PF (12%):</span>
                    <span>{formatCurrency(result.pf)}</span>
                  </div>
                  <div className="result-row">
                    <span>Tax (Monthly):</span>
                    <span>{formatCurrency(result.monthlyTax)}</span>
                  </div>
                  <div className="result-row">
                    <span>Net Salary:</span>
                    <span>{formatCurrency(result.netSalary)}</span>
                  </div>
                </div>

                <div className="result-section highlight">
                  <h3>Grade and Bonus</h3>
                  <div className="result-row">
                    <span>Employee Grade:</span>
                    <span className="grade">{result.grade}</span>
                  </div>
                  <div className="result-row">
                    <span>Bonus:</span>
                    <span>{formatCurrency(result.bonus)}</span>
                  </div>
                  <div className="result-row total">
                    <span>Total Salary:</span>
                    <span>{formatCurrency(result.totalSalary)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Built with React | EXP-03</p>
      </footer>
    </div>
  )
}

export default App
