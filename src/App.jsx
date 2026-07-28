import { useState } from "react";
import Home from "./pages/Home";
import "./App.css";
// import { createFreshDeck } from "./logic/tiles";
// console.log(createFreshDeck());

// import { createShuffledDeck, drawHand, calculateHandValue } from "./logic/gameLogic";

// const deck = createShuffledDeck();
// const { hand, remainingDrawPile } = drawHand(deck, 3);
// console.log("Hand:", hand);
// console.log("Hand value:", calculateHandValue(hand));
// console.log("Remaining draw pile size:", remainingDrawPile.length);

import { createShuffledDeck, drawHand, calculateHandValue, resolveBet } from "./logic/gameLogic";
import { scaleHandTiles } from "./logic/tiles";

let deck = createShuffledDeck();

let { hand: hand1, remainingDrawPile: pile1 } = drawHand(deck, 3);
const value1 = calculateHandValue(hand1);
console.log("Hand 1:", hand1, "Value:", value1);

const bet = "higher";

let { hand: hand2, remainingDrawPile: pile2 } = drawHand(pile1, 3);
const value2 = calculateHandValue(hand2);
console.log("Hand 2:", hand2, "Value:", value2);

const { result } = resolveBet(value1, value2, bet);
console.log("Bet was:", bet, "| Result:", result);

const updatedHand2 = scaleHandTiles(hand2, result);
console.log("Updated Hand 2 (after scaling):", updatedHand2);

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