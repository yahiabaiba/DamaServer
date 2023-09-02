Yahia.Controller.persistense = "none";

Yahia.Model.WIDTH  = 8;
Yahia.Model.HEIGHT = 8;

(function() {

Yahia.Model.moveToString = function(move) {
  var r = "";
  _.each(move.actions, function(a) {
      if (a[1] === null) return;
      if ((r == "") && (a[0] != null)) {
          r = r + Yahia.Model.posToString(a[0][0]);
      }
      if ((a[1] !== null) && (a[0][0] != a[1][0])) {
          r = r + Yahia.Model.posToString(a[1][0]);
      }
  });
  return r;
}

var getName = function() {
  var str = window.location.pathname.toString();
  var result = str.match(/\/([^.\/]+)\./);
  if (result) {
      return result[1].replace("-board", "").replace("-ai", "");
  } else {
      return str;
  }
}

var badName = function(str) {
  var result = str.match(/[?&]game=([^&*]*)/);
  if (result) {
      return result[1] != getName();
  } else {
      return true;
  }
}

var getCookie = function() {
  var result = localStorage.getItem('yahia.setup');
  if (result) {
      if (badName(result)) return "";
      return result;
  } else {
      return "";
  }
}

var getSetup = function(setup) {
  var str = window.location.search.toString();
  if (setup) {
      str = setup;
  }
  var result = str.match(/[?&]setup=([^&]*)/);
  if (result) {
      return result[1];
  } else {
      str = getCookie();
      result = str.match(/[?&]setup=([^&]*)/);
      if (result) {
          return result[1];
      } else {
          return "";
      }
  }
}

var getTurn = function(setup) {
  var str = window.location.search.toString();
  if (setup) {
      str = setup;
  }
  var result = str.match(/[?&]turn=(\d+)/);
  if (result) {
      return result[1];
  } else {
      str = getCookie();
      result = str.match(/[?&]turn=(\d+)/);
      if (result) {
          return result[1];
      } else {
          return "";
      }
  }
}

var createPiece = function(design, c) {
  if (c == 'P') return Yahia.Model.createPiece(design.getPieceType("Man"), 1);
  if (c == 'p') return Yahia.Model.createPiece(design.getPieceType("Man"), 2);
  if (c == 'K') return Yahia.Model.createPiece(design.getPieceType("King"), 1);
  if (c == 'k') return Yahia.Model.createPiece(design.getPieceType("King"), 2);
  return null;
}

Yahia.Model.setup = function(board, init) {
  var design = Yahia.Model.design;
  var setup  = getSetup(init);
  var player = 1;
  if (setup) {
      board.clear();
      var pos = 0;
      for (var i = 0; i < setup.length; i++) {
           var c = setup[i];
           if (c != '/') {
               if ((c >= '0') && (c <= '9')) {
                   pos += +c;
               } else {
                   var piece = createPiece(design, c);
                   board.setPiece(pos, piece);
                   pos++;
               }
               if (pos >= Yahia.Model.WIDTH * Yahia.Model.HEIGHT) break;
           }
      }
      var turn = getTurn(init);
      if (turn) {
          board.turn   = +turn;
          board.player = design.currPlayer(board.turn);
      }
  }
}

var getPieceNotation = function(design, piece) {
  var r = 'P';
  if (piece.type == design.getPieceType("King")) r = 'K';
  if (piece.player > 1) {
      return r.toLowerCase();
  }
  return r;
}

Yahia.Model.getSetup = function(design, board) {
  var str = "?turn=" + board.turn + ";&setup=";
  var k = 0; var c = 0;
  for (var pos = 0; pos < Yahia.Model.WIDTH * Yahia.Model.HEIGHT; pos++) {
       if (k >= Yahia.Model.WIDTH) {
           if (c > 0) {
               str += c;
           }
           str += "/";
           k = 0;
           c = 0;
       }
       k++;
       var piece = board.getPiece(pos);
       if (piece === null) {
           if (c > 8) {
               str += c;
               c = 0;
           }
           c++;
       } else {
           if (c > 0) {
               str += c;
           }
           c = 0;
           str += getPieceNotation(design, piece);
       }
  }
  if (c > 0) {
      str += c;
  }
  if (board.turn == 0) {
      str += " w";
  } else {
      str += " b";
  }
  if (Yahia.Controller.persistense == "setup") {
      var s = str + "&game=" + getName() + "*";
      localStorage.setItem('yahia.setup', s);
  }
  return str;
}

var clearGame = Yahia.Controller.clearGame;

Yahia.Controller.clearGame = function() {
   localStorage.setItem('yahia.setup', '');
   if (!_.isUndefined(clearGame)) {
       clearGame();
   }
}

})();
