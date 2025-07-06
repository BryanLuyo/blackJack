const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

const app = createApp({
  data() {
    return { jugadores: 2, enlaces: [], mesa: '', tablero: null, mostrar: false };
  },
  methods: {
    mostrarFormulario() { this.mostrar = true; },
    iniciar() {
      ws.send(JSON.stringify({ type: 'start', players: this.jugadores }));
    }
  }
}).mount('#app');

ws.addEventListener('message', ev => {
  const msg = JSON.parse(ev.data);
  if (msg.type === 'boardCreated') {
    app.tablero = msg.id;
    app.enlaces = Array.from({ length: app.jugadores }, (_, i) => `player.html?board=${msg.id}&id=${i}`);
    app.mesa = `table.html?board=${msg.id}`;
  }
});
