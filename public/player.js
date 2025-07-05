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
    value() { return Game.handValue(this.hand); }
  },
  methods: {
    send(type, extra = {}) { ws.send(JSON.stringify({ type, id: this.id, ...extra })); },
    join() { this.send('setName', { name: this.name }); },
    hit() { this.send('hit'); },
    stand() { this.send('stand'); }
  },
  mounted() {
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') this.game = msg.game;
    });
  },
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-4">Player {{ id + 1 }}</h1>
      <div v-if="!player.name">
        <form @submit.prevent="join" class="mb-4">
          <label class="block mb-2">Name:
            <input v-model="name" class="border p-1" required>
          </label>
          <button class="px-3 py-1 bg-blue-500 text-white">Join</button>
        </form>
      </div>
      <div v-else>
        <p class="mb-2">Hello {{ player.name }}</p>
        <div class="mb-2">Hand:
          <span v-for="(c,i) in hand" :key="i" class="mr-2">{{ c.rank }} {{ c.suit }}</span>
        </div>
        <div class="mb-2">Value: {{ value }}</div>
        <button @click="hit" :disabled="standing" class="px-2 py-1 bg-blue-500 text-white mr-2">Hit</button>
        <button @click="stand" :disabled="standing" class="px-2 py-1 bg-gray-500 text-white">Stand</button>
        <p v-if="standing" class="mt-2">Standing...</p>
        <a href="table.html" class="block mt-4 text-green-700">Go to Table</a>
      </div>
    </div>
  `
}).mount('#app');
