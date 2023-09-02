(function() {

var STATE = {
    INIT: 0,
    IDLE: 1,
    WAIT: 2,
    BUZY: 3,
    EXEC: 4,
    DONE: 5,
    STOP: 6
};

var SERVICE = "/api/";

var isDrag = false;
var lastPosition = null;
var determinated = null;
var dropIndex = 0;
var onceGameOver = true;

var inProgress = false;
var auth = null;
var uid = null;
var bot = null;
var player_num = null;
var setup = null;
var last_move = null;
var sid = null;
var bill = null;
var turn = 1;
var netstamp = null;
var recovery_setup = null;
var time_limit = null;
var additional_time = null;
var time_stamp = null;
var onceWinPlay = true;
var last_setup = null;
var dice = false;

function App(canvas, params) {
  this.design = Yahia.Model.getDesign();
  this.canvas = canvas;
  this.view   = Yahia.View.getView();
  this.state  = STATE.INIT;
  if (params) {
      this.params = params;
  } else {
      this.params = [];
  }
  if (_.isUndefined(this.params.WAIT_FRAME)) {
      this.params.WAIT_FRAME = 100;
  }
  if (_.isUndefined(this.params.SHOW_TARGETS)) {
      this.params.SHOW_TARGETS = true;
  }
  if (_.isUndefined(this.params.SHOW_ATTACKING)) {
      this.params.SHOW_ATTACKING = true;
  }
}

var gameOver = function(text, self, player) {
  if (!Yahia.Model.silent || (player != 0)) {
      if (!_.isUndefined(Yahia.Controller.clearGame)) {
          Yahia.Controller.clearGame();
      }
      alert(text);
  }
}

App.prototype.gameOver = function(text, player) {
  Yahia.Controller.Done(this.board);
  this.view.markPositions(Yahia.View.markType.KO, []);
  if (onceGameOver && (uid || !dice)) {
      _.delay(gameOver, 2000, text, this, player);
      onceGameOver = false;
  }
  if (this.board && Yahia.Model.showLose) {
     var captured = [];
     _.each(this.design.allPositions(), function(pos) {
        var piece = this.board.getPiece(pos);
        if (piece !== null) {
            if ((player == 0) || 
                ((player < 0) && (piece.player == -player)) ||
                ((player > 0) && (piece.player != player))) {
                captured.push(pos);
            }
        }
     }, this);
     this.view.markPositions(Yahia.View.markType.ATTACKING, captured);
  }
}

Yahia.Controller.createApp = function(canvas) {
  if (_.isUndefined(Yahia.Controller.app)) {
      Yahia.Controller.app = new App(canvas);
  }
  return Yahia.Controller.app;
}

App.prototype.done = function() {
  if ((this.state != STATE.DONE) && (this.state != STATE.INIT)) {
      this.state = STATE.STOP;
  } else {
      if (this.doneMessage) {
          this.gameOver(this.doneMessage, this.winPlayer);
      }
  }
}

App.prototype.setDone = function() {
  if (uid) {
      this.state = STATE.DONE;
  } else {
      this.state = STATE.IDLE;
  }
}

App.prototype.getStarts = function() {
  if (_.isUndefined(this.starts)) {
      if (_.isUndefined(this.list)) {
          this.starts = [];
      } else {
          this.starts = this.list.getStarts();
      }
  }
  return this.starts;
}

App.prototype.getStops = function() {
  if (_.isUndefined(this.stops)) {
      if (_.isUndefined(this.list)) {
          this.stops = [];
      } else {
          this.stops = this.list.getStops();
      }
  }
  return this.stops;
}

App.prototype.getTargets = function() {
  if (_.isUndefined(this.targets)) {
      if (_.isUndefined(this.list)) {
          this.targets = [];
      } else {
          this.targets = this.list.getTargets();
      }
  }
  return this.targets;
}

App.prototype.getDrops = function() {
  if (_.isUndefined(this.list) || (Yahia.Model.showDrops == 0)) {
      this.drops = [];
  } else {
      if (_.isUndefined(this.drops) || (this.drops.length == 0)) {
          this.drops = this.list.getDrops();
      }
  }
  return this.drops;
}

App.prototype.clearPositions = function() {
  delete this.starts;
  delete this.stops;
  delete this.targets;
  delete this.drops;
  this.view.clearDrops();
}

App.prototype.setPosition = function(pos) {
  this.move = this.list.setPosition(pos);
  this.clearPositions();
  if (this.params.SHOW_TARGETS) {
      this.view.markPositions(Yahia.View.markType.TARGET, this.getTargets());
  }
  if (this.params.SHOW_ATTACKING && Yahia.Model.showCaptures && _.isUndefined(Yahia.Model.getMarked)) {
      this.view.markPositions(Yahia.View.markType.ATTACKING, this.list.getCaptures());
  }
  this.state = STATE.EXEC;
  Canvas.style.cursor = "default";
  this.view.markPositions(Yahia.View.markType.CURRENT, [ pos ]);
}

App.prototype.syncCaptures = function(move) {
  var m = Yahia.Model.createMove(move.mode, move.sound);
  _.each(move.actions, function(a) {
      if ((a[0] !== null) && (a[1] === null)) {
          m.actions.push(a);
      }
  });
  m.applyAll(this.view);
}

App.prototype.mouseWheel = function(view, delta) {
  dropIndex += delta;
  if (dropIndex < 0) dropIndex = 0;
  var pos = this.currPos;
  this.currPos = -1;
  this.mouseLocate(view, pos);
}

App.prototype.mouseLocate = function(view, pos) {
  if (this.currPos != pos) {
      this.getDrops();
      if ((Yahia.Model.showDrops == -1) || (!_.isUndefined(this.drops) && (Yahia.Model.showDrops > 0) && (this.drops.length > Yahia.Model.showDrops))) {
          if (!_.isUndefined(this.list) && (_.intersection(this.getDrops(), pos).length >= 0)) {
              var p = _.intersection(this.getDrops(), pos)[0];
              var pieces = this.list.getDropPieces(p);
              if (!_.isUndefined(Yahia.View.getDropPieces)) {
                  pieces = Yahia.View.getDropPieces(this.design, this.board, p);
              }
              if ((pieces !== null) && (pieces.length > 0)) {
                  if (dropIndex >= pieces.length) {
                     if (Yahia.Controller.cyclicDropIndex){
                         dropIndex = 0;
                     } else {
                         dropIndex = pieces.length - 1;
                     }
                  }
                  this.view.setDrops(pieces[dropIndex].toString(), [p]);
              }
          } else {
              this.view.clearDrops();
          }
      }
      if ((this.state == STATE.IDLE) && !_.isUndefined(this.list)) {
          if (isDrag) {
              if (_.intersection(this.getStops(), pos).length > 0) {
                  Canvas.style.cursor = "pointer";
              } else {
                  Canvas.style.cursor = "move";
              }
          } else {
              if (_.intersection(this.getStarts(), pos).length > 0) {
                  Canvas.style.cursor = "pointer";
              } else {
                  Canvas.style.cursor = "default";
              }
          }
      }
      this.view.markPositions(Yahia.View.markType.GOAL, []);
      if (!isDrag && !_.isUndefined(this.board)) {
          var piece = this.board.getPiece(pos);
          if (piece !== null) {
              var types = Yahia.Model.getPieceTypes(piece, this.board);
              if (Yahia.Model.showGoals) {
                  var positions = this.design.getGoalPositions(this.board.player, types);
                  this.view.markPositions(Yahia.View.markType.GOAL, positions);
              }
          }
      }
  }
  this.currPos = pos;
}

App.prototype.boardApply = function(move) {
  this.board = this.board.apply(move);
  if (!_.isUndefined(this.view.sync)) {
      this.view.sync(this.board);
  }
}

App.prototype.mouseDown = function(view, pos) {
  this.view.markPositions(Yahia.View.markType.GOAL, []);
  if ((this.state == STATE.IDLE) && !_.isUndefined(this.list)) {
      var positions = _.intersection(this.getTargets(), pos);
      if (positions.length == 0) {
          positions = _.intersection(this.getStops(), pos);
      }
      if (positions.length == 0) {
          positions = _.intersection(this.getStarts(), pos);
      }
      if (positions.length > 0) {
          Canvas.style.cursor = "move";
          this.setPosition(positions[0]);
          if (this.move && this.move.isPass() && (lastPosition == positions[0])) {
              if (this.list && this.list.canPass()) {
                  var moves = this.list.getMoves();
                  if (moves.length == 1) {
                      var m = moves[0];
                      this.boardApply(m);
                      this.syncCaptures(m);
                      var s = m.toString();
                      if (!_.isUndefined(Yahia.Model.getSetup)) {
                          s = Yahia.Model.getSetup(this.design, this.board);
                      }
                      addMove(m.toString(), s, uid);
                      this.state = STATE.IDLE;
                      delete this.list;
                      this.view.clearDrops();
                      lastPosition = null;
                      if (_.isUndefined(Yahia.Model.getMarked)) {
                          this.view.markPositions(Yahia.View.markType.ATTACKING, []);
                      }
                      this.view.markPositions(Yahia.View.markType.CURRENT, []);
                      this.view.markPositions(Yahia.View.markType.TARGET, []);
                      return;
                  }
              }
          }
          lastPosition = positions[0];
          isDrag = true;
      }
  }
}

App.prototype.mouseUp = function(view, pos) {
  if ((this.state == STATE.IDLE) && !_.isUndefined(this.list) && Yahia.Model.dragNdrop) {
      var positions = _.intersection(this.getTargets(), pos);
      if (positions.length > 0) {
          this.setPosition(positions[0]);
      }
  }
  Canvas.style.cursor = "default";
  isDrag = false;
}

App.prototype.getBoard = function() {
  if (_.isUndefined(this.board)) {
      this.board = Yahia.Model.getInitBoard();
      Yahia.Model.Done(this.design, this.board);
  }
  return this.board;
}

App.prototype.determinate = function(move) {
  var moves = move.determinate();
  determinated = null;
  if (moves.length > 1) {
      var promote = confirm("Promote piece?");
      if (promote) {
          move = moves[1];
      } else {
          move = moves[0];
      }
      determinated = move;
  }
  return move;
}

App.prototype.isReady = function() {
  return this.state == STATE.IDLE;
}

Yahia.Controller.isBuzy = function() {
  var self = Yahia.Controller.app;
  return self.state == STATE.BUZY;
}

Yahia.Controller.apply = function(move, setup, limit) {
  var self = Yahia.Controller.app;
  if (self.state == STATE.BUZY) {
      recovery_setup = setup;
      last_move = move;
      delete self.list;
      self.clearPositions();
      self.view.markPositions(Yahia.View.markType.TARGET, []);
      if (limit) {
          time_limit = limit;
      }
  }
}

Yahia.Controller.setup = function(setup, player, limit) {
  var self = Yahia.Controller.app;
  if (self.state == STATE.BUZY) {
      Yahia.Model.setup(self.board, setup);
      delete self.board.moves;
      self.view.reInit(self.board);
      delete self.list;
      self.clearPositions();
      self.view.markPositions(Yahia.View.markType.TARGET, []);
      if (limit) {
          time_limit = limit;
      }
  }
}

App.prototype.setBoard = function(board, isForced) {
  if (this.isReady() || isForced) {
      this.board = board;
      this.view.reInit(board);
      delete this.list;
      this.clearPositions();
      this.view.markPositions(Yahia.View.markType.TARGET, []);
  }
}

App.prototype.setMove = function(move) {
  if (this.state == STATE.IDLE) {
      delete this.list;
      this.boardApply(move);
      Yahia.Model.Done(this.design, this.board);
      this.move = move;
      this.state = STATE.EXEC;
  }
}

var getSid = function() {
  var str = window.location.search.toString();
  var result = str.match(/[?&]sid=([^&]*)/);
  if (result) {
      return result[1];
  } else {
      return null;
  }
}

var authorize = function() {
  if (auth !== null) return;
  auth = localStorage.getItem('myAuthToken');
  if (auth) {
      console.log(auth);
      return;
  }
  $.ajax({
     url: SERVICE + "auth/guest",
     type: "GET",
     dataType: "json",
     success: function(data) {
         auth = data.refresh_token;
         inProgress = false;
     },
     error: function() {
         console.log('Auth: Error!');
         window.location = '/';
     },
     statusCode: {
        500: function() {
             console.log('Auth: Internal Error!');
             window.location = '/';
        }
     }
  });
}

var billing = function() {
  if (auth === null) return;
  if (sid === null) return;
  if (bill !== null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "account/invoice",
     type: "POST",
     data: {
         session_id: sid,
         usagetype_id: 1
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         bill = data;
         console.log('Billing: Succeed');
         inProgress = false;
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Billing: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Billing: Bad User!');
             window.location = '/';
        },
        404: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Billing: Not found!');
             window.location = '/payments';
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Billing: Internal Error!');
        }
     }
  });
}

