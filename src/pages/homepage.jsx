import { useEffect, useState } from "react";
import { getLeaderboard } from "../logic/leaderboard";

function homepage({ onStartGame }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <div className="home">
      <div className="home-badge">— TILE STRATEGY GAME —</div>
      <h1 className="home-title">
        MAH<span className="accent-text">JONG</span> <span className="sigma-text">SIGMA</span>
      </h1>
      <p className="home-tagline">Outsmart the tiles. Dominate the board.</p>

      <button className="new-game-btn" onClick={onStartGame}>
        Start Game
      </button>

      <div className="leaderboard">
        <div className="leaderboard-header">
          <span>LEADERBOARD</span>
          <span className="trophy-icon">🏆</span>
        </div>
        {leaderboard.length === 0 ? (
          <p className="empty-text">No scores yet. Be the first!</p>
        ) : (
          <ol className="leaderboard-list">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <li key={index}>
                <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                <span className="player-name">{entry.name || "Player"}</span>
                <span className="player-score">{entry.score.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default homepage;