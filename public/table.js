const { createApp } = Vue;
createApp({
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-4">Table</h1>
      <div v-for="(player, i) in game.players" :key="i" class="mb-4 border p-2">
        <h2 class="font-semibold">Player {{ i + 1 }}</h2>
        <div>Hand:
          <span v-for="(c,j) in player.hand" :key="j" class="mr-2">{{ c.rank }} {{ c.suit }}</span>
        </div>
        <div>Value: {{ Game.handValue(player.hand) }}</div>
        <div v-if="player.standing">Standing</div>
      </div>
      <a href="index.html" class="text-blue-600">Reset Game</a>
    </div>
  `,
  data() {
    return { game: Game.load() || { players: [] } };
  },
  methods: {
    refresh() {
      const data = Game.load();
      if (data) this.game = data;
    }
  },
  mounted() {
    this.timer = setInterval(this.refresh, 1000);
  },
  unmounted() {
    clearInterval(this.timer);
  }
}).mount('#app');
