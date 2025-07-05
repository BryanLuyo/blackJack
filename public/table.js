const { createApp } = Vue;
const ws = new WebSocket(`ws://${location.host}`);

createApp({
  data() {
    return { juego: { jugadores: [], iniciado: false }, ganador: '', animacion: true };
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
    comenzar() { ws.send(JSON.stringify({ type: 'begin' })); },
    finalizar() {
      const vals = this.juego.jugadores.map((j, i) => ({
        nombre: j.nombre || `Jugador ${i + 1}`,
        valor: this.valorMano(j.mano)
      })).filter(v => v.valor <= 21);
      if (vals.length === 0) {
        this.ganador = 'Sin ganadores';
      } else {
        const max = Math.max(...vals.map(v => v.valor));
        const ganadores = vals.filter(v => v.valor === max).map(v => v.nombre).join(', ');
        this.ganador = `${ganadores} con ${max} puntos`;
      }
      if (typeof confetti === 'function') confetti();
    }
  },
  mounted() {
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state') this.juego = msg.juego;
    });
    setTimeout(() => { this.animacion = false; }, 800);
  },
  template: `
    <div class="max-w-3xl mx-auto text-center">
      <div v-if="animacion" class="deck"></div>
      <h1 class="text-2xl font-bold mb-4">Mesa</h1>
      <p class="mb-4">Cartas restantes: {{ juego.baraja.length }}</p>
      <button v-if="!juego.iniciado" @click="comenzar" class="px-3 py-1 mb-4 bg-blue-600 text-white rounded">Comenzar juego</button>
      <button v-if="juego.iniciado" @click="finalizar" class="px-3 py-1 mb-4 bg-red-600 text-white rounded ml-2">Finalizar juego</button>
      <div class="flex flex-wrap justify-center">
        <div v-for="(jugador, i) in juego.jugadores" :key="i" class="bg-green-900 bg-opacity-50 text-white p-3 m-2 rounded">
          <h2 class="font-semibold mb-2 text-center">{{ jugador.nombre || 'Jugador ' + (i + 1) }}</h2>
          <div class="flex mb-1">
            <span v-for="(c,j) in jugador.mano" :key="j" :class="['card', clasePalo(c.suit)]">
              <span class="font-bold">{{ c.rank }}</span>
              <span>{{ simboloPalo(c.suit) }}</span>
            </span>
          </div>
          <div>Valor: {{ valorMano(jugador.mano) }}</div>
          <div v-if="jugador.plantado">Plantado</div>
        </div>
      </div>
      <p v-if="ganador" class="mt-4 text-xl font-semibold">Ganador: {{ ganador }}</p>
      <a href="index.html" class="text-blue-200 underline block mt-4">Reiniciar partida</a>
    </div>
  `
}).mount('#app');
