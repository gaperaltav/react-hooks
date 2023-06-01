// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'
const EMPTY_GAME = Array(9).fill(null)

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  // 🐨 squares is the state for this component. Add useState for squares
  const [history, setHistory] = useLocalStorageState('history', [EMPTY_GAME])
  const [currentMove, setCurrentMove] =useLocalStorageState('history:move', 0)

  const currentSquares = history[currentMove]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)
  
  function selectSquare(square) {
    if (winner || currentSquares[square] !== null) {
      return
    }

    const newHistory = history.slice(0, currentMove + 1)
    const newSquares = [...currentSquares]
    newSquares[square] = nextValue

    const toWrite = [...newHistory, newSquares]
    setHistory(toWrite)
    setCurrentMove(newHistory.length)
  }

  function restart() {
    setCurrentMove(0)
    setHistory([EMPTY_GAME])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map((move, step) => {

            const desc = step === 0 ? `Go to game start` : `Go to move #${step}`
          
            return (
              <li key={step}>
                <button
                  onClick={() => setCurrentMove(step)}
                  disabled={currentMove === step}
                >
                  {desc} {currentMove ===  step ? '(current)': null}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}


function App() {
  return <Game />
}

export default App