var recovery = function(s) {
  if (auth === null) return;
  if (sid === null) return;
  if (bill === null) return;
  if (setup !== null) return;
  if (uid !== null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "session/recovery",
     type: "POST",
     data: {
         id: sid,
         last_setup: s
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         uid = data.uid;
         if (data.ai) {
             bot = data.ai;
         }
         player_num = data.player_num;
         setup = data.last_setup;
         time_limit = data.time_limit;
         additional_time = data.additional_time;
         dice = !!data.is_dice;
         time_stamp = Date.now();
         console.log('Recovery: Succeed [uid = ' + uid + '], time_limit = ' + time_limit + ', additional_time = ' + additional_time);
         inProgress = false;
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Recovery: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Recovery: Bad User!');
             window.location = '/';
        },
        404: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Recovery: Not found!');
             window.location = '/';
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Recovery: Internal Error!');
        }
     }
  });
}

App.prototype.acceptMove = function(move, setup, limit) {
  if (_.isUndefined(Yahia.Controller.addMoves)) {
      last_move  = move;
      time_limit = limit;
  } else {
      if (_.isUndefined(this.top)) {
          this.top = this.board;
      }
      this.top.generate(this.design);
      var r = null;
      _.each(this.top.moves, function(m) {
          var x = m.toString() + ' ';
          if (x.startsWith(move + ' ')) {
              r = m;
          }
      });
      if (r === null) {
          Yahia.Model.setup(this.top, setup);
      } else {
          this.top = this.top.apply(r);
      }
      Yahia.Controller.addMoves([{
          turn_num: turn,
          branch_num: 1,
          next_player: this.top.player,
          move_str: r,
          setup_str: Yahia.Model.getSetup(this.design, this.top),
          time_limit: limit
      }]);
  }
}

