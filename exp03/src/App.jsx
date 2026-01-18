import { useState } from 'react'
import './App.css'

function App() {
  const [valueA, setValueA] = useState('')
  const [valueB, setValueB] = useState('')
  const [result, setResult] = useState(null)
  const [operation, setOperation] = useState('')

  // Basic arithmetic operations
  const add = () => {
    const a = parseFloat(valueA)
    const b = parseFloat(valueB)
    if (isNaN(a) || isNaN(b)) {
      setResult({ error: 'Please enter valid numbers in both fields' })
      return
    }
    setOperation('Addition')
    setResult({ value: a + b })
  }

  const subtract = () => {
    const a = parseFloat(valueA)
    const b = parseFloat(valueB)
    if (isNaN(a) || isNaN(b)) {
      setResult({ error: 'Please enter valid numbers in both fields' })
      return
    }
    setOperation('Subtraction')
    setResult({ value: a - b })
  }

  const multiply = () => {
    const a = parseFloat(valueA)
    const b = parseFloat(valueB)
    if (isNaN(a) || isNaN(b)) {
      setResult({ error: 'Please enter valid numbers in both fields' })
      return
    }
    setOperation('Multiplication')
    setResult({ value: a * b })
  }

  const divide = () => {
    const a = parseFloat(valueA)
    const b = parseFloat(valueB)
    if (isNaN(a) || isNaN(b)) {
      setResult({ error: 'Please enter valid numbers in both fields' })
      return
    }
    if (b === 0) {
      setResult({ error: 'Cannot divide by zero' })
      return
    }
    setOperation('Division')
    setResult({ value: a / b })
  }

  // Expression: (a+b)/(a-b)*(a+b)
  const evaluateExpression = () => {
    const a = parseFloat(valueA)
    const b = parseFloat(valueB)
    if (isNaN(a) || isNaN(b)) {
      setResult({ error: 'Please enter valid numbers in both fields' })
      return
    }
    if (a - b === 0) {
      setResult({ error: 'Expression undefined: (a-b) equals zero' })
      return
    }
    const expressionResult = ((a + b) / (a - b)) * (a + b)
    setOperation('Expression: (a+b)/(a-b)*(a+b)')
    setResult({ value: expressionResult })
  }

  // Sum of squares of digits
  const modSumSquare = () => {
    const a = valueA.replace(/[^0-9]/g, '')
    if (!a) {
      setResult({ error: 'Please enter a valid number in textbox A' })
      return
    }
    let sum = 0
    for (const digit of a) {
      sum += parseInt(digit) ** 2
    }
    const digits = a.split('').map(d => `${d}²`).join(' + ')
    setOperation(`MoD_Sum_square: ${digits}`)
    setResult({ value: sum })
  }

  // Check even or odd
  const checkEvenOdd = () => {
    const a = parseInt(valueA)
    if (isNaN(a)) {
      setResult({ error: 'Please enter a valid integer in textbox A' })
      return
    }
    const isEven = a % 2 === 0
    setOperation('Even/Odd Check')
    setResult({ text: `${a} is ${isEven ? 'EVEN' : 'ODD'}` })
  }

  const reset = () => {
    setValueA('')
    setValueB('')
    setResult(null)
    setOperation('')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>ReactJS Calculator</h1>
        <p className="subtitle">Arithmetic Operations & Expression Evaluator</p>
      </header>

      <div className="calculator-card">
        <div className="input-section">
          <label htmlFor="value-a">Enter Value A:</label>
          <input
            id="value-a"
            type="number"
            value={valueA}
            onChange={(e) => setValueA(e.target.value)}
            placeholder="Enter number for A"
          />
        </div>

        <div className="input-section">
          <label htmlFor="value-b">Enter Value B:</label>
          <input
            id="value-b"
            type="number"
            value={valueB}
            onChange={(e) => setValueB(e.target.value)}
            placeholder="Enter number for B"
          />
        </div>

        <div className="operations-section">
          <h3>Basic Operations</h3>
          <div className="button-grid">
            <button className="btn-operation" onClick={add}>Add (+)</button>
            <button className="btn-operation" onClick={subtract}>Subtract (−)</button>
            <button className="btn-operation" onClick={multiply}>Multiply (×)</button>
            <button className="btn-operation" onClick={divide}>Divide (÷)</button>
          </div>
        </div>

        <div className="operations-section">
          <h3>Expression Evaluation</h3>
          <p className="expression-hint">Result = (a+b)/(a−b)×(a+b)</p>
          <button className="btn-expression" onClick={evaluateExpression}>
            Evaluate Expression
          </button>
        </div>

        <div className="operations-section">
          <h3>Special Operations (on textbox A)</h3>
          <div className="button-grid special">
            <button className="btn-special" onClick={modSumSquare}>
              MoD_Sum_square
            </button>
            <button className="btn-special" onClick={checkEvenOdd}>
              Even_ODD
            </button>
          </div>
        </div>

        <button className="btn-reset" onClick={reset}>Reset</button>

        {result && (
          <div className={`result ${result.error ? 'error' : 'success'}`}>
            {result.error ? (
              <p>{result.error}</p>
            ) : (
              <div className="result-content">
                <span className="operation-label">{operation}</span>
                <span className="result-value">
                  {result.text || result.value}
                </span>
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
