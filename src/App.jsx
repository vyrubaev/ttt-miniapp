import { useState, useEffect } from "react";

const winningLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [statusText, setStatusText] = useState("Ход игрока (X)");
  const [stats, setStats] = useState({ player:0, computer:0, draw:0 });

  // 🔹 Фон Telegram
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.hide();
      tg.setBackgroundColor("#7c3aed");
    }
  }, []);

  useEffect(() => checkWinner(), [board]);

  const checkWinner = () => {
    for (let line of winningLines) {
      const [a,b,c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setStatusText(`Победил ${board[a]}`);
        setStats(prev => ({
          ...prev,
          player: board[a]==="X"? prev.player+1 : prev.player,
          computer: board[a]==="O"? prev.computer+1 : prev.computer
        }));
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner("draw");
      setStatusText("Ничья!");
      setStats(prev => ({...prev, draw: prev.draw + 1}));
      return;
    }
    setStatusText("Ход игрока (X)");
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    setStatusText("Ход компьютера (O)");
    setTimeout(() => computerMove(newBoard), 300);
  };

  const minimax = (newBoard, isMax) => {
    const avail = newBoard.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    const w = getWinner(newBoard);
    if (w==="O") return {score:1};
    if (w==="X") return {score:-1};
    if (avail.length===0) return {score:0};

    const moves = [];
    for (let i of avail){
      const move = {index:i};
      newBoard[i] = isMax?"O":"X";
      move.score = minimax(newBoard,!isMax).score;
      newBoard[i] = null;
      moves.push(move);
    }

    let bestMove;
    if(isMax){
      let bestScore=-Infinity;
      for(let m of moves) if(m.score>bestScore){bestScore=m.score; bestMove=m;}
    } else {
      let bestScore=Infinity;
      for(let m of moves) if(m.score<bestScore){bestScore=m.score; bestMove=m;}
    }
    return bestMove;
  };

  const getWinner = (b)=>{
    for(let line of winningLines){
      const [a,b1,c] = line;
      if(b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a];
    }
    return null;
  };

  const computerMove=(curBoard)=>{
    if(winner) return;
    const best = minimax(curBoard,true);
    if(best){
      const newBoard = [...curBoard];
      newBoard[best.index] = "O";
      setBoard(newBoard);
      setStatusText("Ход игрока (X)");
    }
  };

  const resetGame = ()=>{
    setBoard(Array(9).fill(null));
    setWinner(null);
    setStatusText("Ход игрока (X)");
  };

  // 🔹 Размер поля под экран
  const boardSize = Math.min(window.innerWidth*0.95, window.innerHeight*0.6);

  return (
    <div style={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"flex-start",
      minHeight:"100vh",
      gap:"10px",
      padding:"10px",
      background: "linear-gradient(to bottom right, #7c3aed, #4f46e5)"
    }}>
      <h1 style={{margin:0, color:"#facc15"}}>Крестики-нолики</h1>
      <h2 style={{margin:0, color:"#ffffff"}}>{statusText}</h2>

      {/* 🔹 Игровое поле */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3, 1fr)",
        gap:"5px",
        width: boardSize,
        height: boardSize,
        marginTop:"10px"
      }}>
        {board.map((cell,i)=>(
          <button
            key={i}
            onClick={()=>handleClick(i)}
            style={{
              width:"100%",
              height:"100%",
              fontSize: boardSize/3*0.6,
              cursor:"pointer",
              borderRadius:"8px",
              backgroundColor:"rgba(255,255,255,0.2)",
              fontWeight:"bold",
              color:"#ffffff"
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop:"10px",
          padding:"10px 20px",
          fontSize:"16px",
          backgroundColor:"rgba(255,255,255,0.3)",
          borderRadius:"8px",
          color:"#ffffff",
          cursor:"pointer"
        }}
      >
        Новая игра
      </button>

      {/* 🔹 Статистика */}
      <div style={{marginTop:"15px", color:"#ffffff", fontSize:"16px", textAlign:"center"}}>
        <div>Игрок X: {stats.player}</div>
        <div>Компьютер O: {stats.computer}</div>
        <div>Ничьи: {stats.draw}</div>
      </div>
    </div>
  );
}

export default App;