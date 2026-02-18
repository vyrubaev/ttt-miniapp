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
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [statusText, setStatusText] = useState("Ход игрока (X)");

  // Telegram WebApp ready
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.hide();
    }
  }, []);

  // Обновляем статус и проверяем победителя
  useEffect(() => {
    checkWinner();
  }, [board]);

  useEffect(() => {
    if (winner) {
      setStatusText(winner === "draw" ? "Ничья!" : `Победил ${winner}`);
    } else {
      setStatusText("Ход игрока (X)");
    }
  }, [winner]);

  const checkWinner = () => {
    for (let line of winningLines) {
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setScore(prev => ({ ...prev, [board[a]]: prev[board[a]] + 1 }));
        return;
      }
    }
    if (!board.includes(null) && !winner) {
      setWinner("draw");
      setScore(prev => ({ ...prev, draw: prev.draw + 1 }));
    }
  };

  // Ход игрока
  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    // Ход компьютера через 300мс
    setTimeout(() => computerMove(newBoard), 300);
  };

  // Минимакс AI
  const minimax = (newBoard, isMax) => {
    const availSpots = newBoard.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    const w = getWinner(newBoard);
    if (w === "O") return { score: 1 };
    if (w === "X") return { score: -1 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i of availSpots) {
      const move = { index: i };
      newBoard[i] = isMax ? "O" : "X";
      move.score = minimax(newBoard, !isMax).score;
      newBoard[i] = null;
      moves.push(move);
    }

    let bestMove;
    if (isMax) {
      let bestScore = -Infinity;
      for (let m of moves) if(m.score>bestScore){bestScore=m.score; bestMove=m;}
    } else {
      let bestScore = Infinity;
      for (let m of moves) if(m.score<bestScore){bestScore=m.score; bestMove=m;}
    }
    return bestMove;
  };

  const getWinner = (b) => {
    for (let line of winningLines) {
      const [a,b1,c] = line;
      if (b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a];
    }
    return null;
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Крестики-нолики</h1>

      {/* Счёт игр */}
      <div className="flex gap-8 mb-4 text-lg">
        <div>Игрок X: {score.X}</div>
        <div>Компьютер O: {score.O}</div>
        <div>Ничьи: {score.draw}</div>
      </div>

      {/* Статус */}
      <h2 className="mb-4 text-xl font-semibold">{statusText}</h2>

      {/* Доска */}
      <div className="grid grid-cols-3 gap-3">
        {board.map((cell,i)=>(
          <button
            key={i}
            onClick={()=>handleClick(i)}
            className="w-24 h-24 md:w-32 md:h-32 text-3xl md:text-5xl font-bold bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-3 text-lg font-semibold bg-white/30 hover:bg-white/50 rounded-lg transition-colors"
      >
        Новая игра
      </button>
    </div>
  );
}

export default App;