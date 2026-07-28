import { useState } from "react";
import { createShuffledDeck, drawHand, calculateHandValue, resolveBet } from "../logic/gameLogic";
import { scaleHandTiles } from "../logic/tiles";

function Game({ onExit }) {
  const [drawPile, setDrawPile] = useState(() => createShuffledDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [currentHand, setCurrentHand] = useState(() => {
    const { hand } = drawHand(createShuffledDeck(), 3);
    return hand;
  });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Place your bet!");

  const currentValue = calculateHandValue(currentHand);

  const handleBet = (bet) => {
    const { hand: nextHand, remainingDrawPile } = drawHand(drawPile, 3);

    if (nextHand.length < 3) {
      setMessage("Not enough tiles! (We'll fix this with reshuffle logic next)");
      return;
    }

    const nextValue = calculateHandValue(nextHand);
    const { result } = resolveBet(currentValue, nextValue, bet);

    const updatedNextHand = scaleHandTiles(nextHand, result);

    setDiscardPile((prev) => [...prev, ...currentHand]);

    setDrawPile(remainingDrawPile);
    setCurrentHand(updatedNextHand);
    setScore((prev) => prev + (result === "win" ? 10 : -5));
    setMessage(result === "win" ? "You won that round!" : "You lost that round!");
  };

  return (
    <div className="game">
      <button className="exit-btn" onClick={onExit}>Exit to Home</button>

      <h2>Score: {score}</h2>
      <p>{message}</p>

      <div className="pile-info">
        <span>Draw Pile: {drawPile.length}</span>
        <span>Discard Pile: {discardPile.length}</span>
      </div>

      <div className="hand">
        <h3>Current Hand (Value: {currentValue})</h3>
        <div className="tiles">
          {currentHand.map((tile) => (
            <div key={tile.id} className="tile">
              {tile.name} <br /> ({tile.value})
            </div>
          ))}
        </div>
      </div>

      <div className="bet-buttons">
        <button onClick={() => handleBet("higher")}>Bet Higher</button>
        <button onClick={() => handleBet("lower")}>Bet Lower</button>
      </div>
    </div>
  );
}

export default Game;