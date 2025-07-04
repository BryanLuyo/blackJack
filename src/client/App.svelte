<script>
class Deck {
  constructor() {
    this.cards = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push({ suit, rank });
      }
    }
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  draw() {
    return this.cards.pop();
  }
}

function cardValue(card) {
  if (card.rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.rank)) return 10;
  return parseInt(card.rank, 10);
}

function handValue(hand) {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    value += cardValue(card);
    if (card.rank === 'A') aces++;
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

class BlackjackGame {
  constructor() {
    this.deck = new Deck();
    this.player = [];
    this.dealer = [];
    this.isOver = false;
  }
  start() {
    this.deck = new Deck();
    this.deck.shuffle();
    this.player = [this.deck.draw(), this.deck.draw()];
    this.dealer = [this.deck.draw(), this.deck.draw()];
    this.isOver = false;
  }
  hit() {
    if (!this.isOver) {
      this.player.push(this.deck.draw());
      if (handValue(this.player) > 21) this.isOver = true;
    }
  }
  stand() {
    while (handValue(this.dealer) < 17) {
      this.dealer.push(this.deck.draw());
    }
    this.isOver = true;
  }
  result() {
    const playerScore = handValue(this.player);
    const dealerScore = handValue(this.dealer);
    if (playerScore > 21) return 'You Bust! Dealer Wins.';
    if (dealerScore > 21) return 'Dealer Busts! You Win!';
    if (this.isOver) {
      if (playerScore > dealerScore) return 'You Win!';
      if (playerScore < dealerScore) return 'Dealer Wins.';
      return 'Push.';
    }
    return '';
  }
}

let game = new BlackjackGame();

game.start();

function newGame() {
  game.start();
}
function hit() {
  game.hit();
}
function stand() {
  game.stand();
}
</script>

<main class="p-4 space-y-2">
  <h1 class="text-2xl font-bold">BlackJack</h1>
  <div>
    <span class="font-semibold">Dealer ({handValue(game.dealer)}):</span>
    {#each game.dealer as card}
      <span class="inline-block bg-white shadow rounded px-2 py-1 m-1">{card.rank} {card.suit}</span>
    {/each}
  </div>
  <div>
    <span class="font-semibold">Player ({handValue(game.player)}):</span>
    {#each game.player as card}
      <span class="inline-block bg-white shadow rounded px-2 py-1 m-1">{card.rank} {card.suit}</span>
    {/each}
  </div>
  <div>{game.result()}</div>
  <div class="space-x-2">
    <button on:click={newGame} class="px-2 py-1 bg-green-500 text-white rounded">New</button>
    <button on:click={hit} class="px-2 py-1 bg-blue-500 text-white rounded">Hit</button>
    <button on:click={stand} class="px-2 py-1 bg-red-500 text-white rounded">Stand</button>
  </div>
</main>


