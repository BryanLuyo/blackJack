import { loadGame, handValue } from './game.js';

function render() {
  const container = document.getElementById('table');
  const game = loadGame();
  container.innerHTML = '';
  if (!game) {
    container.textContent = 'No hay juego iniciado.';
    return;
  }
  game.players.forEach((player, i) => {
    const div = document.createElement('div');
    div.className = 'mb-2';
    const label = document.createElement('span');
    label.className = 'font-semibold';
    label.textContent = `Jugador ${i + 1} (${handValue(player.hand)}): `;
    div.appendChild(label);
    for (const card of player.hand) {
      const span = document.createElement('span');
      span.className = 'inline-block bg-white shadow rounded px-2 py-1 m-1';
      span.textContent = `${card.rank} ${card.suit}`;
      div.appendChild(span);
    }
    if (player.standing) {
      const st = document.createElement('span');
      st.className = 'ml-2 text-sm text-gray-600';
      st.textContent = '(Stand)';
      div.appendChild(st);
    }
    container.appendChild(div);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  render();
  setInterval(render, 1000);
});
