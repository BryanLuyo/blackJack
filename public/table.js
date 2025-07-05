const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { game: { players: [], started: false }, winner: '' };
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
      return { Hearts: '♥', Diamonds: '♦', Clubs: '♣', Spades: '♠', Joker: '🃏' }[suit] || suit;
    },
    suitClass(suit) {
      if (suit === 'Joker') return 'text-yellow-600';
      return suit === 'Hearts' || suit === 'Diamonds' ? 'text-red-600' : 'text-black';
    },
    begin() { ws.send(JSON.stringify({ type: 'begin' })); },
    finish() {
      const vals = this.game.players.map((p, i) => ({
        name: p.name || `Jugador ${i + 1}`,
        value: this.handValue(p.hand)
      })).filter(v => v.value <= 21);
      if (vals.length === 0) {
        this.winner = 'Sin ganadores';
      } else {
        const max = Math.max(...vals.map(v => v.value));
        const winners = vals.filter(v => v.value === max).map(v => v.name).join(', ');
        this.winner = `${winners} con ${max} puntos`;
      }
      if (typeof confetti === 'function') confetti();
    }
  },
  mounted() {
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') this.game = msg.game;
    });
  },
  template: `
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-2xl font-bold mb-4">Mesa</h1>
      <p class="mb-4">Cartas restantes: {{ game.deck.length }}</p>
      <button v-if="!game.started" @click="begin" class="px-3 py-1 mb-4 bg-blue-600 text-white rounded">Comenzar juego</button>
      <button v-if="game.started" @click="finish" class="px-3 py-1 mb-4 bg-red-600 text-white rounded ml-2">Finalizar juego</button>
      <div class="flex flex-wrap justify-center">
        <div v-for="(player, i) in game.players" :key="i" class="bg-green-900 bg-opacity-50 text-white p-3 m-2 rounded">
          <h2 class="font-semibold mb-2 text-center">{{ player.name || 'Jugador ' + (i + 1) }}</h2>
          <div class="flex mb-1">
            <span v-for="(c,j) in player.hand" :key="j" :class="['card', suitClass(c.suit)]">
              <span class="font-bold">{{ c.rank }}</span>
              <span>{{ suitSymbol(c.suit) }}</span>
            </span>
          </div>
          <div>Valor: {{ handValue(player.hand) }}</div>
          <div v-if="player.standing">Plantado</div>
        </div>
      </div>
      <p v-if="winner" class="mt-4 text-xl font-semibold">Ganador: {{ winner }}</p>
      <a href="index.html" class="text-blue-200 underline block mt-4">Reiniciar partida</a>
    </div>
  `
}).mount('#app');