var watchMove = function() {
  if (inProgress) return;
  if (auth === null) return;
  if (sid === null) return;
  if (turn === null) return;
  if (netstamp !== null) {
      if (Date.now() - netstamp < 1000) return;
      netstamp = null;
  } else {
      netstamp = Date.now();
  }
  inProgress = true;
  $.ajax({
     url: SERVICE + "move/all/" + sid + "/" + turn,
     type: "GET",
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         if (data.length > 0) {
             Yahia.Controller.app.acceptMove(data[0].move_str, data[0].setup_str, data[0].time_limit);
             turn++;
             console.log('Watch Move: Succeed [move = ' + last_move + '], time_limit = ' + data[0].time_limit);
         }
         inProgress = false;
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Watch Move: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Watch Move: Bad User!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Watch Move: Internal Error!');
        }
     }
  });
}

var acceptAlert = function() {
  if (auth === null) return;
  if (!sid) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "move/accept",
     type: "POST",
     data: {
         session_id: sid
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         console.log('Accept: Succeed');
         inProgress = false;
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Accept: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Accept: Bad User!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Accept: Internal Error!');
        }
     }
  });
}

var sendAlert = function(result) {
  if (auth === null) return;
  if (!sid) return;
  if (!uid) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "move/alert",
     type: "POST",
     data: {
         session_id: sid,
         uid: uid,
         result_id: result
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         console.log('Alert: Succeed [' + result +']');
         inProgress = false;
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Alert: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Alert: Bad User!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Alert: Internal Error!');
        }
     }
  });
}

