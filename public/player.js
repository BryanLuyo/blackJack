const { createApp } = Vue;

function obtenerId() {
  const parametros = new URLSearchParams(location.search);
  return parseInt(parametros.get('id') || '0', 10);
}

function obtenerTablero() {
  const parametros = new URLSearchParams(location.search);
  return parseInt(parametros.get('board') || '0', 10);
}

const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { id: obtenerId(), board: obtenerTablero(), nombre: '', juego: { jugadores: [], iniciado: false } };
  },
  computed: {
    jugador() { return this.juego.jugadores[this.id] || { mano: [], plantado: false, nombre: '' }; },
    mano() { return this.jugador.mano; },
    plantado() { return this.jugador.plantado; },
    valor() { return this.valorMano(this.mano); },
    iniciado() { return this.juego.iniciado; }
  },
  methods: {
    valorMano(mano) {
      let valor = 0;
      let ases = 0;
      for (const carta of mano) {
        if (carta.rank === 'A') {
          valor += 11; ases++;
        } else if (['K','Q','J'].includes(carta.rank)) {
          valor += 10;
        } else {
          valor += parseInt(carta.rank, 10);
        }
      }
      while (valor > 21 && ases > 0) {
        valor -= 10; ases--;
      }
      return valor;
    },
    simboloPalo(palo) {
      return { Hearts: '♥', Diamonds: '♦', Clubs: '♣', Spades: '♠', Joker: '🃏' }[palo] || palo;
    },
    clasePalo(palo) {
      if (palo === 'Joker') return 'text-yellow-600';
      return palo === 'Hearts' || palo === 'Diamonds' ? 'text-red-600' : 'text-black';
    },
    enviar(tipo, extra = {}) { ws.send(JSON.stringify({ type: tipo, board: this.board, id: this.id, ...extra })); },
    unirse() { this.enviar('setName', { name: this.nombre }); },
    pedir() { this.enviar('hit'); },
    plantarse() { this.enviar('stand'); }
  },
  mounted() {
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') {
        this.juego = msg.boards[this.board] || { jugadores: [], iniciado: false, baraja: [] };
        if (this.valor >= 21 && !this.plantado) this.plantarse();
      }
    });
  },
  template: `
    <div>
      <h1 class="text-2xl font-bold mb-4 text-center">Jugador {{ id + 1 }}</h1>
      <div v-if="!jugador.nombre">
        <form @submit.prevent="unirse" class="mb-4">
          <label class="block mb-2">Nombre:
            <input v-model="nombre" class="border p-1 bg-white text-black" required>
          </label>
          <button class="px-3 py-1 bg-blue-500 text-white">Unirse</button>
        </form>
      </div>
      <div v-else>
        <p class="mb-2">Hola {{ jugador.nombre }}</p>
        <div class="mb-2 flex items-center">Mano:
          <span v-for="(c,i) in mano" :key="i" :class="['card', clasePalo(c.suit)]">
            <span class="font-bold">{{ c.rank }}</span>
            <span>{{ simboloPalo(c.suit) }}</span>
          </span>
        </div>
        <div class="mb-2">Valor: {{ valor }}</div>
        <div v-if="!iniciado" class="mb-2">Esperando al crupier...</div>
        <button @click="pedir" :disabled="!iniciado || plantado || valor >= 21" class="px-2 py-1 bg-blue-500 text-white mr-2">Pedir</button>
        <button @click="plantarse" :disabled="!iniciado || plantado" class="px-2 py-1 bg-gray-500 text-white">Plantarse</button>
        <p v-if="plantado" class="mt-2">Plantado...</p>
        <a :href="'table.html?board=' + board" class="block mt-4 text-green-300 underline text-center">Ir a la mesa</a>
      </div>
    </div>
  `
}).mount('#app');
