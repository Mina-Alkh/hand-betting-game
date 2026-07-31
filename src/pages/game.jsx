import { useState } from "react";
import { createShuffledDeck, drawHand, calculateHandValue, resolveBet, reshuffleDeck } from "../logic/gameLogic";
import { scaleHandTiles } from "../logic/tiles";
import { saveScore, getLeaderboard } from "../logic/leaderboard";

function game({ onExit }) {
  const [drawPile, setDrawPile] = useState(() => createShuffledDeck());
  const [discardPile, setDiscardPile] = useState([]);
  const [reshuffleCount, setReshuffleCount] = useState(0);
  const [currentHand, setCurrentHand] = useState(() => {
    const { hand } = drawHand(createShuffledDeck(), 3);
    return hand;
  });
  const [previousHand, setPreviousHand] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Place your bet!");
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  const [history, setHistory] = useState([]);
  const [roundLog, setRoundLog] = useState([]);

  const currentValue = calculateHandValue(currentHand);
  const bestScore = Math.max(score, ...getLeaderboard().map((e) => e.score), 0);

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
    const pointsChange = result === "win" ? 10 : -5;

    const roundEntry = { hand: currentHand, value: currentValue, bet, result, pointsChange };

    setPreviousHand(currentHand);
    setDiscardPile([...updatedDiscard, ...currentHand]);
    setDrawPile(remainingDrawPile);
    setReshuffleCount(updatedReshuffleCount);
    setCurrentHand(updatedNextHand);
    setScore((prev) => prev + pointsChange);
    setMessage(result === "win" ? "You won that round!" : "You lost that round!");
    setHistory((prev) => [roundEntry, ...prev].slice(0, 8));
    setRoundLog((prev) => [...prev, roundEntry]);

    if (hitLimit) {
      const badTile = updatedNextHand.find((tile) => tile.value <= 0 || tile.value >= 10);
      endGame(`A tile ("${badTile.name}") reached value ${badTile.value}!`);
    }
  };

  const handlePlayAgain = () => onExit();

  if (isGameOver) {
    const handleSaveScore = () => {
      saveScore(playerName, score);
      setScoreSaved(true);
    };

    return (
      <div className="game-over">
        <h1>GAME OVER</h1>
        <p className="game-over-subtitle">Better luck next round, challenger.</p>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">FINAL SCORE</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="stat divider">
            <span className="stat-label">BEST</span>
            <span className="stat-value accent">{bestScore.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">ROUNDS</span>
            <span className="stat-value">{roundLog.length}</span>
          </div>
        </div>

        {!scoreSaved ? (
          <div className="save-score">
            <div className="name-input-wrapper">
              <input
                type="text"
                placeholder="Enter your name..."
                value={playerName}
                maxLength={15}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <span className="char-counter">{playerName.length}/15</span>
            </div>
            <button onClick={handleSaveScore}>Save Score</button>
          </div>
        ) : (
          <p className="saved-text">Score saved to leaderboard!</p>
        )}

        <div className="game-over-buttons">
          <button className="play-again-btn" onClick={handlePlayAgain}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-topbar">
        <button className="exit-btn" onClick={onExit}>Exit</button>
        <div className="topbar-stats">
          <div className="topbar-stat">
            <span className="topbar-stat-label">ROUND</span>
            <span className="topbar-stat-value">{roundLog.length + 1}</span>
          </div>
          <div className="topbar-stat">
            <span className="topbar-stat-label">SCORE</span>
            <span className="topbar-stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="topbar-stat">
            <span className="topbar-stat-label">BEST</span>
            <span className="topbar-stat-value">{bestScore.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="game-layout">
        <div className="history-sidebar">
          <h3>Round History</h3>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="empty-text">No rounds played yet.</p>
            ) : (
              history.map((entry, index) => (
                <div key={index} className={`history-entry ${entry.result}`}>
                  <div className="history-tiles">
                    {entry.hand.map((tile) => (
                      <img key={tile.id} src={tile.image} alt={tile.name} className="mini-tile-image" />
                    ))}
                  </div>
                  <span className="history-points">
                    {entry.pointsChange > 0 ? "+" : ""}
                    {entry.pointsChange}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="game-main">
          <div className="status-banner">
            <p className="status-message">{message}</p>
            <p className="status-subtext">
              Draw Pile: {drawPile.length} · Discard Pile: {discardPile.length} · Reshuffles: {reshuffleCount}/3
            </p>
          </div>

          {previousHand && (
            <div className="hand-panel discarded-panel">
              <div className="hand-panel-header">
                <span>Discarded Hand</span>
                <span>{previousHand ? previousHand.length : 0} tiles</span>
              </div>
              <div className="tiles">
                {previousHand ? (
                  previousHand.map((tile) => (
                    <div key={tile.id} className="tile discarded">
                      <img src={tile.image} alt={tile.name} className="tile-image" />
                      <span className="tile-name">{tile.name}</span>
                      <span className="tile-value">{tile.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No discarded hand yet.</p>
                )}
              </div>
            </div>
          )}

          <div className="hand-panel new-panel">
            <div className="hand-panel-header">
              <span>New Hand</span>
              <span>{currentHand.length} tiles</span>
            </div>
            <div className="tiles">
              {currentHand.map((tile) => (
                <div key={tile.id} className={`tile new ${tile.type}`}>
                  <img src={tile.image} alt={tile.name} className="tile-image" />
                  <span className="tile-name">{tile.name}</span>
                  <span className="tile-value">{tile.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bet-buttons">
            <button className="bet-high" onClick={() => handleBet("higher")}>Bet High</button>
            <button className="bet-low" onClick={() => handleBet("lower")}>Bet Low</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default game;