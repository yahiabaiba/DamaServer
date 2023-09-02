(function() {

var root      = null;
var curr      = null;
var top       = null;
var branch    = 1;
var isAuto    = true;
var isStarted = false;

Yahia.Model.moveToString = function(move) {
  var r = "";
  for (var i = 0; i < move.actions.length; i++) {
       if (move.actions[i][1] !== null) {
           if (r != "") {
               r = r + "-";
           }
           if (move.actions[i][0] !== null) {
               r = r + Yahia.Model.posToString(move.actions[i][0][0]);
           } else if (Yahia.Model.DETAIL_MOVE_DESCRIPTION && (move.actions[i][2] !== null)) {
               r = r + move.actions[i][2][0].toString() + " ";
           }
           if (move.actions[i][1] !== null) {
               r = r + Yahia.Model.posToString(move.actions[i][1][0]);
           }
       }
  }
  return r;
}

Yahia.Controller.init = function(setup, player) {
//console.log('Session Manager (Init): ' + setup + ', player = ' + player);
  root = {
      parent: null,
      turn:   0,
      branch: 0,
      player: player,
      setup:  setup,
      nodes:  []
  };
  curr = root;
  top = curr;
}

var findNode = function(turn) {
  var r = top;
  while (r !== null) {
      if (r.turn == turn) return r;
      r = r.parent;
  }
  return null;
}

var checkButtons = function() {
  if (curr.parent) {
      undo.style.display = "inline";
      home.style.display = "inline";
  } else {
      undo.style.display = "none";
      home.style.display = "none";
  }
  if (curr.nodes.length) {
      redo.style.display = "inline";
  } else {
      redo.style.display = "none";
  }
}

// TODO: Переопределить в app
// true - если коалиция или режим разбора партии
Yahia.Controller.isStable = function(player) {
  return true;
}

Yahia.Controller.home = function() {
  Yahia.Controller.system = true;
  if (!curr.parent) return;
  if (!Yahia.Controller.isBuzy()) return;
  var node = curr.parent;
  while (node.parent) {
      node = node.parent;
  }
  curr = node;
  checkButtons();
  Yahia.Controller.setup(node.setup, node.player, node.limit);
  console.log('undo: ' + node.setup);
  if (!_.isUndefined(Yahia.Controller.play)) {
      Yahia.Controller.play(Yahia.Sounds.page);
  }
  isAuto = false;
}

// TODO: Согласование отката
Yahia.Controller.undo = function() {
  Yahia.Controller.system = true;
  if (!curr.parent) return;
  if (!Yahia.Controller.isBuzy()) return;
  var node = curr.parent;
  while (node.parent) {
      // Если перемотка может быть завершена на этом игроке
      if (Yahia.Controller.isStable(node.player)) break;
      node = node.parent;
  }
  if (!node) return false;
  curr = node;
  checkButtons();
  Yahia.Controller.setup(node.setup, node.player, node.limit);
  console.log('undo: ' + node.setup);
  if (!_.isUndefined(Yahia.Controller.play)) {
      Yahia.Controller.play(Yahia.Sounds.page);
  }
  isAuto = false;
}

Yahia.Controller.redo = function() {
  Yahia.Controller.system = true;
  if (!curr.nodes.length) return;
  if (!Yahia.Controller.isBuzy()) return;
  var node = null;
  _.each(curr.nodes, function(n) {
      if (n.branch > branch) return;
      if ((node !== null) && (node.branch >= n.branch)) return;
      node = n;
  });
  if (!node) return false;
  if (node.move !== null) {
      Yahia.Controller.apply(node.move, node.setup, node.limit);
  } else {
      Yahia.Controller.setup(node.setup, node.player, node.limit);
      console.log('redo: ' + node.setup);
      if (!_.isUndefined(Yahia.Controller.play)) {
          Yahia.Controller.play(Yahia.Sounds.page);
      }
  }
  curr = node;
  checkButtons();
}

var animate = function() {
  if (!isAuto) return;
  Yahia.Controller.redo();
  _.delay(animate, 2000);
}

Yahia.Controller.addMoves = function(moves) {
  console.log(moves[0]);
  _.each(moves, function(move) {
      var node = findNode(move.turn_num - 1);
      if (node === null) return;
      var branch = 0;
      _.each(node.nodes, function(n) {
          if (n.branch <= branch) return;
          branch = n.branch;
      });
      // Добавить branch_num
      if (move.branch_num <= branch) return;
      top = {
          parent: node,
          turn: move.turn_num,
          branch: move.branch_num,
          player: move.next_player,
          move: move.move_str,
          setup: move.setup_str,
          limit: move.time_limit,
          nodes:  []
      };
      node.nodes.push(top);   
  });
  checkButtons();
  if (!isStarted) {
      isStarted = true;
      _.delay(animate, 1000);
  }
}

// Переключиться на branch хода
Yahia.Controller.switch = function(move, setup, player) {
  var node = null; var mx = branch;
  _.each(curr.nodes, function(n) {
      if (n.branch > mx) mx = n.branch;
      if (n.move != move) return;
      node = n;
  });
  if (!node) {
      node = {
          parent: curr,
          turn: curr.turn + 1,
          branch: mx + 1,
          player: player,
          move: move,
          setup: setup,
          nodes:  []
      };
      curr.nodes.push(node);
      // TODO: Сохранить новый branch в БД
      Yahia.Controller.save(node.turn, node.move, node.setup, node.player, node.branch);
  }
  if (!node) return false;
  branch = node.branch
  curr = node;
  checkButtons();
  return true;
}

var DIR_NAMES   = {
    "Home":      "h",
    "PageUp":    "u",
    "PageDown":  "d"
};

var onkeyup = window.onkeyup;

window.onkeyup = function(event) {
  var name = DIR_NAMES[event.key];
  if (_.isUndefined(event.key)) {
      name = DIR_NAMES[event.keyIdentifier];
  }
  if (curr) {
      if (curr.parent && (name == 'd')) {
          Yahia.Controller.undo();
      }
      if (curr.nodes.length && (name == 'u')) {
          Yahia.Controller.redo();
      }
      if (curr.nodes.length && (name == 'h')) {
          Yahia.Controller.home();
      }
  }
  if (onkeyup) {
      onkeyup(event);
  }
}

})();
