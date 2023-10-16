import "./App.css";
import { useState } from "react";

function Square({ value, onSquareClick, isHighlight }) {
    return (
        <button className={`square ${isHighlight ? "highlight" : ""}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares, i);
    }

    const { winner, isDraw, line } = calculateWinner(squares);
    let status;
    if (isDraw) {
        status = "Draw";
    } else if (winner && !isDraw) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    var boardGame = [];
    for (var i = 0; i < 3; i++) {
        var square = [];
        for (var j = 0; j < 3; j++) {
            const squareIndex = i * 3 + j;
            square.push(
                <Square
                    key={squareIndex}
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                    isHighlight={line?.includes(squareIndex)}
                />,
            );
        }
        boardGame.push(
            <div key={i} className="board-row">
                {square}
            </div>,
        );
    }

    return (
        <>
            <div className="status">{status}</div>

            <div>{boardGame}</div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [location, setLocation] = useState([Array(9).fill("null")]);

    const [currentMove, setCurrentMove] = useState(0);
    const [isToggleAscending, setIsToggleAscending] = useState(true);

    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares, index) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setLocation([...location.slice(0, currentMove + 1), getLocation(index)]);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((_, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move + " " + location[move];
        } else {
            description = "Go to game start";
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <h2>You are at move #{currentMove}</h2>
                <button onClick={() => setIsToggleAscending(!isToggleAscending)}>
                    Toggle {isToggleAscending ? "ascending" : "descending"}
                </button>
                <ol>{isToggleAscending ? moves : moves.reverse()}</ol>
            </div>
        </div>
    );
}

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
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i], isDraw: false };
        }
    }
    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            isDraw = false;
            break;
        }
    }
    return {
        winner: null,
        line: null,
        isDraw: isDraw,
    };
}

function getLocation(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return `(${row}, ${col})`;
}
