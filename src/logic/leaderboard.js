const STORAGE_KEY = "leaderboard";

export function getLeaderboard() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return saved;
}

export function saveScore(name, score) {
  const current = getLeaderboard();
  const updated = [...current, { name: name || "Player", score }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}