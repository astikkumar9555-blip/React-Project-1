

function CardCreation({cards,shuffleCards}){
    return(
        <div className="game">
            <div className="card-container">
                {cards.map((symbol,index)=>(
                    <div className="card" key={index} onClick={shuffleCards}>
                        {symbol}
         
                    </div>
                ))}

            </div>
            
        </div>
    );
}

export default CardCreation;