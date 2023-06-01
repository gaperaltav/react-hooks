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
  const [currentGame, setCurrentGame] = useLocalStorageState(
    'squares',
    EMPTY_GAME,
  )
  const [history, setHistory] = useLocalStorageState('history', [EMPTY_GAME])

  const nextValue = calculateNextValue(currentGame)
  const winner = calculateWinner(currentGame)
  const status = calculateStatus(winner, currentGame, nextValue)
  const moves = calculateMoves(history)

  function selectSquare(square) {
    if (winner || currentGame[square] !== null) {
      return
    }

    const newSquares = [...currentGame]
    newSquares[square] = nextValue

    const newGameMoves = calculateGameMoves(newSquares)
    setCurrentGame(newSquares)

    let newHistory
    if (newGameMoves.length >= history.length) {
      newHistory = [...history]
      newHistory.push(newSquares)
      setHistory(newHistory)
    } else {
      const lastMovePosition = newGameMoves.length - 1
      newHistory = history.slice(0, lastMovePosition)
      newHistory[lastMovePosition] = newSquares
      setHistory(newHistory)
    }
  }

  function restart() {
    setCurrentGame(EMPTY_GAME)
    setHistory([EMPTY_GAME])
  }

  function moveGameToStep(step) {
    const gameStep = history[step]

    setCurrentGame(gameStep)
  }

  console.log({history, moves})

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentGame} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {moves.map((move, index) => {
            const isCurrentMove = history.length - 1 === move
            return (
              <li key={index}>
                <input
                  type="button"
                  onClick={() => moveGameToStep(index)}
                  value={`Go to ${
                    move === 0 ? 'game start' : `move # ${move}`
                  } ${isCurrentMove ? '(current)' : ''}`}
                  disabled={isCurrentMove}
                />
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

function calculateMoves(history) {
  return history.map((square, index) => index)
}

function calculateGameMoves(squares) {
  const currentMoves = squares
    .filter(square => square !== null)
    .map((square, index) => index + 1)

  return Array(1).fill(0).concat(currentMoves)
}

function App() {
  return <Game />
}

export default App
