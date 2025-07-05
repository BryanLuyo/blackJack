const { createApp } = Vue;

function getId() {
  const params = new URLSearchParams(location.search);
  return parseInt(params.get('id') || '0', 10);
}

const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { id: getId(), name: '', game: { players: [] } };
  },
  computed: {
    player() { return this.game.players[this.id] || { hand: [], standing: false, name: '' }; },
    hand() { return this.player.hand; },
    standing() { return this.player.standing; },
    value() { return this.handValue(this.hand); }
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
    send(type, extra = {}) { ws.send(JSON.stringify({ type, id: this.id, ...extra })); },
    join() { this.send('setName', { name: this.name }); },
    hit() { this.send('hit'); },
    stand() { this.send('stand'); }
  },
  mounted() {
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') {
        this.game = msg.game;
        if (this.value >= 21 && !this.standing) this.stand();
      }
    });
  },
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-4">Jugador {{ id + 1 }}</h1>
      <div v-if="!player.name">
        <form @submit.prevent="join" class="mb-4">
          <label class="block mb-2">Nombre:
            <input v-model="name" class="border p-1" required>
          </label>
          <button class="px-3 py-1 bg-blue-500 text-white">Unirse</button>
        </form>
      </div>
      <div v-else>
        <p class="mb-2">Hola {{ player.name }}</p>
        <div class="mb-2 flex items-center">Mano:
          <span v-for="(c,i) in hand" :key="i" :class="['card', suitClass(c.suit)]">
            <span class="font-bold">{{ c.rank }}</span>
            <span>{{ suitSymbol(c.suit) }}</span>
          </span>
        </div>
        <div class="mb-2">Valor: {{ value }}</div>
        <button @click="hit" :disabled="standing || value >= 21" class="px-2 py-1 bg-blue-500 text-white mr-2">Pedir</button>
        <button @click="stand" :disabled="standing" class="px-2 py-1 bg-gray-500 text-white">Plantarse</button>
        <p v-if="standing" class="mt-2">Plantado...</p>
        <a href="table.html" class="block mt-4 text-green-700">Ir a la mesa</a>
      </div>
    </div>
  `
}).mount('#app');
