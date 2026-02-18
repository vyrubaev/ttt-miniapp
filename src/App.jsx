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
  const [xTurn, setXTurn] = useState(true);
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

  const checkWinner = () => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        setWinner(board[a]);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("draw");
    }
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xTurn ? "X" : "O";
    setBoard(newBoard);
    setXTurn(!xTurn);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXTurn(true);
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Крестики-нолики</h1>

      {winner && (
        <h2>
          {winner === "draw"
            ? "Ничья!"
            : `Победил ${winner}`}
        </h2>
      )}

      {!winner && (
        <h2>Ход: {xTurn ? "X" : "O"}</h2>
      )}

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