const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { players: 2, links: [] };
  },
  methods: {
    start() {
      ws.send(JSON.stringify({ type: 'start', players: this.players }));
      this.links = Array.from({ length: this.players }, (_, i) => `player.html?id=${i}`);
    }
  }
}).mount('#app');
