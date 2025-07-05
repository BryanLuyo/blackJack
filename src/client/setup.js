import { initGame, saveGame } from './game.js';

function renderLinks(num) {
  const links = document.getElementById('links');
  links.innerHTML = '';
  const heading = document.createElement('h2');
  heading.className = 'font-semibold';
  heading.textContent = 'Links para jugadores';
  links.appendChild(heading);
  const ul = document.createElement('ul');
  ul.className = 'list-disc ml-6';
  for (let i = 0; i < num; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `player.html?id=${i}`;
    a.textContent = `Jugador ${i + 1}`;
    a.className = 'text-blue-600 underline';
    li.appendChild(a);
    ul.appendChild(li);
  }
  links.appendChild(ul);
  const table = document.createElement('a');
  table.href = 'table.html';
  table.className = 'text-blue-600 underline';
  table.textContent = 'Ver mesa';
  links.appendChild(table);
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('setup-form');
  const input = document.getElementById('numPlayers');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const num = parseInt(input.value, 10) || 1;
    const game = initGame(num);
    saveGame(game);
    renderLinks(num);
  });
});
