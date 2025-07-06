(() => {
  function valorMano(mano) {
    let valor = 0;
    let ases = 0;
    for (const carta of mano) {
      if (carta.rank === 'A') {
        valor += 11; ases++;
      } else if (['K','Q','J'].includes(carta.rank)) {
        valor += 10;
      } else {
        valor += parseInt(carta.rank, 10);
      }
    }
    while (valor > 21 && ases > 0) {
      valor -= 10; ases--;
    }
    return valor;
  }
  window.Game = { valorMano };
})();
