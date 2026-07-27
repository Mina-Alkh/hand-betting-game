import { useState } from "react";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");

  const handleStartGame = () => {
    setScreen("game"); // we'll build the Game page in the next steps
  };

  return (
    <div className="app">
      {screen === "home" && <Home onStartGame={handleStartGame} />}
      {screen === "game" && <h2>Game screen coming soon...</h2>}
    </div>
  );
}

export default App;