import { useState } from "react";
import Home from "./pages/Home";
import Game from "./pages/Game";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");

  const handleStartGame = () => setScreen("game");
  const handleExitGame = () => setScreen("home");

  return (
    <div className="app">
      {screen === "home" && <Home onStartGame={handleStartGame} />}
      {screen === "game" && <Game onExit={handleExitGame} />}
    </div>
  );
}

export default App;