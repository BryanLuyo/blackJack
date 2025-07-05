<script lang="ts">
import { initGame, saveGame } from '$lib/game';
import { onMount } from 'svelte';

let numPlayers = 1;
let links: string[] = [];

function start() {
  const game = initGame(numPlayers);
  saveGame(game);
  links = Array.from({ length: numPlayers }, (_, i) => `/player/${i}`);
}
</script>

<h1 class="text-2xl font-bold">Configurar juego</h1>
<div class="space-y-2">
  <label class="block">
    Numero de jugadores:
    <input type="number" min="1" bind:value={numPlayers} class="border p-1 ml-2" />
  </label>
  <button on:click={start} class="px-2 py-1 bg-green-500 text-white rounded">Comenzar</button>
</div>

{#if links.length}
  <h2 class="font-semibold mt-4">Links para jugadores</h2>
  <ul class="list-disc ml-6">
    {#each links as link, i}
      <li><a class="text-blue-600 underline" href={link}>Jugador {i + 1}</a></li>
    {/each}
  </ul>
  <a class="text-blue-600 underline" href="/table">Ver mesa</a>
{/if}

<style>
  @import '../app.css';
</style>
