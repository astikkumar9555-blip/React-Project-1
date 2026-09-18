 import {useState,useEffect} from "react";

 import './Card.css';
   
 const PAIR_SYMBOLS = ['🍎','🍇','🍉','🍐','🥭'];
 const DIFF_SYMBOLS=['⌛','💣'];

 const createDeck=()=>{
  const deck=[
    ...PAIR_SYMBOLS,
    ...PAIR_SYMBOLS,
    ...DIFF_SYMBOLS
  ];

  return deck.sort(()=>Math.random() - 0.5)
  .map((symbol ,index) =>({
    id:index,
    symbol:symbol,
    isFlipped:false,
    isMatched:false
  }));
 };

 function MemoryGame(){
 const [cards,setCards]=useState("");
 const [selectedCards,setSelectedCards]=useState("");
 const [isDisabled,setIsDisabled]=useState(false);
 
 use

 }

 export default MemoryGame;
function App() {
   

  return (
    <> 
     <div class="main">
        <div class="container">
            <h1>Memory Blast Game</h1>
        </div>
        
    </div>
      
 
    </>
  )
}

export default App