var winGame = function() {
  if (!onceGameOver) return;
  if (auth === null) return;
  if (!uid) return;
  $.ajax({
     url: SERVICE + "session/close",
     type: "POST",
     data: {
         winner: uid
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         console.log('Close: Succeed');
         inProgress = false;
         this.state = STATE.STOP;
         acceptAlert();
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Close: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Bad User!');
        },
        403: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Not Found!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Internal Error!');
        }
     }
  });
}

var loseGame = function() {
  if (!onceGameOver) return;
  if (auth === null) return;
  if (!uid) return;
  $.ajax({
     url: SERVICE + "session/close",
     type: "POST",
     data: {
         loser: uid
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         console.log('Close: Succeed');
         inProgress = false;
         this.state = STATE.STOP;
         acceptAlert();
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Close: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Bad User!');
        },
        403: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Not Found!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Internal Error!');
        }
     }
  });
}

var drawGame = function() {
  if (!onceGameOver) return;
  if (auth === null) return;
  if (!uid) return;
  $.ajax({
     url: SERVICE + "session/close",
     type: "POST",
     data: {
         winner: uid,
         loser: uid
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         console.log('Close: Succeed');
         inProgress = false;
         this.state = STATE.STOP;
         acceptAlert();
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Close: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Bad User!');
        },
        403: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Not Found!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Close: Internal Error!');
        }
     }
  });
}

