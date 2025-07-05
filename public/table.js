const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { game: { players: [] } };
  },
  mounted() {
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') this.game = msg.game;
    });
  },
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-4">Table</h1>
      <div v-for="(player, i) in game.players" :key="i" class="mb-4 border p-2">
        <h2 class="font-semibold">{{ player.name || 'Player ' + (i + 1) }}</h2>
        <div>Hand:
          <span v-for="(c,j) in player.hand" :key="j" class="mr-2">{{ c.rank }} {{ c.suit }}</span>
        </div>
        <div>Value: {{ Game.handValue(player.hand) }}</div>
        <div v-if="player.standing">Standing</div>
      </div>
      <a href="index.html" class="text-blue-600">Reset Game</a>
    </div>
  `
}).mount('#app');
