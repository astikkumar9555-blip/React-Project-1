import { useState, useEffect } from "react";
import "./Card.css";

 


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
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "lost-time", "lost-bomb", "won"

  const restartGame = () => {
    setCards(createDeck());
    setSelectedCards([]);
    setIsDisabled(false);
    setTimeLeft(30);
    setGameStatus("playing");
  };

  useEffect(() => {
    restartGame();
  }, []);

  // Timer interval
  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (timeLeft <= 0) {
      setGameStatus("lost-time");
      setIsDisabled(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  const handleCardClick = (clickedCard) => {
    if (isDisabled || gameStatus !== "playing" || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    // Flip the clicked card immediately
    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    // --- CASE 1: BOMB TRIGGER ---
    if (clickedCard.symbol === '💣') {
      setIsDisabled(true);
      setTimeLeft(0);
      setGameStatus("lost-bomb");
      return;
    }

    // --- CASE 2: HOURGLASS TRIGGER (+5 SECONDS BONUS) ---
    if (clickedCard.symbol === '⌛') {
      setTimeLeft((prev) => prev + 5);
      // Keep it marked as matched so it stays face-up
      setCards((prev) =>
        prev.map((c) => (c.id === clickedCard.id ? { ...c, isMatched: true } : c))
      );
      return;
    }

    // --- CASE 3: PAIR SYMBOL MATCHING ---
    const newSelection = [...selectedCards, clickedCard];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setIsDisabled(true);
      const [first, second] = newSelection;

      if (first.symbol === second.symbol) {
        // Matched pair
        const matchedDeck = cards.map((c) =>
          c.symbol === first.symbol ? { ...c, isFlipped: true, isMatched: true } : c
        );
        setCards(matchedDeck);

        // Check if all pairs are found
        const matchedPairsCount = matchedDeck.filter(
          (c) => PAIR_SYMBOLS.includes(c.symbol) && c.isMatched
        ).length;

        if (matchedPairsCount === PAIR_SYMBOLS.length * 2) {
          setGameStatus("won");
        }

        resetTurn();
      } else {
        // No match: flip back
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
      <div className={`timer-badge ${timeLeft <= 5 ? "time-low" : ""}`}>
        ⏳ Time Left: <span>{timeLeft}s</span>
      </div>

      {/* Status messages */}
      {gameStatus === "lost-time" && <p className="status-msg error">⏰ Time's Up! Game Over</p>}
      {gameStatus === "lost-bomb" && <p className="status-msg error">💥 Boom! You flipped a bomb!</p>}
      {gameStatus === "won" && <p className="status-msg-success">🎉 You matched all pairs!</p>}

      {gameStatus !== "playing" && (
        <button className="restart-btn" onClick={restartGame}>Play Again</button>
      )}

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