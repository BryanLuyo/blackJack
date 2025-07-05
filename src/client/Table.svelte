<script>
  import { onMount } from 'svelte';
  import { loadGame, handValue } from './game.js';

  let game = loadGame();

  function refresh() {
    game = loadGame();
  }

  onMount(() => {
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  });
</script>

<main class="p-4 space-y-2">
  <h1 class="text-2xl font-bold">Mesa</h1>
  {#if game}
    {#each game.players as player, i}
      <div class="mb-2">
        <span class="font-semibold">Jugador {i + 1} ({handValue(player.hand)}):</span>
        {#each player.hand as card}
          <span class="inline-block bg-white shadow rounded px-2 py-1 m-1">{card.rank} {card.suit}</span>
        {/each}
        {#if player.standing}
          <span class="ml-2 text-sm text-gray-600">(Stand)</span>
        {/if}
      </div>
    {/each}
  {:else}
    <div>No hay juego iniciado.</div>
  {/if}
  <div class="mt-2">
    <a href="index.html" class="text-blue-600 underline">Volver al inicio</a>
  </div>
</main>
