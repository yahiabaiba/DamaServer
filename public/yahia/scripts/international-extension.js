(function() {

var checkVersion = Yahia.Model.checkVersion;

Yahia.Model.checkVersion = function(design, name, value) {
  if (name != "international-extension") {
      checkVersion(design, name, value);
  }
}

var isMove = function(action) {
  return (action[0] !== null) && (action[1] !== null);
}

var CheckInvariants = Yahia.Model.CheckInvariants;

Yahia.Model.CheckInvariants = function(board) {
  var design = Yahia.Model.design;
  _.each(board.moves, function(move) {
      var piece  = null;
      var action = null;
      _.chain(move.actions)
       .filter(isMove)
       .each(function(a) {
            if (piece === null) {
                piece = board.getPiece(a[0][0]);
            }
            action = a;
      });
      if ((piece !== null) && (piece.type == 0) && (action !== null) && design.inZone(0, board.player, action[1][0])) {
          action[2] = [ piece.promote(1) ];
      }
  });
  CheckInvariants(board);
}

})();
