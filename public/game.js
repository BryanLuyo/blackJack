(() => {
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
  window.Game = { handValue };
})();
