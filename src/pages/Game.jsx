import { useState } from "react";
import { createShuffledDeck, drawHand, calculateHandValue, resolveBet, reshuffleDeck } from "../logic/gameLogic";
import { scaleHandTiles } from "../logic/tiles";
import { saveScore } from "../logic/leaderboard";

function Game({ onExit }) {
  const [drawPile, setDrawPile] = useState(() => createShuffledDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [reshuffleCount, setReshuffleCount] = useState(0);
  const [currentHand, setCurrentHand] = useState(() => {
    const { hand } = drawHand(createShuffledDeck(), 3);
    return hand;
  });
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Place your bet!");
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  const currentValue = calculateHandValue(currentHand);

  const endGame = (reason) => {
    setIsGameOver(true);
    setGameOverReason(reason);
  };

  const handleBet = (bet) => {
    if (isGameOver) return; 

    let pileToUse = drawPile;
    let updatedDiscard = discardPile;
    let updatedReshuffleCount = reshuffleCount;

    if (pileToUse.length < 3) {
      updatedReshuffleCount += 1;

      if (updatedReshuffleCount >= 3) {
        setReshuffleCount(updatedReshuffleCount);
        endGame("Draw pile reshuffled 3 times.");
        return;
      }

      pileToUse = reshuffleDeck(updatedDiscard);
      updatedDiscard = [];
    }

    const { hand: nextHand, remainingDrawPile } = drawHand(pileToUse, 3);
    const nextValue = calculateHandValue(nextHand);
    const { result } = resolveBet(currentValue, nextValue, bet);
    const updatedNextHand = scaleHandTiles(nextHand, result);

    const hitLimit = updatedNextHand.some((tile) => tile.value <= 0 || tile.value >= 10);

    setDiscardPile([...updatedDiscard, ...currentHand]);
    setDrawPile(remainingDrawPile);
    setReshuffleCount(updatedReshuffleCount);
    setCurrentHand(updatedNextHand);
    setScore((prev) => prev + (result === "win" ? 10 : -5));
    setMessage(result === "win" ? "You won that round!" : "You lost that round!");

    if (hitLimit) {
      const badTile = updatedNextHand.find((tile) => tile.value <= 0 || tile.value >= 10);
      endGame(`A tile ("${badTile.name}") reached value ${badTile.value}!`);
    }
  };

if (isGameOver) {
    const handleSaveScore = () => {
      saveScore(playerName, score);
      setScoreSaved(true);
    };

    return (
      <div className="game-over">
        <h1>Game Over</h1>
        <p>{gameOverReason}</p>
        <h2>Final Score: {score}</h2>

        {!scoreSaved ? (
          <div className="save-score">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleSaveScore}>Save Score</button>
          </div>
        ) : (
          <p>✅ Score saved to leaderboard!</p>
        )}

        <button className="exit-btn" onClick={onExit}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="game">
      <button className="exit-btn" onClick={onExit}>Exit to Home</button>

      <h2>Score: {score}</h2>
      <p>{message}</p>

      <div className="pile-info">
        <span>Draw Pile: {drawPile.length}</span>
        <span>Discard Pile: {discardPile.length}</span>
        <span>Reshuffles: {reshuffleCount} / 3</span>
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