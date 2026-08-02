# Hand Betting Game

A web-based "Higher or Lower" betting game using Mahjong tiles, built with React + Vite.

## Overview
Players draw a hand of 3 Mahjong tiles and bet whether the next hand's total value will be **higher** or **lower**. Honor tiles (Dragons/Winds) dynamically gain or lose value based on round outcomes. The game ends when a tile's value hits 0 or 10, or after the draw pile is reshuffled 3 times.

## Features
- Landing page with a live Top 5 leaderboard (saved in localStorage)
- Real Mahjong tile artwork (Man/Pin/Sou suits, Winds, Dragons)
- Dynamic tile value scaling (honor tiles ±1 per win/lose)
- Draw pile / discard pile tracking with automatic reshuffle
- Game over detection (tile value limit or 3rd reshuffle)
- Round history sidebar + full game-over stats
- Fully responsive layout (desktop, tablet, mobile)
- Polished dark UI theme with smooth transitions

## Tech Stack
- React (Vite)
- Plain CSS (custom properties / CSS variables for theming)
- Browser localStorage for leaderboard persistence
- Tile artwork sourced from the open-source [riichi-mahjong-tiles](https://github.com/FluffyStuff/riichi-mahjong-tiles) project

## Project Structure

src/
├── components/ # (reserved for future reusable UI components)
├── logic/
│ ├── tiles.js # Tile data, generation, and value scaling
│ ├── gameLogic.js # Deck shuffling, drawing hands, bet resolution
│ └── leaderboard.js # localStorage leaderboard read/write
├── pages/
│ ├── homepage.jsx # Landing page + leaderboard
│ └── game.jsx # Main game screen + game over screen
├── App.jsx
└── App.css

## Setup Instructions
1. Clone the repository:
```bash
   git clone https://github.com/Mina-Alkh/hand-betting-game.git
   cd hand-betting-game
```
2. Install dependencies:
```bash
   npm install
```
3. Run the development server:
```bash
   npm run dev
```
4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## What Was Handwritten vs AI-Assisted
This project was built with AI assistance (Claude) as a coding pair-partner, step by step:
- I directed the overall architecture, feature order, and design direction (including providing UI mockups for the visual redesign).
- AI generated the initial code for each feature based on my instructions, which I then reviewed, tested in the browser, and iterated on.
- I personally debugged and fixed issues that came up during testing (e.g. a missing `return` statement that caused a blank screen, a reshuffle-counter bug, and a layout-shift bug caused by image loading).
- All game logic, UI structure, and styling decisions were reviewed and approved by me before being committed.

## Future Extension Ideas
The codebase is organized to make onsite feature additions straightforward:
- `logic/` is fully decoupled from UI — new game rules or tile types can be added without touching React components.
- `game.jsx` manages state cleanly via individual `useState` hooks, making it easy to add new state (e.g. streak bonuses, difficulty modes) without restructuring existing logic.