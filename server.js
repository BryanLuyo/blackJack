import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.join(__dirname, 'public');

// game state
let game = { deck: [], players: [] };
const clients = new Set();

function handValue(hand) {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 'A') {
      value += 11; aces++;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank, 10);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10; aces--;
  }
  return value;
}

function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const deck = [];
  for (const s of suits) {
    for (const r of ranks) deck.push({ suit: s, rank: r });
  }
  // add two jokers so the deck has 54 cards
  deck.push({ suit: 'Joker', rank: 'Joker' });
  deck.push({ suit: 'Joker', rank: 'Joker' });
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function initGame(count) {
  game.deck = createDeck();
  shuffle(game.deck);
  game.players = Array.from({ length: count }, () => ({ name: '', hand: [], standing: false }));
}

function drawCard() {
  return game.deck.pop();
}

function broadcast() {
  const data = JSON.stringify({ type: 'state', game });
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) ws.send(data);
  }
}

const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const fileName = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const filePath = path.join(base, fileName.split('?')[0]);
  if (!filePath.startsWith(base)) {
    res.writeHead(400);
    return res.end('Bad request');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).slice(1);
    const type = {
      html: 'text/html',
      js: 'text/javascript',
      css: 'text/css',
      json: 'application/json'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'state', game }));
  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    handleMessage(msg);
  });
  ws.on('close', () => clients.delete(ws));
});

function handleMessage(msg) {
  switch (msg.type) {
    case 'start': {
      const count = Math.max(1, Math.min(8, parseInt(msg.players, 10) || 1));
      initGame(count);
      break;
    }
    case 'setName': {
      const p = game.players[msg.id];
      if (p) p.name = msg.name || '';
      break;
    }
    case 'hit': {
      const p = game.players[msg.id];
      if (p && !p.standing) {
        const card = drawCard();
        if (card) p.hand.push(card);
        if (handValue(p.hand) >= 21) p.standing = true;
      }
      break;
    }
    case 'stand': {
      const p = game.players[msg.id];
      if (p) p.standing = true;
      break;
    }
    default:
      return;
  }
  broadcast();
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
