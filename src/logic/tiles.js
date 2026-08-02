const CDN_BASE = "https://cdn.jsdelivr.net/gh/FluffyStuff/riichi-mahjong-tiles/Regular";

const suitFilePrefix = {
  Characters: "Man",
  Bamboo: "Sou",
  Dots: "Pin",
};

const honorFileNames = {
  "East Wind": "Ton",
  "South Wind": "Nan",
  "West Wind": "Shaa",
  "North Wind": "Pei",
  "Red Dragon": "Chun",
  "Green Dragon": "Hatsu",
  "White Dragon": "Haku",
};

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
        image: `${CDN_BASE}/${suitFilePrefix[suit]}${value}.svg`,
      });
    }
  });
  return tiles;
}

function generateHonorTiles() {
  const dragons = ["Red Dragon", "Green Dragon", "White Dragon"];
  const winds = ["East Wind", "South Wind", "West Wind", "North Wind"];

  return [...dragons, ...winds].map((name) => ({
    id: name.replace(/\s+/g, "-"),
    type: "honor",
    name,
    value: 5,
    image: `${CDN_BASE}/${honorFileNames[name]}.svg`,
  }));
}

export function createBaseTileSet() {
  return [...generateNumberTiles(), ...generateHonorTiles()];
}

let instanceCounter = 0;

export function createFreshDeck() {
  return createBaseTileSet().map((tile) => ({
    ...tile,
    uid: `${tile.id}-${Date.now()}-${instanceCounter++}`,
  }));
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