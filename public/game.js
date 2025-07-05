(() => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

  function createDeck() {
    const deck = [];
    for (const s of suits) {
      for (const r of ranks) deck.push({ suit: s, rank: r });
    }
    return deck;
  }

  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function initGame(players) {
    const deck = createDeck();
    shuffle(deck);
    return {
      deck,
      players: Array.from({ length: players }, () => ({ hand: [], standing: false }))
    };
  }

  function drawCard(game) {
    return game.deck.pop();
  }

  function hit(game, index) {
    const card = drawCard(game);
    if (card) game.players[index].hand.push(card);
  }

  function handValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
      if (card.rank === 'A') {
        value += 11; aces++;
      } else if (['K','Q','J'].includes(card.rank)) {
        value += 10;
      } else {
        value += parseInt(card.rank, 10);
      }
    }
    while (value > 21 && aces > 0) {
      value -= 10; aces--;
    }
    return value;
  }

  function save(game) {
    localStorage.setItem('bjGame', JSON.stringify(game));
  }

  function load() {
    const raw = localStorage.getItem('bjGame');
    return raw ? JSON.parse(raw) : null;
  }

  window.Game = { initGame, hit, handValue, save, load };
})();
