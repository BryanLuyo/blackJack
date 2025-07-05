# BlackJack Game

This is a small multi-player BlackJack game built with **Node.js** and plain HTML. Styles are provided by **Tailwind CSS**. The server simply hosts static files and all game state lives in the browser using `localStorage`.

When opening the game you set the number of players. The page then shows a link for each player page where they can draw cards, and a table page that displays every player's hand.

## Requirements

- Node.js (>= 18)

## Building

Compile the client assets:

```bash
npm run build
```

This copies the JavaScript files into `public/` and generates `app.css` using Tailwind.

## Running

Start the server:

```bash
npm start
```

Navigate to `http://localhost:3000` to configure and start a game. You will see links to each player page (`player.html?id=0`, etc.) and a link to `table.html` to view the table.

## Development

For a quicker workflow you can run:

```bash
npm run dev
```

which starts the Node.js server without rebuilding.
