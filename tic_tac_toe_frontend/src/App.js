import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Minimalistic Tic Tac Toe built with functional React components.
 * - Centered board
 * - Player indicator above the board
 * - Controls below the board
 * - Win/draw detection, reset, start/restart screen
 * - Light theme using provided palette
 */

// Utilities
const COLORS = {
  primary: '#1976d2',
  secondary: '#f50057',
  accent: '#ffd600',
  textPrimary: '#1f2937',
  textMuted: '#6b7280',
  bg: '#ffffff',
  bgSoft: '#f7fafc',
  border: '#e5e7eb',
};

// Compute winner for a given 3x3 board
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // cols
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // diags
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// Square component
function Square({ value, onClick, isWinning }) {
  const color = value === 'X' ? COLORS.primary : COLORS.secondary;
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={`Place ${value ? value : 'mark'}`}
      style={{
        color,
        borderColor: isWinning ? COLORS.accent : COLORS.border,
        boxShadow: isWinning ? `0 0 0 2px ${COLORS.accent} inset` : 'none',
      }}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onSquareClick(idx)}
          isWinning={winningLine.includes(idx)}
        />
      ))}
    </div>
  );
}

// HUD component: status + controls
function HUD({ status, onReset, started, onStart }) {
  return (
    <div className="ttt-hud">
      <div className="ttt-status" role="status" aria-live="polite">
        {status}
      </div>
      <div className="ttt-controls">
        {!started ? (
          <button className="btn btn-primary" onClick={onStart}>Start</button>
        ) : (
          <button className="btn btn-secondary" onClick={onReset}>Restart</button>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This is the root of the Tic Tac Toe app.
   * It manages game state, including:
   * - start/restart
   * - 3x3 board updates
   * - player turn tracking
   * - win and draw detection
   * Returns a full-screen centered layout.
   */
  const [started, setStarted] = useState(false);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => squares.every(Boolean) && !winner, [squares, winner]);

  const nextPlayer = xIsNext ? 'X' : 'O';
  const status = !started
    ? 'Ready to play?'
    : winner
      ? `Winner: ${winner} 🎉`
      : isDraw
        ? 'Draw! 🤝'
        : `Turn: ${nextPlayer}`;

  const handleStart = () => {
    setStarted(true);
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const handleSquareClick = (index) => {
    if (!started || winner || squares[index]) return;
    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  return (
    <div className="ttt-app" style={{ background: COLORS.bgSoft }}>
      <div className="ttt-container">
        {/* Player indicator */}
        <div className="ttt-indicator">
          <span className="pill pill-x" aria-label="Player X">X</span>
          <span className="vs">vs</span>
          <span className="pill pill-o" aria-label="Player O">O</span>
        </div>

        {/* Status and controls */}
        <HUD
          status={status}
          onReset={handleReset}
          started={started}
          onStart={handleStart}
        />

        {/* Board */}
        <div className="ttt-board-wrapper">
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={line}
          />
        </div>

        {/* Footer note */}
        <div className="ttt-footer-note">
          First move: <strong style={{ color: COLORS.primary }}>X</strong>
        </div>
      </div>
    </div>
  );
}