var getConfirmed = function() {
  var app = Yahia.Controller.app;
  if (inProgress) return;
  if (netstamp !== null) {
      if (Date.now() - netstamp < 1000) return;
      netstamp = null;
  }
  if (auth === null) return;
  if (!uid) return;
  if (last_move !== null) return;
  inProgress = true;
  $.ajax({
     url: SERVICE + "move/confirmed/" + uid,
     type: "GET",
     dataType: "json",
     beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         inProgress = false;
         if (data.length == 1) {
             if (data[0].result_id) {
                 var player = app.design.playerNames[app.board.player];
                 var r = data[0].result_id;
                 if (r == 1) {
                     loseGame();
                     if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                         Yahia.Controller.play(Yahia.Sounds.lose);
                         onceWinPlay = false;
                     }
                     App.prototype.setDone();
                     app.doneMessage = player + " won";
                     app.winPlayer   = app.board.player;
                     gameOver(app.doneMessage, app, app.winPlayer);
                 } else if (r == 2) {
                     winGame();
                     if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                         Yahia.Controller.play(Yahia.Sounds.win);
                         onceWinPlay = false;
                     }
                     App.prototype.setDone();
                     app.doneMessage = player + " lose";
                     app.winPlayer   = -app.board.player;
                     gameOver(app.doneMessage, app, app.winPlayer);
                 } else {
                     if (confirm("Do you agree to a draw?")) {
                         drawGame();
                         if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                             Yahia.Controller.play(Yahia.Sounds.draw);
                             onceWinPlay = false;
                         }
                         App.prototype.setDone();
                         app.doneMessage = "Draw";
                         app.winPlayer   = 0;
                         gameOver(app.doneMessage, app, app.winPlayer);
                     } else {
                         acceptAlert();
                     }
                 }
             } else {
                 last_move  = data[0].move_str;
                 last_setup = data[0].setup_str;
                 time_limit = data[0].time_limit;
                 time_stamp = Date.now();
                 additional_time = data[0].additional_time;
                 console.log('Confirmed: Succeed [move = ' + last_move + '], time_limit = ' + time_limit + ', additional_time = ' + additional_time);
             }
         } else {
             netstamp = Date.now();
         }
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Confirmed: Error!');
         window.location = '';
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Confirmed: Bad User!');
             window.location = '/';
        },
        404: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Confirmed: Not Found!');
             window.location = '/';
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Confirmed: Internal Error!');
        }
     }
  });
}

var addMove = function(move, setup, id) {
  if (auth === null) return;
  if (!id) return;
  inProgress = true;
  var app = Yahia.Controller.app;
  var design = app.design;
  $.ajax({
     url: SERVICE + "move",
     type: "POST",
     data: {
         uid: id,
         next_player: design.currPlayer(app.board.turn),
         move_str: move,
         setup_str: setup
     },
     dataType: "json",
     beforeSend: function (xhr) {
         xhr.setRequestHeader('Authorization', 'Bearer ' + auth);
     },
     success: function(data) {
         console.log('Move: Succeed [move = ' + move + ']');
         inProgress = false;
     },
     error: function() {
         Yahia.Controller.app.state = STATE.STOP;
         console.log('Move: Error!');
     },
     statusCode: {
        401: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Move: Bad User!');
        },
        404: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Move: Not Found!');
        },
        500: function() {
             Yahia.Controller.app.state = STATE.STOP;
             console.log('Move: Internal Error!');
        }
     }
  });
}

Yahia.Controller.resign = function() {
  if (uid && !confirm("Resign?")) return;
  loseGame();
}

Yahia.Controller.drawOffer = function() {
  if (uid && !confirm("Draw Offer?")) return;
  if (bot === null) {
      sendAlert(3);
  } else {
      drawGame();
  }
}

App.prototype.getContext = function(player, forced) {
  if (Yahia.AI.isFriend(player_num, player)) return null;
  if (_.isUndefined(this.context)) {
      this.context = [];
  }
  if (_.isUndefined(this.context[player])) {
      this.context[player] = Yahia.AI.createContext(this.design);
  }
  return this.context[player];
}

App.prototype.getAI = function() {
  if (_.isUndefined(this.ai)) {
      this.ai = Yahia.AI.findBot("random",  this.params, null);
      this.ai = Yahia.AI.findBot("common",  this.params, this.ai);
      this.ai = Yahia.AI.findBot("smart",   this.params, this.ai);
      this.ai = Yahia.AI.findBot("opening", this.params, this.ai);
  }
  return this.ai;
}

