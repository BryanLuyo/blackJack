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
    },
    suitSymbol(suit) {
      return { Hearts: '♥', Diamonds: '♦', Clubs: '♣', Spades: '♠' }[suit] || suit;
    },
    suitClass(suit) {
      return suit === 'Hearts' || suit === 'Diamonds' ? 'text-red-600' : 'text-black';
    }
  },
  mounted() {
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') this.game = msg.game;
    });
  },
  template: `
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-center">Table</h1>
      <div class="flex flex-wrap justify-center">
        <div v-for="(player, i) in game.players" :key="i" class="bg-green-900 bg-opacity-50 text-white p-3 m-2 rounded">
          <h2 class="font-semibold mb-2 text-center">{{ player.name || 'Player ' + (i + 1) }}</h2>
          <div class="flex mb-1">
            <span v-for="(c,j) in player.hand" :key="j" :class="['card', suitClass(c.suit)]">
              <span class="font-bold">{{ c.rank }}</span>
              <span>{{ suitSymbol(c.suit) }}</span>
            </span>
          </div>
          <div>Value: {{ handValue(player.hand) }}</div>
          <div v-if="player.standing">Standing</div>
        </div>
      </div>
      <a href="index.html" class="text-blue-200 underline block mt-4 text-center">Reset Game</a>
    </div>
  `
}).mount('#app');
