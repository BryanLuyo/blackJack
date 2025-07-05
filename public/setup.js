const { createApp } = Vue;
createApp({
  data() {
    return { players: 2, links: [] };
  },
  methods: {
    start() {
      const game = Game.initGame(this.players);
      Game.save(game);
      this.links = Array.from({ length: this.players }, (_, i) => `player.html?id=${i}`);
    }
  }
}).mount('#app');