App.prototype.updateTimer = function() {  
  if (!onceGameOver) return;
  if (_.isUndefined(time_limit) || (time_limit === null)) return;
  var player = this.design.playerNames[this.board.player];
  if (uid) {
      var t = +time_limit;
      if (player_num != this.board.player) {
          if (additional_time) {
              t += +additional_time;
          }
          if (t < 0) {
              winGame();
              this.setDone();
              this.gameOver(player + " won", this.board.player);
          }
          return;
      }
      if (time_stamp !== null) {
          var now = Date.now();
          time_limit -= now - time_stamp;
          time_stamp = now;
      }
  }
  t = time_limit;
  var c = '#0000CD';
  if (t < 0) {
       if (uid) {
          if (additional_time) t += +additional_time;
       } else {
          t = -t;
       }
       c = '#DC143C';      
  }
  if (uid && (t < 0)) {
      t = 0;
      time_stamp = null;
      time_limit = null;
      loseGame();
      this.setDone();
      this.gameOver(player + " lose", -this.board.player);
  }
  t = (t / 1000) | 0;
  var s = '' + (t % 60);
  if (s.length < 2) {
      s = '0' + s;
  }
  s = ':' + s;
  t = (t / 60) | 0;
  s = '' + (t % 60) + s;
  if (s.length < 5) {
      s = '0' + s;
  }
  s = ':' + s;
  t = (t / 60) | 0;
  s = '' + t + s;
  if (s.length < 8) {
      s = '0' + s;
  }
  timer.innerHTML = '<b style="color:' + c + ';">' + s + '</b>';
}

App.prototype.isRandom = function() {
  if (!_.isUndefined(this.design.turns) && !_.isUndefined(this.design.turns[this.board.turn])) {
      return this.design.turns[this.board.turn].random;
  }
  return false;
}

Yahia.AI.callback = function(result) {
  var app = Yahia.Controller.app;
  var player = app.design.playerNames[app.board.player];
  if (app.state != STATE.WAIT) return;
  console.log("Player: " + player);
  var move = null;
  _.each(app.board.moves, function(m) {
      var x = m.toString() + ' ';
      if (x.startsWith(result + ' ')) {
          move = m;
      }
  });
  if (move === null) return;
  app.boardApply(move);
  var s = move.toString();
  if (!_.isUndefined(Yahia.Model.getSetup)) {
      s = Yahia.Model.getSetup(app.design, app.board);
      console.log("Setup: " + s);
  }
  Yahia.Model.Done(app.design, app.board);
  addMove(move.toString(), s, bot);
  app.move = move;
  app.state = STATE.EXEC;
}

