const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { jugadores: 2, enlaces: [] };
  },
  methods: {
    iniciar() {
      ws.send(JSON.stringify({ type: 'start', players: this.jugadores }));
      this.enlaces = Array.from({ length: this.jugadores }, (_, i) => `player.html?id=${i}`);
    }
  }
}).mount('#app');
