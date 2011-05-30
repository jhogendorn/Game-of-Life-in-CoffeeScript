var GameOfLife;
GameOfLife = (function() {
  GameOfLife.prototype.canvas = null;
  GameOfLife.prototype.gen = 0;
  GameOfLife.prototype.genc = [];
  GameOfLife.prototype.genn = [];
  GameOfLife.prototype.genlog = [];
  GameOfLife.prototype.history = 5;
  GameOfLife.prototype.seedweight = 0.2;
  GameOfLife.prototype.grid = {
    x: 50,
    y: 50
  };
  GameOfLife.prototype.cell = {
    w: 10,
    h: 10
  };
  function GameOfLife(canvas, seed) {
    var x, y;
    if (!(canvas.canvas != null) || !canvas.nodeName === "CANVAS") {
      throw "Game needs a canvas object or canvas DOM node";
    }
    this.canvas = canvas.nodeName != null ? canvas.getContext("2d") : canvas;
    if (!(seed != null)) {
      this.genc = (function() {
        var _ref, _results;
        _results = [];
        for (x = 0, _ref = this.grid.x; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (y = 0, _ref2 = this.grid.y; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
              _results2.push(this.seedweight > Math.random());
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }).call(this);
    } else {
      this.genc = seed;
    }
    this.genn = this.genc;
  }
  GameOfLife.prototype._countNeighbours = function(x, y) {
    var xm, xp, ym, yp;
    xp = x + 1 > this.grid.x - 1 ? 0 : x + 1;
    xm = x - 1 < 0 ? this.grid.x - 1 : x - 1;
    yp = y + 1 > this.grid.y - 1 ? 0 : y + 1;
    ym = y - 1 < 0 ? this.grid.y - 1 : y - 1;
    return this.genc[xm][ym] + this.genc[x][ym] + this.genc[xp][ym] + this.genc[xm][y] + this.genc[xp][y] + this.genc[xm][yp] + this.genc[x][yp] + this.genc[xp][yp];
  };
  GameOfLife.prototype._getState = function(x, y) {
    var cell, pop;
    cell = this.genc[x][y];
    pop = this._countNeighbours(x, y);
    if (cell && pop < 2) {
      return false;
    }
    if (cell && (2 <= pop && pop <= 3)) {
      return true;
    }
    if (cell && pop > 3) {
      return false;
    }
    if (!cell && pop === 3) {
      return true;
    }
    return false;
  };
  GameOfLife.prototype.runGeneration = function() {
    var x, y;
    this.genn = (function() {
      var _ref, _results;
      _results = [];
      for (x = 0, _ref = this.grid.x; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (y = 0, _ref2 = this.grid.y; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
            _results2.push(this._getState(x, y));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    }).call(this);
    this._rotateGenerations();
    this.genc = this.genn;
    return this.gen++;
  };
  GameOfLife.prototype._rotateGenerations = function() {
    if (this.genlog.length > this.history) {
      this.genlog.pop();
    }
    return this.genlog.unshift(JSON.stringify(this.genn));
  };
  GameOfLife.prototype.checkStable = function() {
    var gen, genc, key, _ref;
    genc = JSON.stringify(this.genc);
    _ref = this.genlog;
    for (key in _ref) {
      gen = _ref[key];
      if (gen === genc && key > 0) {
        return true;
      }
    }
    return false;
  };
  GameOfLife.prototype._sizeCanvas = function() {
    this.canvas.canvas.width = this.grid.x * this.cell.w;
    this.canvas.canvas.height = this.grid.y * this.cell.h;
    return true;
  };
  GameOfLife.prototype.render = function() {
    var x, y, _ref, _ref2;
    this._sizeCanvas();
    for (x = 0, _ref = this.grid.x; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = this.grid.y; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
        this.canvas.fillStyle = this.genc[x][y] ? "black" : "white";
        this.canvas.fillRect(x * this.cell.w, y * this.cell.h, this.cell.w, this.cell.h);
      }
    }
    return true;
  };
  return GameOfLife;
})();