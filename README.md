# BlackJack Game

This project is built with **SvelteKit** and **Tailwind CSS**. It targets **Svelte 4**, so you shouldn't see peer dependency conflicts when installing. The entire game runs in the browser and the Node.js server is provided by SvelteKit.

The index page lets you choose the number of players and generates links for each player and the table view. Game state is kept in `localStorage`.

## Requirements

- Node.js (>= 18)

## Scripts

```bash
npm install       # install dependencies
npm run dev       # start SvelteKit in development mode
npm run build     # build the app for production
npm start         # run the built server
```

If installation still fails with peer dependency errors, you can run:
```bash
npm install --legacy-peer-deps
```

Open `http://localhost:3000` to start a new game.
