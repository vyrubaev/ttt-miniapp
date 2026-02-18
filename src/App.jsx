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
  const [statusText, setStatusText] = useState("Ход игрока (X)");

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
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setStatusText(`Победил ${board[a]}`);
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner("draw");
      setStatusText("Ничья!");
      return;
    }
    setStatusText("Ход игрока (X)");
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    // Обновляем статус до хода компьютера
    setStatusText("Ход компьютера (O)");

    setTimeout(() => computerMove(newBoard), 300);
  };

  const minimax = (newBoard, isMax) => {
    const availSpots = newBoard.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    const winnerCheck = getWinner(newBoard);
    if (winnerCheck === "O") return {score:1};
    if (winnerCheck === "X") return {score:-1};
    if (availSpots.length === 0) return {score:0};

    const moves = [];
    for (let i of availSpots){
      const move = {index:i};
      newBoard[i] = isMax?"O":"X";
      move.score = minimax(newBoard,!isMax).score;
      newBoard[i] = null;
      moves.push(move);
    }

    let bestMove;
    if (isMax){
      let bestScore=-Infinity;
      for(let m of moves) if(m.score>bestScore){bestScore=m.score; bestMove=m;}
    } else {
      let bestScore=Infinity;
      for(let m of moves) if(m.score<bestScore){bestScore=m.score; bestMove=m;}
    }
    return bestMove;
  };

  const getWinner = (b) => {
    for (let line of winningLines){
      const [a,b1,c] = line;
      if (b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a];
    }
    return null;
  };

  const computerMove = (currentBoard) => {
    if (winner) return;

    const best = minimax(currentBoard,true);
    if (best){
      const newBoard = [...currentBoard];
      newBoard[best.index] = "O";
      setBoard(newBoard);
      setStatusText("Ход игрока (X)");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setStatusText("Ход игрока (X)");
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Крестики-нолики</h1>
      <h2>{statusText}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "5px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {board.map((cell,i)=>(
          <button
            key={i}
            onClick={()=>handleClick(i)}
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