App.prototype.exec = function() {
  this.view.configure();
  this.view.draw(this.canvas);
  this.updateTimer();
  if (inProgress) return;
  if (this.state == STATE.STOP) {
      this.state = STATE.IDLE;
      return;
  }
  if (!onceGameOver && uid) return;
  if (this.state == STATE.INIT) {
      authorize();
      if (auth === null) return;
      if (sid === null) {
          sid = getSid();
          if (sid === null) {
              window.location = '/';
          }
      }
      var s = null;
      if (!_.isUndefined(Yahia.Model.getSetup)) {
          s = Yahia.Model.getSetup(this.design, this.board);
      }
      if (!_.isUndefined(Yahia.Controller.init)) {
          Yahia.Controller.init(s, this.board.player);
      }
      billing();
      recovery(s);
      if (setup && uid) {
          Yahia.Model.setup(this.board, setup);
          this.view.reInit(this.board);
          Yahia.Model.Done(this.design, this.board);
          setup = null;
      }
      if (player_num === null) return;
      this.state = STATE.IDLE;
  }
  if (this.state == STATE.IDLE) {
      if (this.isRandom() && (Yahia.AI.isFriend(player_num, this.board.player) || (bot !== null))) {
          this.move = null;
          while (this.isRandom()) {
              if (_.isUndefined(this.board.moves)) {
                  this.board.generate(this.design);
              }
              var moves = _.filter(this.board.moves, function(move) {
                  if (!_.isUndefined(move.failed)) return false;
                  return _.indexOf(this.design.turns[this.board.turn].modes, move.mode) >= 0;
              }, this);
              if (moves.length > 0) {
                  var ix = 0;
                  if (moves.length > 1) {
                      ix = _.random(0, moves.length - 1);
                  }
                  var move = moves[ix];
                  this.boardApply(move);
                  if (this.move === null) {
                      this.move = move;
                  } else {
                      this.move.join(move);
                  }
              }
          }
          if (this.move !== null) {
              var s = this.move.toString();
              if (!_.isUndefined(Yahia.Model.getSetup)) {
                  s = Yahia.Model.getSetup(this.design, this.board);
                  console.log("Setup: " + s);
              }
              Yahia.Model.Done(this.design, this.board);
              var u = uid;
              if (player_num != this.board.player) {
                  u = bot;
              }
              addMove(this.move.toString(), s, u);
              this.state = STATE.EXEC;
              return;
          }
      }
      if (Yahia.AI.isFriend(player_num, this.board.player)) {
          if (_.isUndefined(this.list)) {
              var player = this.design.playerNames[this.board.player];
              console.log("Player: " + player);
              if (!_.isUndefined(Yahia.Model.getSetup)) {
                  console.log("Setup: " + Yahia.Model.getSetup(this.design, this.board));
              }
              if (!Yahia.Controller.noDropIndex) {
                  dropIndex = 0;
              }
              this.list = Yahia.Model.getMoveList(this.board);
              var ko = [];
              if (!_.isUndefined(this.board.ko)) {
                  ko = this.board.ko;
              }
              this.view.markPositions(Yahia.View.markType.KO, ko);
              if (!_.isUndefined(Yahia.Model.getMarked)) {
                  this.view.markPositions(Yahia.View.markType.ATTACKING, Yahia.Model.getMarked(this.list));
              } else {
                  if (this.params.SHOW_ATTACKING && Yahia.Model.showCaptures) {
                      this.view.markPositions(Yahia.View.markType.ATTACKING, this.list.getCaptures());
                  }
              }
              var drops = this.getDrops();
              if ((Yahia.Model.showDrops == -2) || (!_.isUndefined(this.drops) && (Yahia.Model.showDrops > 0) && (this.drops.length <= Yahia.Model.showDrops))) {
                  if (drops.length > 0) {
                      var pieces = this.list.getDropPieces(drops[0]);
                      if ((pieces !== null) && (pieces.length > 0)) {
                          if (dropIndex >= pieces.length) {
                              if (Yahia.Controller.cyclicDropIndex){
                                  dropIndex = 0;
                              } else {
                                  dropIndex = pieces.length - 1;
                              }
                          }
                          this.view.setDrops(pieces[dropIndex].toString(), drops);
                      }
                  }
                  this.view.invalidate();
              }
              if (this.list.isEmpty()) {
                  App.prototype.setDone();
                  Canvas.style.cursor = "default";
                  if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                      Yahia.Controller.play(Yahia.Sounds.lose);
                      onceWinPlay = false;
                  }
                  loseGame();
                  this.gameOver(player + " lose", -this.board.player);
                  return;
              }
          }
      } else {
          var ctx = this.getContext(this.getBoard().player);
          var ai  = this.getAI();
          if ((ctx !== null) && (ai !== null) && (bot !== null)) {
              ai.setContext(ctx, this.board);
              Canvas.style.cursor = "wait";
              this.timestamp = Date.now();
              var player = this.design.playerNames[this.board.player];
              var result = this.getAI().getMove(ctx);
              this.state = STATE.WAIT;
              if (result && result.move) {
                  Yahia.AI.callback(result.move);
                  return;
              }
          } else {
              this.state = STATE.BUZY;
              this.timestamp = Date.now();
          }
      }
  }
  if (this.state == STATE.BUZY) {
      this.board.IGNORE_DICES = true;
      this.board.generate(this.design);
      if (this.board.moves.length == 0) {
          App.prototype.setDone();
          Canvas.style.cursor = "default";
          if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
              Yahia.Controller.play(Yahia.Sounds.win);
              onceWinPlay = false;
          }
          var player = this.design.playerNames[this.board.player];
          this.gameOver(player + " lose", -this.board.player);
          if (bot === null) {
              winGame();
          }
          return;
      }
      if (Yahia.Model.isHidden) {
          var ko = [];
          if (!_.isUndefined(this.board.ko)) {
              ko = this.board.ko;
          }
          this.view.markPositions(Yahia.View.markType.KO, ko);
      }
      if (uid) {
          getConfirmed();
      } else {
          watchMove();
      }
      if (last_move === null) return;
      this.move = null;
      _.each(this.board.moves, function(move) {
          if (move.toString() == last_move) {
              this.move = move;
          }
      }, this);
      if (this.move === null) {
          if ((recovery_setup === null) && (last_setup !== null)) {
              recovery_setup = last_setup;
              last_setup = null;
          }
          if (recovery_setup !== null) {
              Yahia.Controller.setup(recovery_setup);
              console.log('Buzy: Setup recovered [' + recovery_setup + ']');
              this.state = STATE.IDLE;
              recovery_setup = null;
              last_move = null;
              return;
          }
          this.state = STATE.STOP;
          var s = '';
          if (!_.isUndefined(Yahia.Model.getSetup)) {
              s = ', setup=' + Yahia.Model.getSetup(this.design, this.board);
          }         
          console.log('Buzy: Bad move [' + last_move + ']' + s);
          return;
      }
      var player = this.design.playerNames[this.board.player];
      console.log("Player: " + player);
      if (!_.isUndefined(Yahia.Model.getSetup)) {
          console.log("Setup: " + Yahia.Model.getSetup(this.design, this.board));
      }
      this.boardApply(this.move);
      Yahia.Model.Done(this.design, this.board);
      this.state = STATE.EXEC;
      last_move = null;
  }
  if (this.state == STATE.EXEC) {
      this.state = STATE.IDLE;
      isDrag = false;
      if (!_.isUndefined(this.list) && this.list.isDone()) {
          var moves = this.list.filterDrops(this.list.getMoves(), dropIndex);
          if ((moves.length == 1) && (moves[0].isDropMove())) this.move = moves[0];
      }
      if (!this.move.isPass()) {
          if (Yahia.View.CLEAR_KO) {
              this.view.markPositions(Yahia.View.markType.KO, []);
          }
          this.view.markPositions(Yahia.View.markType.TARGET, []);
          this.view.markPositions(Yahia.View.markType.CURRENT, []);
          lastPosition = null;
          if (Yahia.Model.showMoves) {
              console.log(this.move.toString());
          }
          this.move = this.determinate(this.move);
          this.move.applyAll(this.view);
          if (!_.isUndefined(this.list)) {
              this.view.markPositions(Yahia.View.markType.CURRENT, [ this.move.getTarget() ]);
          }
          this.state = STATE.WAIT;
      }
      if (!_.isUndefined(this.list)) {
          if (this.list.isDone() || (Yahia.Model.completePartial && !this.move.isPass())) {
              this.view.markPositions(Yahia.View.markType.CURRENT, []);
              var moves = this.list.filterDrops(this.list.getMoves(), dropIndex);
              delete this.list;
              this.view.clearDrops();
              var m = this.move;
              if (!Yahia.Model.completePartial && ((moves.length > 0) || (determinated !== null))) {
                  m = moves[0];
                  if (determinated !== null) {
                      m.clarify(determinated);
                      determinated = null;
                  }
              }
              this.boardApply(m);
              var s = m.toString();
              if (!_.isUndefined(Yahia.Model.getSetup)) {
                  s = Yahia.Model.getSetup(this.design, this.board);
              }
              addMove(m.toString(), s, uid);
              Yahia.Model.Done(this.design, this.board);
              console.log("Debug: " + m.toString());
              this.view.markPositions(Yahia.View.markType.KO, []);
          }
      }
      if (!this.move.isPass()) {
          if (!_.isUndefined(Yahia.Controller.play)) {
              var sound = Yahia.Sounds.move;
              if (!_.isUndefined(this.move.sound)) {
                  sound = this.move.sound;
              }
              Yahia.Controller.play(sound, this.board.player);
          }
      }
      if (this.board.parent !== null) {
          var g = this.board.checkGoals(this.design, this.board.parent.player);
          var message = '';
          if (_.isObject(g)) {
              message = g.message;
              g = g.result;
          }
          if (g !== null) {
              var player = this.design.playerNames[this.board.parent.player];
              App.prototype.setDone();
              Canvas.style.cursor = "default";
              if (g > 0) {
                  if (player_num == this.board.parent.player) {
                      winGame();
                      if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                          Yahia.Controller.play(Yahia.Sounds.win);
                          onceWinPlay = false;
                      }
                  } else {
                      loseGame();
                      if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                          Yahia.Controller.play(Yahia.Sounds.lose);
                          onceWinPlay = false;
                      }
                  }
                  this.doneMessage = player + " won" + message;
                  this.winPlayer   = this.board.parent.player;
              } else if (g < 0) {
                  if (player_num == this.board.parent.player) {
                      loseGame();
                      if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                          Yahia.Controller.play(Yahia.Sounds.lose);
                          onceWinPlay = false;
                      }
                  } else {
                      winGame();
                      if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                          Yahia.Controller.play(Yahia.Sounds.win);
                          onceWinPlay = false;
                      }
                  }
                  this.doneMessage = player + " lose" + message;
                  this.winPlayer   = -this.board.parent.player;
              } else {
                  drawGame();
                  if (!_.isUndefined(Yahia.Controller.play) && onceWinPlay && (uid || !dice)) {
                      Yahia.Controller.play(Yahia.Sounds.draw);
                      onceWinPlay = false;
                  }
                  this.doneMessage = "Draw" + message;
                  this.winPlayer   = 0;
              }
              this.gameOver(this.doneMessage, this.winPlayer);
          }
     }
  }
}

Yahia.Model.InitGame();
Yahia.Controller.app = Yahia.Controller.createApp(Canvas);
Yahia.Controller.app.view.init(Yahia.Controller.app.canvas, Yahia.Controller.app);

setInterval(function() {
  Yahia.Controller.app.exec();
}, 100);

})();
