const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { game: { players: [] } };
  },
  methods: {
    handValue(hand) {
      let value = 0;
      let aces = 0;
      for (const card of hand) {
        if (card.rank === 'A') {
          value += 11; aces++;
        } else if (['K','Q','J'].includes(card.rank)) {
          value += 10;
        } else {
          value += parseInt(card.rank, 10);
        }
      }
      while (value > 21 && aces > 0) {
        value -= 10; aces--;
      }
      return value;
    }
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
        <div>Value: {{ handValue(player.hand) }}</div>
        <div v-if="player.standing">Standing</div>
      </div>
      <a href="index.html" class="text-blue-600">Reset Game</a>
    </div>
  `
}).mount('#app');
