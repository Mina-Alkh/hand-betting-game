import { createFreshDeck } from "./tiles";

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createShuffledDeck() {
  return shuffle(createFreshDeck());
}

export function drawHand(drawPile, handSize = 3) {
  const hand = drawPile.slice(0, handSize);
  const remainingDrawPile = drawPile.slice(handSize);
  return { hand, remainingDrawPile };
}

export function calculateHandValue(hand) {
  return hand.reduce((total, tile) => total + tile.value, 0);
}

export function resolveBet(currentValue, nextValue, bet) {
  let result;

  if (nextValue === currentValue) {
    result = "lose";
  } else if (bet === "higher") {
    result = nextValue > currentValue ? "win" : "lose";
  } else if (bet === "lower") {
    result = nextValue < currentValue ? "win" : "lose";
  }

  return { result, nextValue };
}