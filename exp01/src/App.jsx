import { useState } from 'react'
import './App.css'

function App() {
  // Prime Check State
  const [primeInput, setPrimeInput] = useState('')
  const [primeResult, setPrimeResult] = useState(null)

  // Factorial State
  const [factorialInput, setFactorialInput] = useState('')
  const [factorialResult, setFactorialResult] = useState(null)

  // Fibonacci State
  const [fibonacciInput, setFibonacciInput] = useState('')
  const [fibonacciResult, setFibonacciResult] = useState(null)

  // Prime Check Function
  const isPrime = (num) => {
    if (num < 2) return false
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false
    }
    return true
  }

  const checkPrime = () => {
    const num = parseInt(primeInput)
    if (isNaN(num)) {
      setPrimeResult({ error: 'Please enter a valid number' })
      return
    }
    const result = isPrime(num)
    setPrimeResult({
      number: num,
      isPrime: result,
      message: result ? `${num} is a Prime Number` : `${num} is NOT a Prime Number`
    })
  }

  // Factorial Function
  const factorial = (n) => {
    if (n < 0) return null
    if (n === 0 || n === 1) return 1n
    let result = 1n
    for (let i = 2n; i <= BigInt(n); i++) {
      result *= i
    }
    return result
  }

  const calculateFactorial = () => {
    const num = parseInt(factorialInput)
    if (isNaN(num) || num < 0) {
      setFactorialResult({ error: 'Please enter a valid non-negative number' })
      return
    }
    if (num > 170) {
      setFactorialResult({ error: 'Number too large! Please enter a number ≤ 170' })
      return
    }
    const result = factorial(num)
    setFactorialResult({
      number: num,
      result: result.toString()
    })
  }

  // Fibonacci Function
  const generateFibonacci = (length) => {
    if (length <= 0) return []
    if (length === 1) return [0]
    const sequence = [0, 1]
    for (let i = 2; i < length; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2])
    }
    return sequence.slice(0, length)
  }

  const calculateFibonacci = () => {
    const length = parseInt(fibonacciInput)
    if (isNaN(length) || length <= 0) {
      setFibonacciResult({ error: 'Please enter a valid positive number' })
      return
    }
    if (length > 50) {
      setFibonacciResult({ error: 'Length too large! Please enter a number ≤ 50' })
      return
    }
    const sequence = generateFibonacci(length)
    setFibonacciResult({
      length: length,
      sequence: sequence
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Math Utilities</h1>
        <p className="subtitle">Prime Check • Factorial • Fibonacci Sequence</p>
      </header>

      <div className="cards-container">
        {/* Prime Checker Card */}
        <div className="card prime-card">

          <h2>Prime Checker</h2>
          <p className="card-description">Check if a number is prime</p>
          <div className="input-group">
            <input
              type="number"
              value={primeInput}
              onChange={(e) => setPrimeInput(e.target.value)}
              placeholder="Enter a number"
              onKeyDown={(e) => e.key === 'Enter' && checkPrime()}
            />
            <button onClick={checkPrime}>Check</button>
          </div>
          {primeResult && (
            <div className={`result ${primeResult.error ? 'error' : primeResult.isPrime ? 'success' : 'info'}`}>
              {primeResult.error || primeResult.message}
            </div>
          )}
        </div>

        {/* Factorial Card */}
        <div className="card factorial-card">

          <h2>Factorial Calculator</h2>
          <p className="card-description">Calculate n! for any number</p>
          <div className="input-group">
            <input
              type="number"
              value={factorialInput}
              onChange={(e) => setFactorialInput(e.target.value)}
              placeholder="Enter a number (0-170)"
              onKeyDown={(e) => e.key === 'Enter' && calculateFactorial()}
            />
            <button onClick={calculateFactorial}>Calculate</button>
          </div>
          {factorialResult && (
            <div className={`result ${factorialResult.error ? 'error' : 'success'}`}>
              {factorialResult.error || (
                <div className="factorial-result">
                  <span className="factorial-label">{factorialResult.number}! =</span>
                  <span className="factorial-value">{factorialResult.result}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fibonacci Card */}
        <div className="card fibonacci-card">

          <h2>Fibonacci Sequence</h2>
          <p className="card-description">Generate Fibonacci numbers</p>
          <div className="input-group">
            <input
              type="number"
              value={fibonacciInput}
              onChange={(e) => setFibonacciInput(e.target.value)}
              placeholder="Sequence length (1-50)"
              onKeyDown={(e) => e.key === 'Enter' && calculateFibonacci()}
            />
            <button onClick={calculateFibonacci}>Generate</button>
          </div>
          {fibonacciResult && (
            <div className={`result ${fibonacciResult.error ? 'error' : 'success'}`}>
              {fibonacciResult.error || (
                <div className="fibonacci-result">
                  <div className="fibonacci-label">First {fibonacciResult.length} Fibonacci Numbers:</div>
                  <div className="fibonacci-sequence">
                    {fibonacciResult.sequence.map((num, idx) => (
                      <span key={idx} className="fibonacci-number">{num}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>Built with React | EXP-01</p>
      </footer>
    </div>
  )
}

export default App
