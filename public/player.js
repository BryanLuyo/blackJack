const { createApp, reactive, computed } = Vue;

function getId() {
  const params = new URLSearchParams(location.search);
  return parseInt(params.get('id') || '0', 10);
}

createApp({
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-4">Player {{ id + 1 }}</h1>
      <div class="mb-2">
        Hand:
        <span v-for="(c,i) in hand" :key="i" class="mr-2">{{ c.rank }} {{ c.suit }}</span>
      </div>
      <div class="mb-2">Value: {{ value }}</div>
      <button @click="hit" :disabled="standing" class="px-2 py-1 bg-blue-500 text-white mr-2">Hit</button>
      <button @click="stand" :disabled="standing" class="px-2 py-1 bg-gray-500 text-white">Stand</button>
      <p v-if="standing" class="mt-2">Standing...</p>
      <a href="table.html" class="block mt-4 text-green-700">Go to Table</a>
    </div>
  `,
  setup() {
    const id = getId();
    const stored = Game.load() || Game.initGame(1);
    const game = reactive(stored);

    function hit() {
      Game.hit(game, id);
      Game.save(game);
    }

    function stand() {
      game.players[id].standing = true;
      Game.save(game);
    }

    return {
      id,
      hand: game.players[id].hand,
      standing: computed(() => game.players[id].standing),
      value: computed(() => Game.handValue(game.players[id].hand)),
      hit,
      stand
    };
  }
}).mount('#app');
