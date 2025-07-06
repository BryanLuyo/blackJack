import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rutaPublica = path.join(__dirname, 'public');

// coleccion de tableros (mesas)
let tableros = [];
const clientes = new Set();

function valorMano(mano) {
  let valor = 0;
  let ases = 0;
  for (const carta of mano) {
    if (carta.rank === 'A') {
      valor += 11; ases++;
    } else if (['K', 'Q', 'J'].includes(carta.rank)) {
      valor += 10;
    } else {
      valor += parseInt(carta.rank, 10);
    }
  }
  while (valor > 21 && ases > 0) {
    valor -= 10; ases--;
  }
  return valor;
}

function crearBaraja() {
  const palos = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const rangos = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const baraja = [];
  for (const p of palos) {
    for (const r of rangos) baraja.push({ suit: p, rank: r });
  }
  // añadir dos comodines para tener 54 cartas
  baraja.push({ suit: 'Joker', rank: 'Joker' });
  baraja.push({ suit: 'Joker', rank: 'Joker' });
  return baraja;
}

function barajar(baraja) {
  for (let i = baraja.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
  }
}

function crearTablero(cantidad) {
  const tablero = {
    baraja: crearBaraja(),
    jugadores: Array.from({ length: cantidad }, () => ({ nombre: '', mano: [], plantado: false })),
    iniciado: false
  };
  barajar(tablero.baraja);
  return tablero;
}

function tomarCarta(tablero) {
  return tablero.baraja.pop();
}

function difundir() {
  const datos = JSON.stringify({ type: 'state', boards: tableros });
  for (const ws of clientes) {
    if (ws.readyState === ws.OPEN) ws.send(datos);
  }
}

const servidor = http.createServer((req, res) => {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const fileName = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const filePath = path.join(rutaPublica, fileName.split('?')[0]);
  if (!filePath.startsWith(rutaPublica)) {
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

const servidorWebSocket = new WebSocketServer({ server: servidor });

servidorWebSocket.on('connection', (ws) => {
  clientes.add(ws);
  ws.send(JSON.stringify({ type: 'state', boards: tableros }));
  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    procesarMensaje(ws, msg);
  });
  ws.on('close', () => clientes.delete(ws));
});

function procesarMensaje(ws, msg) {
  switch (msg.type) {
    case 'start': {
      const cantidad = Math.max(1, Math.min(8, parseInt(msg.players, 10) || 1));
      const id = tableros.length;
      tableros[id] = crearTablero(cantidad);
      ws.send(JSON.stringify({ type: 'boardCreated', id }));
      break;
    }
    case 'begin': {
      const t = tableros[msg.board];
      if (t) t.iniciado = true;
      break;
    }
    case 'setName': {
      const t = tableros[msg.board];
      if (t) {
        const jugador = t.jugadores[msg.id];
        if (jugador) jugador.nombre = msg.name || '';
      }
      break;
    }
    case 'hit': {
      const t = tableros[msg.board];
      if (t && t.iniciado) {
        const jugador = t.jugadores[msg.id];
        if (jugador && !jugador.plantado) {
          const carta = tomarCarta(t);
          if (carta) jugador.mano.push(carta);
          if (valorMano(jugador.mano) >= 21) jugador.plantado = true;
        }
      }
      break;
    }
    case 'stand': {
      const t = tableros[msg.board];
      if (t && t.iniciado) {
        const jugador = t.jugadores[msg.id];
        if (jugador) jugador.plantado = true;
      }
      break;
    }
    case 'shuffle': {
      const t = tableros[msg.board];
      if (t && t.baraja.length) barajar(t.baraja);
      break;
    }
    default:
      return;
  }
  difundir();
}

const PUERTO = process.env.PORT || 8080;
servidor.listen(PUERTO, () => {
  console.log(`Server running at http://localhost:${PUERTO}`);
});
