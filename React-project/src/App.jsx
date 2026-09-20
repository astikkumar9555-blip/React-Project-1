import { useState, useEffect } from "react";
 

 


const PAIR_SYMBOLS = ['🍎', '🍇', '🍉', '🍐', '🥭'];
const DIFF_SYMBOLS = ['⌛', '💣'];

const createDeck = () => {
  const deck = [
    ...PAIR_SYMBOLS,
    ...PAIR_SYMBOLS,
    ...DIFF_SYMBOLS
  ];

  return deck
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false
    }));
};

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50);
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "lost-time", "lost-bomb", "won"

  const restartGame = () => {
    setCards(createDeck());
    setSelectedCards([]);
    setIsDisabled(false);
    setTimeLeft(50);
    setGameStatus("playing");
  };

  useEffect(() => {
    restartGame();
  }, []);
 
  useEffect(()=>{
    if(timeLeft<=0 && gameStatus==="playing"){
      setGameStatus("lost-time");
      setIsDisabled(true);
    }
  },[timeLeft ,gameStatus]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    

    const timer = setInterval(() => {
    setTimeLeft((prev)=>(prev >0 ? prev-1 : 0));
    },1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleCardClick = (clickedCard) => {
    if (isDisabled || gameStatus !== "playing" || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

     const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    
    if (clickedCard.symbol === '💣') {
      setCards((prev)=>
        prev.map((c)=>
          c.id === clickedCard.id ?{ ...c,isMatched: true, isFlipped: true } : c
        )
      );
      
      setTimeLeft((prev)=>Math.max(0,prev-10));
      return;
    }

    if (clickedCard.symbol === '⌛') {
       setCards((prev) =>
        prev.map((c) => (c.id === clickedCard.id ? { ...c, isMatched: true, isFlipped:true } : c))
      );

      setSelectedCards([]);

      setTimeLeft((prev)=>prev+10);
      return;
    }

      const newSelection = [...selectedCards, clickedCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setIsDisabled(true);
      const [first, second] = newSelection;

      if (first.symbol === second.symbol) {
         
        const matchedDeck = cards.map((c) =>
          c.symbol === first.symbol ? { ...c, isFlipped: true, isMatched: true } : c
        );
        setCards(matchedDeck);

        
        const matchedPairsCount = matchedDeck.filter(
          (c) => PAIR_SYMBOLS.includes(c.symbol) && c.isMatched
        ).length;

        if (matchedPairsCount === PAIR_SYMBOLS.length * 2) {
          setGameStatus("won");
        }

        resetTurn();
      } else {
        
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  };

  const resetTurn = () => {
    setSelectedCards([]);
    setIsDisabled(false);
  };

  return (
    <div className="game-container">
      <div className={`timer-badge ${timeLeft <= 10 ? "time-low" : ""}`}>
        ⏳ Time Left: <span>{timeLeft}s</span>
      </div>

     
      {gameStatus === "lost-time" && <p className="status-msg error">⏰ Time's Up! Game Over</p>}
       {gameStatus === "won" && <p className="status-msg-success">🎉 You matched all pairs!</p>}

      {gameStatus !== "playing" && (
        <button className="restart-btn" onClick={restartGame}>Play Again</button>
      )}

   <div className="grid-main">
        <div className="grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
            disabled={isDisabled || gameStatus !== "playing" || card.isMatched}
          >
            {card.isFlipped || card.isMatched ? card.symbol : "❓"}
          </button>
        ))}
      </div>
   </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="main">
      <div className="container">
        <h1 class="title">Memory Blast Game</h1>
       </div>
       <div className="box">
         <h2 className="titles">Test your memory. Match all 5 pairs before time ends!</h2>
     
       </div>
      <MemoryGame />
    </div>
  );
}