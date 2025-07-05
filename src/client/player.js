import { loadGame, saveGame, hit, handValue } from './game.js';

function render(game, index) {
  const handDiv = document.getElementById('hand');
  handDiv.innerHTML = '';
  if (!game) {
    handDiv.textContent = 'No hay juego iniciado.';
    return;
  }
  const player = game.players[index];
  const label = document.createElement('span');
  label.className = 'font-semibold';
  label.textContent = `Mano (${handValue(player.hand)}): `;
  handDiv.appendChild(label);
  for (const card of player.hand) {
    const span = document.createElement('span');
    span.className = 'inline-block bg-white shadow rounded px-2 py-1 m-1';
    span.textContent = `${card.rank} ${card.suit}`;
    handDiv.appendChild(span);
  }
  if (player.standing) {
    const st = document.createElement('span');
    st.className = 'ml-2 text-sm text-gray-600';
    st.textContent = '(Stand)';
    handDiv.appendChild(st);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get('id') || '0', 10);
  document.getElementById('player-title').textContent = `Jugador ${index + 1}`;

  let game = loadGame();
  render(game, index);

  document.getElementById('hit').addEventListener('click', () => {
    game = loadGame();
    if (!game) return;
    hit(game, index);
    saveGame(game);
    render(game, index);
  });

  document.getElementById('stand').addEventListener('click', () => {
    game = loadGame();
    if (!game) return;
    game.players[index].standing = true;
    saveGame(game);
    render(game, index);
  });

  setInterval(() => {
    game = loadGame();
    render(game, index);
  }, 1000);
});
