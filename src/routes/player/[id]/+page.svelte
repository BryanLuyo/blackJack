<script lang="ts">
import { loadGame, saveGame, hit, handValue } from '$lib/game';
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { get } from 'svelte/store';

let index: number = 0;
let game = loadGame();

function reload() {
  game = loadGame();
}

function doHit() {
  game = loadGame();
  if (!game) return;
  hit(game, index);
  saveGame(game);
  reload();
}

function stand() {
  game = loadGame();
  if (!game) return;
  game.players[index].standing = true;
  saveGame(game);
  reload();
}

onMount(() => {
  index = parseInt(get(page).params.id, 10);
  const interval = setInterval(reload, 1000);
  return () => clearInterval(interval);
});
</script>

<h1 class="text-xl font-bold">Jugador {index + 1}</h1>
{#if !game}
  <p>No hay juego iniciado.</p>
{:else}
  <div>
    <span class="font-semibold">Mano ({handValue(game.players[index].hand)}): </span>
    {#each game.players[index].hand as card}
      <span class="inline-block bg-white shadow rounded px-2 py-1 m-1">{card.rank} {card.suit}</span>
    {/each}
    {#if game.players[index].standing}
      <span class="ml-2 text-sm text-gray-600">(Stand)</span>
    {/if}
  </div>
  <div class="space-x-2 mt-2">
    <button on:click={doHit} class="px-2 py-1 bg-blue-500 text-white rounded">Hit</button>
    <button on:click={stand} class="px-2 py-1 bg-red-500 text-white rounded">Stand</button>
  </div>
{/if}
<div class="mt-2">
  <a class="text-blue-600 underline" href="/table">Ir a la mesa</a>
</div>
