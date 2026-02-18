import { useState, useEffect } from "react";

const winningLines = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.hide();
    }
  }, []);

  useEffect(() => {
    checkWinner();
  }, [board]);

  // Проверка победителя
  const checkWinner = () => {
    for (let line of winningLines) {
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (!board.includes(null)) setWinner("draw");
  };

  // Ход игрока
  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X"; // Игрок всегда X
    setBoard(newBoard);

    // Ход компьютера через 300мс
    setTimeout(() => computerMove(newBoard), 300);
  };

  // Минимакс алгоритм
  const minimax = (newBoard, isMax) => {
    const availSpots = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);

    // Проверяем, есть ли победитель
    const winnerCheck = getWinner(newBoard);
    if (winnerCheck === "O") return { score: 1 };
    if (winnerCheck === "X") return { score: -1 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[availSpots[i]] = isMax ? "O" : "X";

      const result = minimax(newBoard, !isMax);
      move.score = result.score;

      newBoard[availSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (isMax) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    }

    return bestMove;
  };

  // Функция для проверки победителя на произвольной доске
  const getWinner = (boardCheck) => {
    for (let line of winningLines) {
      const [a,b,c] = line;
      if (boardCheck[a] && boardCheck[a] === boardCheck[b] && boardCheck[a] === boardCheck[c]) {
        return boardCheck[a];
      }
    }
    return null;
  };

  // Ход компьютера
  const computerMove = (currentBoard) => {
    if (winner) return;

    const best = minimax(currentBoard, true);
    if (best) {
      const newBoard = [...currentBoard];
      newBoard[best.index] = "O";
      setBoard(newBoard);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Крестики-нолики</h1>

      {winner && (
        <h2>{winner === "draw" ? "Ничья!" : `Победил ${winner}`}</h2>
      )}

      {!winner && <h2>Ход игрока (X)</h2>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "5px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "2rem",
              cursor: "pointer",
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Новая игра
      </button>
    </div>
  );
}

export default App;