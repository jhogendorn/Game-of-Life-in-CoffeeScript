var game, interval, tng;
game = new GameOfLife(document.getElementById('board').getContext("2d"));
tng = function() {
  game.runGeneration();
  game.render();
  document.getElementById('info').innerHTML = "Generation: " + game.gen;
  if (game.checkStable()) {
    return clearInterval(interval);
  }
};
game.render();
interval = setInterval(tng, 10);