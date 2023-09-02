var Yahia  = {
  Model:      {},
  View:       {},
  AI:         {},
  KPI:        {},
  Controller: {}
};

Yahia.Controller.persistense = "none";
Yahia.Controller.loseRefresh = true;
Yahia.Controller.randomized  = false;
Yahia.Controller.noDropIndex = false;
Yahia.Controller.cyclicDropIndex = false;
Yahia.Controller.turnChanged = false;

Yahia.AI.selector = false;

Yahia.Controller.Done = function(board) {}

Yahia.Controller.go = function(url) {
  window.location = url;
}

Yahia.KPI.open  = function(scope, stage) {}
Yahia.KPI.stage = function(stage, scope) {}
Yahia.KPI.close = function(scope, stage) {}
Yahia.KPI.set   = function(name, value, scope, stage) {}
Yahia.KPI.dump  = function() {}

Yahia.AI.findBot = function(type, params, parent) {
  return parent;
}

Yahia.AI.isFriend = function(player, opponent) {
  return player == opponent;
}

Yahia.AI.createContext = function(design) {
  return {
     design: design
  };
}

Yahia.Model.Determinate = function(moves) {
  return _.chain(moves)
   .map(function(move) {
       return move.determinate();
    })
   .flatten()
   .value();
}

Yahia.AI.generate = function(ctx, board) {
  if (!_.isUndefined(board.moves)) {
      return board.moves;
  }
  board.generate(ctx.design);
  board.moves = Yahia.Model.Determinate(board.moves);
  if (!_.isUndefined(Yahia.Model.PostProcessing)) {
      Yahia.Model.PostProcessing(board, board.moves);
  }
  return board.moves;
}

Yahia.AI.reject = function(ctx, move) {
  ctx.childs = _.filter(ctx.childs, function(child) {
      return child.move.toString() != move.toString();
  });
};
