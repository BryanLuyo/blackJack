# Blackjack Game (Vue.js)

This project implements a simple multiplayer Blackjack game using **Vue 3** in the browser and a small Node.js server. No build step is required; all pages are served from the `public` directory.

Open `index.html` to choose the number of players. The app stores the game state in `localStorage` and generates links for each player (e.g. `player.html?id=0`) as well as a table view (`table.html`) that shows every hand.

## Requirements

- Node.js (>= 18)

## Scripts

```bash
npm install   # nothing to install but keeps workflow consistent
npm run build # no-op build step
npm start     # start the static file server
```

Once the server is running, navigate to `http://localhost:3000` to begin.
