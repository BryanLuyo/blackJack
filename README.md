# Juego de Blackjack (Vue.js)

Este proyecto implementa un sencillo juego de Blackjack multijugador usando **Vue 3** en el navegador y un pequeño servidor Node.js con soporte **WebSocket**. Todos los archivos del cliente están en el directorio `public`; no se requiere un paso de compilación.

Abre `index.html` para elegir el número de jugadores (hasta 8). Cuando inicia la partida el servidor crea una baraja de **54 cartas** (52 normales más dos comodines) y envía el estado a los clientes conectados. Cada jugador abre su enlace (por ejemplo `player.html?id=0`), ingresa su nombre y puede pedir carta o plantarse. Si un jugador alcanza o supera **21 puntos** quedará plantado de forma automática. La página de la mesa (`table.html`) muestra la mano de cada jugador, las cartas restantes y se actualiza en tiempo real mediante WebSocket.

## Requisitos

- Node.js (>= 18)

## Comandos

```bash
npm install   # instalar dependencias (solo "ws" para WebSocket)
npm run build # paso de compilación vacío
npm start     # iniciar el servidor Node.js
```

Con el servidor en marcha, abre `http://localhost:3000` en tu navegador.
