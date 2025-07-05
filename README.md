# BlackJack Game

This project implements a small multi‑player BlackJack game using **Node.js**, **Svelte** and **Tailwind CSS**. The server only serves static files and game state is kept in the browser using `localStorage`.

On opening the game you choose how many players will participate. The page then provides a link for each player to manage their hand and another link to view the table with every player's cards.

## Requirements

- Node.js (>= 18)

## Building

Build the project (server and client):

```bash
npm run build
```

This compiles the Svelte client into `public/`.

## Running

Start the server:

```bash
npm start
```

Navigate to `http://localhost:3000` and follow the instructions to start a game. After starting you will see links for each player (`player.html?id=0`, etc.) and another link to `table.html` to view the table.

## Development

For a quicker workflow you can run:

```bash
npm run dev
```

which simply runs the Node.js server without rebuilding.
