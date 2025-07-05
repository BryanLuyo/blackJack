<script>
  import { initGame, saveGame } from './game.js';

  let numPlayers = 1;
  let started = false;

  function start() {
    const game = initGame(numPlayers);
    saveGame(game);
    started = true;
  }
</script>

<main class="p-4 space-y-2">
  <h1 class="text-2xl font-bold">Configurar juego</h1>

  {#if !started}
    <label class="block">
      Numero de jugadores:
      <input type="number" bind:value={numPlayers} min="1" class="border p-1 ml-2" />
    </label>
    <button on:click={start} class="px-2 py-1 bg-green-500 text-white rounded">Comenzar</button>
  {:else}
    <h2 class="font-semibold">Links para jugadores</h2>
    <ul class="list-disc ml-6">
      {#each Array(numPlayers) as _, i}
        <li><a class="text-blue-600 underline" href={`player.html?id=${i}`}>Jugador {i + 1}</a></li>
      {/each}
    </ul>
    <a href="table.html" class="text-blue-600 underline">Ver mesa</a>
  {/if}
</main>
