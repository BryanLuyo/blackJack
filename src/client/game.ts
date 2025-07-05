export interface Card {
  suit: string;
  rank: string;
}

export interface Player {
  hand: Card[];
  standing: boolean;
}

export interface GameState {
  deck: Card[];
  players: Player[];
}

export function createDeck(): Card[] {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function initGame(numPlayers: number): GameState {
  const deck = createDeck();
  shuffle(deck);
  const players: Player[] = [];
  for (let i = 0; i < numPlayers; i++) {
    players.push({ hand: [], standing: false });
  }
  return { deck, players };
}

export function drawCard(game: GameState): Card | undefined {
  return game.deck.pop();
}

export function hit(game: GameState, index: number): void {
  const card = drawCard(game);
  if (card) {
    game.players[index].hand.push(card);
  }
}

export function handValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 'A') {
      value += 11;
      aces++;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank, 10);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

export function saveGame(game: GameState): void {
  localStorage.setItem('bjGame', JSON.stringify(game));
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem('bjGame');
  return raw ? JSON.parse(raw) as GameState : null;
}
