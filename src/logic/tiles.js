const suits = ["Dots", "Bamboo", "Characters"];

function generateNumberTiles() {
  const tiles = [];
  suits.forEach((suit) => {
    for (let value = 1; value <= 9; value++) {
      tiles.push({
        id: `${suit}-${value}`,
        type: "number",
        name: `${value} ${suit}`,
        value: value, 
      });
    }
  });
  return tiles;
}

function generateHonorTiles() {
  const dragons = ["Red Dragon", "Green Dragon", "White Dragon"];
  const winds = ["East Wind", "South Wind", "West Wind", "North Wind"];

  const honorTiles = [...dragons, ...winds].map((name) => ({
    id: name.replace(/\s+/g, "-"),
    type: "honor",
    name,
    value: 5, 
  }));

  return honorTiles;
}

export function createBaseTileSet() {
  return [...generateNumberTiles(), ...generateHonorTiles()];
}

export function createFreshDeck() {
  return createBaseTileSet().map((tile) => ({ ...tile })); 
}

export function scaleHandTiles(hand, result) {
  return hand.map((tile) => {
    if (tile.type === "honor") {
      const change = result === "win" ? 1 : -1;
      return { ...tile, value: tile.value + change };
    }
    return tile;
  });
}