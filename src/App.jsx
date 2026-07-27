import { useState } from "react";
import Home from "./pages/Home";
import "./App.css";
import { createFreshDeck } from "./logic/tiles";
console.log(createFreshDeck());

function App() {
  const [screen, setScreen] = useState("home");

  const handleStartGame = () => {
    setScreen("game"); 
  };

  return (
    <div className="app">
      {screen === "home" && <Home onStartGame={handleStartGame} />}
      {screen === "game" && <h2>Game screen coming soon...</h2>}
    </div>
  );
}

export default App;