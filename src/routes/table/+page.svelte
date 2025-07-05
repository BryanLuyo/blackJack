<script lang="ts">
import { loadGame, handValue } from '$lib/game';
import { onMount } from 'svelte';

let game = loadGame();

function reload() {
  game = loadGame();
}

onMount(() => {
  const interval = setInterval(reload, 1000);
  return () => clearInterval(interval);
});
</script>

<h1 class="text-2xl font-bold">Mesa</h1>
{#if !game}
  <p>No hay juego iniciado.</p>
{:else}
  {#each game.players as player, i}
    <div class="mb-2">
      <span class="font-semibold">Jugador {i + 1} ({handValue(player.hand)}): </span>
      {#each player.hand as card}
        <span class="inline-block bg-white shadow rounded px-2 py-1 m-1">{card.rank} {card.suit}</span>
      {/each}
      {#if player.standing}
        <span class="ml-2 text-sm text-gray-600">(Stand)</span>
      {/if}
    </div>
  {/each}
{/if}
<div class="mt-2">
  <a class="text-blue-600 underline" href="/">Volver al inicio</a>
</div>
