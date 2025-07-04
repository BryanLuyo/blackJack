# BlackJack Game

This project implements a simple BlackJack game using **Node.js**, **Svelte**, and **Tailwind CSS**. The server serves a small web interface where you can play against a basic dealer AI.

## Requirements

- Node.js (>= 18)
- TypeScript (`tsc` command available)

## Building

Build the project (server and client):

```bash
npm run build
```

This generates the server code in `dist/` and compiles the Svelte client into `public/`.

## Running

Start the server:

```bash
npm start
```

Then open `http://localhost:3000` in your browser to play.

## Development

For a quicker workflow you can run:

```bash
npm run dev
```

which starts the server directly from the TypeScript sources using `ts-node` (if installed).
