<script>
  import { onMount } from 'svelte';
  import { loadGame, saveGame, hit, handValue } from './game.js';

  let index = 0;
  let game = loadGame();

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    index = parseInt(params.get('id') || '0', 10);
    game = loadGame();
  });

  function doHit() {
    if (!game) return;
    hit(game, index);
    saveGame(game);
  }

  function stand() {
    if (!game) return;
    game.players[index].standing = true;
    saveGame(game);
  }
</script>

<main class="p-4 space-y-2">
  <h1 class="text-xl font-bold">Jugador {index + 1}</h1>
  {#if game}
    <div>
      <span class="font-semibold">Mano ({handValue(game.players[index].hand)}):</span>
      {#each game.players[index].hand as card}
        <span class="inline-block bg-white shadow rounded px-2 py-1 m-1">{card.rank} {card.suit}</span>
      {/each}
    </div>
    <div class="space-x-2">
      <button on:click={doHit} class="px-2 py-1 bg-blue-500 text-white rounded">Hit</button>
      <button on:click={stand} class="px-2 py-1 bg-red-500 text-white rounded">Stand</button>
    </div>
    <div class="mt-2">
      <a href="table.html" class="text-blue-600 underline">Ir a la mesa</a>
    </div>
  {:else}
    <div>No hay juego iniciado.</div>
  {/if}
</main>
