# Juego de Blackjack (Vue.js)

Este proyecto implementa un sencillo juego de Blackjack multijugador usando **Vue 3** en el navegador y un pequeño servidor Node.js con soporte **WebSocket**. Todos los archivos del cliente están en el directorio `public`; no se requiere un paso de compilación.
Las vistas de jugador y mesa utilizan **Tailwind CSS** para dar un aspecto más elegante a las cartas y la mesa. En la mesa hay un botón **Barajear** que mezcla la baraja con una breve animación y otro **Finalizar juego** que calcula el ganador y muestra confeti en pantalla.

Cada partida se organiza en un **tablero** propio. Desde la página inicial puedes crear tantos tableros como necesites. Presiona **Agregar mesa** para mostrar el formulario, indica el número de jugadores y pulsa **Iniciar**; aparecerán entonces los enlaces de los jugadores y de la mesa con su identificador. Así, cada tablero mantiene su propia baraja y estado independiente.

Abre `index.html` para elegir el número de jugadores (hasta 8). El servidor prepara y baraja una baraja de **54 cartas** (52 normales más dos comodines). Cada jugador abre su enlace (`player.html?board=ID&id=N`), ingresa su nombre y espera a que el crupier inicie la partida desde la mesa (`table.html?board=ID`). Una vez que la mesa pulsa **Comenzar juego**, los jugadores podrán pedir carta o plantarse. Si un jugador alcanza o supera **21 puntos** quedará plantado de forma automática. La página de la mesa muestra en todo momento la mano de cada jugador, las cartas restantes y permite iniciar la partida.

## Requisitos

- Node.js (>= 18)

## Comandos

```bash
npm install   # instalar dependencias (solo "ws" para WebSocket)
npm run build # paso de compilación vacío
npm start     # iniciar el servidor Node.js
```

Con el servidor en marcha, abre `http://localhost:3000` en tu navegador.
Si accedes mediante HTTPS (por ejemplo usando un túnel), el cliente se conectará
automáticamente por **WSS** al mismo host.

## Despliegue en Railway

Este proyecto puede desplegarse fácilmente en [Railway](https://railway.app).
El repositorio incluye un archivo `railway.json` que indica el comando de inicio
(`node server.js`). Al crear un nuevo proyecto en Railway y vincular este
repositorio, la plataforma instalará las dependencias y ejecutará
automáticamente `npm start`.

No se requiere paso de compilación, por lo que la configuración por defecto de
Railway es suficiente. Asegúrate de que la variable de entorno `PORT` esté
disponible (Railway la define de manera automática) y el servidor escuchará en
ese puerto.
