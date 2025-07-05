# Juego de Blackjack (Vue.js)

Este proyecto implementa un sencillo juego de Blackjack multijugador usando **Vue 3** en el navegador y un pequeño servidor Node.js con soporte **WebSocket**. Todos los archivos del cliente están en el directorio `public`; no se requiere un paso de compilación.
Las vistas de jugador y mesa utilizan **Tailwind CSS** para dar un aspecto más elegante a las cartas y la mesa. En la mesa hay un botón **Barajear** que mezcla la baraja y otro **Finalizar juego** que calcula el ganador y muestra confeti en pantalla.

Abre `index.html` para elegir el número de jugadores (hasta 8). El servidor prepara y baraja una baraja de **54 cartas** (52 normales más dos comodines). Cada jugador abre su enlace (`player.html?id=N`), ingresa su nombre y espera a que el crupier inicie la partida desde la mesa. Una vez que la mesa pulsa **Comenzar juego**, los jugadores podrán pedir carta o plantarse. Si un jugador alcanza o supera **21 puntos** quedará plantado de forma automática. La página de la mesa (`table.html`) muestra en todo momento la mano de cada jugador, las cartas restantes y permite iniciar la partida.

## Requisitos

- Node.js (>= 18)

## Comandos

```bash
npm install   # instalar dependencias (solo "ws" para WebSocket)
npm run build # paso de compilación vacío
npm start     # iniciar el servidor Node.js
```

Con el servidor en marcha, abre `http://localhost:3000` en tu navegador.
