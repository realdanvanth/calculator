import { useState } from 'react'
import './App.css'

function App() {
  const [number, setNumber] = useState('')
  const [result, setResult] = useState(null)

  const calculateSumOfDigits = () => {
    const num = number.replace(/[^0-9]/g, '')
    if (!num) {
      setResult({ error: 'Please enter a valid number' })
      return
    }

    const digits = num.split('').map(Number)
    const sum = digits.reduce((acc, digit) => acc + digit, 0)

    setResult({
      originalNumber: number,
      digits: digits,
      sum: sum
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      calculateSumOfDigits()
    }
  }

  const reset = () => {
    setNumber('')
    setResult(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Sum of Digits Calculator</h1>
        <p className="subtitle">Enter a number to find the sum of its digits</p>
      </header>

      <div className="calculator-card">
        <div className="input-section">
          <label htmlFor="number-input">Enter a Number:</label>
          <input
            id="number-input"
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., 12345"
          />
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={calculateSumOfDigits}>
            Calculate Sum
          </button>
          <button className="btn-secondary" onClick={reset}>
            Reset
          </button>
        </div>

        {result && (
          <div className={`result ${result.error ? 'error' : 'success'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div className="result-content">
                <p className="result-label">Number: <span>{result.originalNumber}</span></p>
                <p className="result-label">
                  Digits: <span>{result.digits.join(' + ')}</span>
                </p>
                <p className="result-sum">
                  Sum = <span>{result.sum}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Built with React | EXP-02</p>
      </footer>
    </div>
  )
}

export default App
