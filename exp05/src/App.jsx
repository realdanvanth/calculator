import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('menu') // 'menu', 'calculator', 'game'

  // Calculator state
  const [display, setDisplay] = useState('0')
  const [firstNum, setFirstNum] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecond, setWaitingForSecond] = useState(false)

  // Game state
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [gameOperator, setGameOperator] = useState('+')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')
  const [streak, setStreak] = useState(0)
  const inputRef = useRef(null)

  const generateQuestion = useCallback(() => {
    const ops = ['+', '-', '*']
    const op = ops[Math.floor(Math.random() * ops.length)]
    let a, b

    if (op === '*') {
      a = Math.floor(Math.random() * 10) + 1
      b = Math.floor(Math.random() * 10) + 1
    } else if (op === '-') {
      a = Math.floor(Math.random() * 50) + 10
      b = Math.floor(Math.random() * a)
    } else {
      a = Math.floor(Math.random() * 50) + 1
      b = Math.floor(Math.random() * 50) + 1
    }

    setNum1(a)
    setNum2(b)
    setGameOperator(op)
    setAnswer('')
    setMessage('')
  }, [])

  useEffect(() => {
    if (mode === 'game') {
      generateQuestion()
      if (inputRef.current) inputRef.current.focus()
    }
  }, [mode, generateQuestion])

  const getCorrectAnswer = () => {
    switch (gameOperator) {
      case '+': return num1 + num2
      case '-': return num1 - num2
      case '*': return num1 * num2
      default: return 0
    }
  }

  const checkAnswer = () => {
    const userAnswer = parseInt(answer)
    const correct = getCorrectAnswer()

    if (userAnswer === correct) {
      setScore(score + 10 + streak * 2)
      setStreak(streak + 1)
      setMessage('Correct! Great job!')
      setTimeout(() => generateQuestion(), 1000)
    } else {
      setStreak(0)
      setMessage(`Oops! The answer was ${correct}`)
      setTimeout(() => generateQuestion(), 2000)
    }
  }

  // Calculator functions
  const inputDigit = (digit) => {
    if (waitingForSecond) {
      setDisplay(digit)
      setWaitingForSecond(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputOperator = (op) => {
    setFirstNum(parseFloat(display))
    setOperator(op)
    setWaitingForSecond(true)
  }

  const calculate = () => {
    if (firstNum === null || operator === null) return
    const second = parseFloat(display)
    let result
    switch (operator) {
      case '+': result = firstNum + second; break
      case '-': result = firstNum - second; break
      case '*': result = firstNum * second; break
      case '/': result = second !== 0 ? firstNum / second : 'Error'; break
      default: return
    }
    setDisplay(String(result))
    setFirstNum(null)
    setOperator(null)
  }

  const clear = () => {
    setDisplay('0')
    setFirstNum(null)
    setOperator(null)
    setWaitingForSecond(false)
  }

  if (mode === 'menu') {
    return (
      <div className="app">
        <header className="header">
          <h1>Kids Math Fun</h1>
          <p className="subtitle">Learn math the fun way!</p>
        </header>

        <div className="menu-container">
          <button className="menu-btn calculator-btn" onClick={() => setMode('calculator')}>
            <span className="menu-icon">+−×÷</span>
            <span className="menu-label">Calculator</span>
          </button>
          <button className="menu-btn game-btn" onClick={() => setMode('game')}>
            <span className="menu-icon">?</span>
            <span className="menu-label">Math Game</span>
          </button>
        </div>

        <footer className="footer">
          <p>Built with React | EXP-05</p>
        </footer>
      </div>
    )
  }

  if (mode === 'calculator') {
    return (
      <div className="app">
        <header className="header">
          <h1>Calculator</h1>
          <button className="back-btn" onClick={() => setMode('menu')}>Back to Menu</button>
        </header>

        <div className="calculator">
          <div className="calc-display">{display}</div>
          <div className="calc-buttons">
            <button onClick={clear} className="btn-clear">C</button>
            <button onClick={() => inputOperator('/')} className="btn-op">/</button>
            <button onClick={() => inputOperator('*')} className="btn-op">x</button>
            <button onClick={() => setDisplay(display.slice(0, -1) || '0')} className="btn-op">DEL</button>

            <button onClick={() => inputDigit('7')}>7</button>
            <button onClick={() => inputDigit('8')}>8</button>
            <button onClick={() => inputDigit('9')}>9</button>
            <button onClick={() => inputOperator('-')} className="btn-op">-</button>

            <button onClick={() => inputDigit('4')}>4</button>
            <button onClick={() => inputDigit('5')}>5</button>
            <button onClick={() => inputDigit('6')}>6</button>
            <button onClick={() => inputOperator('+')} className="btn-op">+</button>

            <button onClick={() => inputDigit('1')}>1</button>
            <button onClick={() => inputDigit('2')}>2</button>
            <button onClick={() => inputDigit('3')}>3</button>
            <button onClick={calculate} className="btn-equals" style={{ gridRow: 'span 2' }}>=</button>

            <button onClick={() => inputDigit('0')} style={{ gridColumn: 'span 2' }}>0</button>
            <button onClick={() => inputDigit('.')}>.</button>
          </div>
        </div>

        <footer className="footer">
          <p>Built with React | EXP-05</p>
        </footer>
      </div>
    )
  }

  // Game mode
  return (
    <div className="app">
      <header className="header">
        <h1>Math Game</h1>
        <button className="back-btn" onClick={() => { setMode('menu'); setScore(0); setStreak(0) }}>
          Back to Menu
        </button>
      </header>

      <div className="game-container">
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="streak">Streak: {streak}</div>
        </div>

        <div className="question-card">
          <div className="question">
            {num1} {gameOperator} {num2} = ?
          </div>
          <input
            ref={inputRef}
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && answer && checkAnswer()}
            placeholder="Your answer"
            className="answer-input"
          />
          <button className="submit-btn" onClick={checkAnswer} disabled={!answer}>
            Check Answer
          </button>
          {message && (
            <div className={`message ${message.includes('Correct') ? 'correct' : 'wrong'}`}>
              {message}
            </div>
          )}
        </div>

        <button className="skip-btn" onClick={generateQuestion}>
          Skip Question
        </button>
      </div>

      <footer className="footer">
        <p>Built with React | EXP-05</p>
      </footer>
    </div>
  )
}

export default App
