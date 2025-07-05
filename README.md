# Blackjack Game (Vue.js)

This project implements a simple multiplayer Blackjack game using **Vue 3** in the browser and a small Node.js backend with **WebSocket** support. All client files live in the `public` directory; no build step is required.

Open `index.html` to choose the number of players (up to 8). When the game starts the server creates a deck and broadcasts the state to all connected clients. Each player opens their link (e.g. `player.html?id=0`), enters a name and can hit or stand. The table page (`table.html`) shows every player's hand and updates in real time via WebSocket messages.

## Requirements

- Node.js (>= 18)

## Scripts

```bash
npm install   # install dependencies (only "ws" for WebSocket)
npm run build # no-op build step
npm start     # start the Node.js server
```

Once the server is running, navigate to `http://localhost:3000` to begin.
