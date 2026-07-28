import { useEffect, useState } from "react";
import { getLeaderboard } from "../logic/leaderboard";

function Home({ onStartGame }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <div className="home">
      <h1>🀄 Hand Betting Game</h1>
      <button className="new-game-btn" onClick={onStartGame}>
        New Game
      </button>

      <div className="leaderboard">
        <h2>Top 5 Scores</h2>
        {leaderboard.length === 0 ? (
          <p>No scores yet. Be the first!</p>
        ) : (
          <ol>
            {leaderboard.slice(0, 5).map((entry, index) => (
              <li key={index}>{entry.name || "Player"} — {entry.score}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Home;