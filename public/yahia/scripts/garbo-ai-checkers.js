"use strict";

(function() {

Yahia.AI.g_maxply       = 10;
Yahia.AI.g_timeout      = 5000;
Yahia.Model.WIDTH       = 8;
Yahia.Model.HEIGHT      = 8;
Yahia.AI.NOISE_FACTOR   = 0;

Yahia.AI.PIECE_MASK     = 0xF;
Yahia.AI.TYPE_MASK      = 0x7;
Yahia.AI.PLAYERS_MASK   = 0x18;
Yahia.AI.TYPE_SIZE      = 3;

Yahia.AI.colorBlack     = 0x10;
Yahia.AI.colorWhite     = 0x08;

var pieceEmpty          = 0x00;
var pieceMan            = 0x01;
var pieceKing           = 0x02;
var piecePrince         = 0x03;
var pieceNo             = 0x80;

var moveflagPromotion   = 0x01000000;

var g_moveUndoStack = new Array();

Yahia.AI.materialTable = [0, 100, 1000];

var pieceSquareAdj = new Array(4);
Yahia.AI.flipTable = new Array(256);

Yahia.AI.pieceAdj = [
[   0,    0,   0,   0,   0,   0,    0,    0, // pieceEmpty
    0,    0,   0,   0,   0,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,    0
], 
[   0,    0,   0,   0,   0,   0,    0,    0, // pieceMan
   50,    0,  50,   0,  50,   0,   50,    0, 
    0,   40,   0,  10,   0,  10,    0,    0, 
   -5,    0, 100,   0,   0,   0,    0,    0, 
    0,   20,   0,  20,   0,   0,    0,   -5, 
  -10,    0,  10,   0,  10,   0,    0,    0, 
    0,    0,   0,   0,   0,   0,    0,  -10, 
  -50,    0, -20,   0, -20,   0,  -20,    0 
], 
[   0,    0,   0,   0,   0,   0,    0,  100, // pieceKing
    0,    0,   0,   0,   0,   0,   70,    0, 
    0,    0,   0,   0,   0,  70,    0,    0, 
    0,    0,   0,   0,  70,   0,    0,    0, 
    0,    0,   0,  70,   0,   0,    0,    0, 
    0,    0,  70,   0,   0,   0,    0,    0, 
    0,   70,   0,   0,   0,   0,    0,    0, 
  100,    0,   0,   0,   0,   0,    0,    0 
]];

Yahia.AI.g_board = new Array(256);
Yahia.AI.g_toMove = 0;

Yahia.AI.g_baseEval    = 0;
Yahia.AI.g_hashKeyLow  = 0;
Yahia.AI.g_hashKeyHigh = 0;

Yahia.AI.g_zobristLow = 0;
Yahia.AI.g_zobristHigh = 0;
Yahia.AI.g_zobristBlackLow = 0;
Yahia.AI.g_zobristBlackHigh = 0;

Yahia.AI.g_moveCount = 0;

Yahia.AI.g_move50 = 0;
Yahia.AI.g_repMoveStack = new Array();

var g_hashSize = 1 << 22;
var g_hashMask = g_hashSize - 1;
var g_hashTable;
var g_killers;

var hashflagAlpha = 1;
var hashflagBeta  = 2;
var hashflagExact = 3;

var once       = true;
var inProgress = false;
var resultMove = null;
var player     = null;

function Ai(parent) {
  this.parent = parent;
}

var findBot = Yahia.AI.findBot;

Yahia.AI.findBot = function(type, params, parent) {
  if ((type == "external") || (type == "smart") /*|| (type == "1")*/ || (type == "2")) {
      return new Ai(parent);
  } else {
      return findBot(type, params, parent);
  }
}

var g_startTime;
var g_nodeCount;
var g_qNodeCount;
var g_searchValid;
var g_globalPly = 0;

var minEval = -2000000;
var maxEval = +2000000;

var minMateBuffer = minEval + 2000;
var maxMateBuffer = maxEval - 2000;

function HashEntry(lock, value, flags, hashDepth, bestMove, globalPly) {
    this.lock = lock;
    this.value = value;
    this.flags = flags;
    this.hashDepth = hashDepth;
    this.bestMove = bestMove;
}

function Search(finishMoveCallback, maxPly, finishPlyCallback) {
    var lastEval;
    var alpha = minEval;
    var beta = maxEval;
    
    g_globalPly++;
    g_nodeCount = 0;
    g_qNodeCount = 0;
    g_searchValid = true;
    
    var bestMove = 0;
    var value;
    
    g_startTime = (new Date()).getTime();

    var i;
    for (i = 1; i <= maxPly && g_searchValid; i++) {
        var tmp = AlphaBeta(i, 0, alpha, beta);
        if (!g_searchValid) break;

        value = tmp;

        if (value > alpha && value < beta) {
            alpha = value - 500;
            beta = value + 500;

            if (alpha < minEval) alpha = minEval;
            if (beta > maxEval) beta = maxEval;
        } else if (alpha != minEval) {
            alpha = minEval;
            beta = maxEval;
            i--;
        }

        if (g_hashTable[Yahia.AI.g_hashKeyLow & g_hashMask] != null) {
            bestMove = g_hashTable[Yahia.AI.g_hashKeyLow & g_hashMask].bestMove;
        }

        if (finishPlyCallback != null) {
            finishPlyCallback(bestMove, value, (new Date()).getTime() - g_startTime, i);
        }
    }

    if (finishMoveCallback != null) {
        finishMoveCallback(bestMove, value, (new Date()).getTime() - g_startTime, i - 1);
    }
}

function QSearch(alpha, beta, ply, depth) {
    g_qNodeCount++;

    var realEval = Yahia.AI.Evaluate();
    
    if (realEval >= beta) 
        return realEval;

    if (realEval > alpha)
        alpha = realEval;

    realEval -= depth;

    var moveScores = new Array();
    var moves = Yahia.AI.GenerateCaptureMoves();

    for (var i = 0; i < moves.length; i++) {
        if (!Yahia.AI.MakeMove(moves[i])) {
            continue;
        }

        var value = -QSearch(-beta, -alpha, ply - 1, depth + 1);
        
        Yahia.AI.UnmakeMove(moves[i]);

        if (value > realEval) {
            if (value >= beta) 
                return value;
            
            if (value > alpha)
                alpha = value;
            
            realEval = value;
        }
    }

    return realEval;
}

function StoreHash(value, flags, ply, move, depth) {
    if (value >= maxMateBuffer)
        value += depth;
    else if (value <= minMateBuffer)
        value -= depth;
    g_hashTable[Yahia.AI.g_hashKeyLow & g_hashMask] = new HashEntry(Yahia.AI.g_hashKeyHigh, value, flags, ply, move);
}

function IsRepDraw() {
    var stop = Yahia.AI.g_moveCount - 1 - Yahia.AI.g_move50;
    stop = stop < 0 ? 0 : stop;
    for (var i = Yahia.AI.g_moveCount - 5; i >= stop; i -= 2) {
        if (Yahia.AI.g_repMoveStack[i] == Yahia.AI.g_hashKeyLow)
            return true;
    }
    return false;
}

function offset(n) {
  var r = '';
  while (n > 0) {
      r = r + ' ';
      n--;
  }
  return r;
}

function AlphaBeta(ply, depth, alpha, beta) {
    if (ply <= 0) {
        return QSearch(alpha, beta, 0, depth + 1);
    }

    g_nodeCount++;
    if ((g_nodeCount & 127) == 127) {
        if ((new Date()).getTime() - g_startTime > Yahia.AI.g_timeout) {
            // Time cutoff
            g_searchValid = false;
            return beta - 1;
        }
    }

    if (depth > 0 && IsRepDraw()) return 0;

    // Mate distance pruning
    var oldAlpha = alpha;
    alpha = alpha < minEval + depth * 10 ? alpha : minEval + depth * 10;
    beta = beta > maxEval - (depth + 1) * 10 ? beta : maxEval - (depth + 1) * 10;
    if (alpha >= beta)
       return alpha;

    var hashMove = null;
    var hashFlag = hashflagAlpha;
    var hashNode = g_hashTable[Yahia.AI.g_hashKeyLow & g_hashMask];
    if (hashNode != null && hashNode.lock == Yahia.AI.g_hashKeyHigh) {
        hashMove = hashNode.bestMove;
    }

    var moveMade = false;
    var realEval = minEval;

    var movePicker = new MovePicker(hashMove, depth, g_killers[depth][0], g_killers[depth][1]);

    for (;;) {
        var currentMove = movePicker.nextMove();
        if (currentMove == 0) {
            break;
        }

        var plyToSearch = ply - 1;

        if (!Yahia.AI.MakeMove(currentMove)) {
            continue;
        }

        var w = 0;
        if (Yahia.AI.NOISE_FACTOR && (depth == 0)) {
            w = _.random(0, Yahia.AI.NOISE_FACTOR);
        }

        var value = w - AlphaBeta(plyToSearch, depth + 1, -beta, -alpha);
        moveMade = true;

        Yahia.AI.UnmakeMove(currentMove);

        if (!g_searchValid) {
            return alpha;
        }

        if (value > realEval) {
            if (value >= beta) {
                StoreHash(value, hashflagBeta, ply, currentMove, depth);
                return value;
            }
            if (value > oldAlpha) {
                hashFlag = hashflagExact;
                alpha = value;
            }

            realEval = value;
            hashMove = currentMove;
        }
    }

    if (!moveMade) {
        // If we have no valid moves it's either stalemate or checkmate
        return minEval + depth * 10;
    }

    StoreHash(realEval, hashFlag, ply, hashMove, depth);
    return realEval;
}

Yahia.AI.ResetGame = function() {
    g_killers = new Array(128);
    for (var i = 0; i < 128; i++) {
        g_killers[i] = [0, 0];
    }

    g_hashTable = new Array(g_hashSize);

    var mt = new Yahia.AI.MT(0x1badf00d);

    Yahia.AI.g_zobristLow = new Array(256);
    Yahia.AI.g_zobristHigh = new Array(256);
    for (var i = 0; i < 256; i++) {
        Yahia.AI.g_zobristLow[i] = new Array(32);
        Yahia.AI.g_zobristHigh[i] = new Array(32);
        for (var j = 0; j < 32; j++) {
            Yahia.AI.g_zobristLow[i][j] = mt.next(32);
            Yahia.AI.g_zobristHigh[i][j] = mt.next(32);
        }
    }
    Yahia.AI.g_zobristBlackLow = mt.next(32);
    Yahia.AI.g_zobristBlackHigh = mt.next(32);

    for (var row = 0; row < Yahia.Model.HEIGHT; row++) {
         for (var col = 0; col < Yahia.Model.WIDTH; col++) {
              var square = Yahia.AI.MakeSquare(row, col);
              Yahia.AI.flipTable[square] = Yahia.AI.MakeSquare((Yahia.Model.HEIGHT - 1) - row, (Yahia.Model.WIDTH - 1) - col);
         }
    }
    pieceSquareAdj[pieceEmpty]  = MakeTable(Yahia.AI.pieceAdj[pieceEmpty]);
    pieceSquareAdj[pieceMan]    = MakeTable(Yahia.AI.pieceAdj[pieceMan]);
    pieceSquareAdj[pieceKing]   = MakeTable(Yahia.AI.pieceAdj[pieceKing]);
    pieceSquareAdj[piecePrince] = MakeTable(Yahia.AI.pieceAdj[pieceKing]);
}

Yahia.AI.SetHash = function() {
    var result = new Object();
    result.hashKeyLow = 0;
    result.hashKeyHigh = 0;
    for (var i = 0; i < 256; i++) {
        var piece = Yahia.AI.g_board[i];
        if (piece & Yahia.AI.PLAYERS_MASK) {
            result.hashKeyLow ^= Yahia.AI.g_zobristLow[i][piece & Yahia.AI.PIECE_MASK]
            result.hashKeyHigh ^= Yahia.AI.g_zobristHigh[i][piece & Yahia.AI.PIECE_MASK]
        }
    }
    if (!Yahia.AI.g_toMove) {
        result.hashKeyLow ^= Yahia.AI.g_zobristBlackLow;
        result.hashKeyHigh ^= Yahia.AI.g_zobristBlackHigh;
    }
    return result;
}

function MovePicker(hashMove, depth, killer1, killer2) {
    this.hashMove = hashMove;
    this.depth = depth;
    this.killer1 = killer1;
    this.killer2 = killer2;

    this.moves = Yahia.AI.GenerateAllMoves();
    this.moveCount = 0;
    this.atMove = -1;
    this.moveScores = null;
    this.stage = 0;

    // DEBUG:
    this.stage = 3;

    this.nextMove = function () {
        if (++this.atMove == this.moveCount) {
            this.stage++;
            if (this.stage == 1) {
                if (this.hashMove != null && Yahia.AI.IsHashMoveValid(hashMove)) {
                    this.moves[0] = hashMove;
                    this.moveCount = 1;
                }
                if (this.moveCount != 1) {
                    this.hashMove = null;
                    this.stage++;
                }
            }

            if (this.stage == 2) {
                if (Yahia.AI.IsHashMoveValid(this.killer1) &&
                    this.killer1 != this.hashMove) {
                    this.moves[this.moves.length] = this.killer1;
                    this.moveCount = this.moves.length;
                } else {
                    this.killer1 = 0;
                    this.stage++;
                }
            }

            if (this.stage == 3) {
                if (Yahia.AI.IsHashMoveValid(this.killer2) &&
                    this.killer2 != this.hashMove) {
                    this.moves[this.moves.length] = this.killer2;
                    this.moveCount = this.moves.length;
                } else {
                    this.killer2 = 0;
                    this.stage++;
                }
            }

            if (this.stage == 4) {
                this.moveCount = this.moves.length;
                this.moveScores = new Array(this.moveCount);
                // Move ordering
                for (var i = this.atMove; i < this.moveCount; i++) this.moveScores[i] = Yahia.AI.ScoreMove(this.moves[i]);
                // No moves, onto next stage
                if (this.atMove == this.moveCount) this.stage++;
            }

            if (this.stage == 5)
                return 0;
        }

        var bestMove = this.atMove;
        for (var j = this.atMove + 1; j < this.moveCount; j++) {
            if (this.moveScores[j] > this.moveScores[bestMove]) {
                bestMove = j;
            }
        }

        if (bestMove != this.atMove) {
            var tmpMove = this.moves[this.atMove];
            this.moves[this.atMove] = this.moves[bestMove];
            this.moves[bestMove] = tmpMove;

            var tmpScore = this.moveScores[this.atMove];
            this.moveScores[this.atMove] = this.moveScores[bestMove];
            this.moveScores[bestMove] = tmpScore;
        }

        var candidateMove = this.moves[this.atMove];
        if ((this.stage > 1 && candidateMove == this.hashMove) ||
            (this.stage > 2 && candidateMove == this.killer1)  ||
            (this.stage > 3 && candidateMove == this.killer2)) {
            return this.nextMove();
        }

        return this.moves[this.atMove];
    }
}

Yahia.AI.FormatSquare = function(square) {
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
    return letters[(square & 0xF) - 2] + (((Yahia.Model.HEIGHT + 1) - (square >> 4)) + 1);
}

Yahia.AI.MakeSquare = function(row, column) {
    return ((row + 2) << 4) | (column + 2);
}

Yahia.AI.FormatMove = function(move) {
    var result = null;
    for (var i = 0; i < move.length; i++) {
        if (result === null) {
            result = Yahia.AI.FormatSquare(move[i] & 0xFF);
        }
        result = result + Yahia.AI.FormatSquare((move[i] >> 8) & 0xFF);
    }
    return result;
}

Yahia.AI.Mobility = function(color) {
    return 0;
}

Yahia.AI.Evaluate = function() {
    var curEval = Yahia.AI.g_baseEval;
    var evalAdjust = 0;

    var players = 0;
    for (var i = 0; i < 256; i++) {
         if ((Yahia.AI.g_board[i] & Yahia.AI.TYPE_MASK) == pieceKing) {
             players |= Yahia.AI.g_board[i] & Yahia.AI.PLAYERS_MASK;
         }
    }
    if (players == Yahia.AI.colorBlack) evalAdjust -= 1000;
    if (players == Yahia.AI.colorWhite) evalAdjust += 1000;

    var mobility = Yahia.AI.Mobility(Yahia.AI.colorWhite) - Yahia.AI.Mobility(0);
    if (Yahia.AI.g_toMove == 0) {
        // Black
        curEval -= mobility;
        curEval -= evalAdjust;
    }
    else {
        curEval += mobility;
        curEval += evalAdjust;
    }
    return curEval;
}

Yahia.AI.ScoreMove = function(move) {
    var score = 0;
    for (var i = 0; i < move.length; i++) {
         var from = move[i] & 0xFF;
         var to = (move[i] >> 8) & 0xFF;
         var target = (move[i] >> 16) & 0xFF;
         var captured = target ? Yahia.AI.g_board[target] : pieceEmpty;
         var piece = Yahia.AI.g_board[from];
         if (captured != pieceEmpty) {
             var pieceType = piece & Yahia.AI.TYPE_MASK;
             score += (captured << 5) - pieceType;
         }
         if (move[i] & moveflagPromotion) {
             score += 1000;
         }
    }
    return score;
}

Yahia.AI.IsHashMoveValid = function(move) {
    if (move.length != 1) return false;

    var from = move[0] & 0xFF;
    var to = (move[0] >> 8) & 0xFF;
    var target = (move[0] >> 16) & 0xFF;
    var captured = target ? Yahia.AI.g_board[target] : pieceEmpty;

    var piece = Yahia.AI.g_board[from];
    var pieceType = piece & Yahia.AI.TYPE_MASK;
    if (pieceType < pieceMan || pieceType > pieceKing) return false;

    // Can't move a piece we don't control
    if (Yahia.AI.g_toMove != (piece & Yahia.AI.colorWhite)) return false;

    // Can't move to a square that has something of the same color
    if ((captured != pieceEmpty) && (Yahia.AI.g_toMove == (captured & Yahia.AI.colorWhite))) return false;

    if (captured == pieceEmpty) {
        var dir = to - from;
        if (pieceType == pieceMan) {
            if ((dir > 17) || (dir < -17)) return false;
            if ((Yahia.AI.g_toMove == Yahia.AI.colorWhite) != (dir < 0)) return false;
        }
    } else {
        if ((dir <= 17) && (dir >= -17)) return false;
    }
    return true;
}

function MakeTable(table) {
    var result = new Array(256);
    for (var i = 0; i < 256; i++) {
        result[i] = 0;
    }
    for (var row = 0; row < Yahia.Model.HEIGHT; row++) {
        for (var col = 0; col < Yahia.Model.WIDTH; col++) {
            result[Yahia.AI.MakeSquare(row, col)] = table[row * Yahia.Model.WIDTH + col];
        }
    }
    return result;
}

Yahia.AI.getPieceType = function(c) {
    var piece = 0;
    switch (c) {
        case 'p':
            piece |= pieceMan;
            break;
        case 'k':
            piece |= pieceKing;
            break;
    }
    return piece;
}

Yahia.AI.InitializeFromFen = function(fen) {
    var chunks = fen.split(' ');

    for (var i = 0; i < 256; i++) 
        Yahia.AI.g_board[i] = pieceNo;

    var row = 0;
    var col = 0;

    var pieces = chunks[0];
    for (var i = 0; i < pieces.length; i++) {
        var c = pieces.charAt(i);
        
        if (c == '/') {
            row++;
            col = 0;
        } else {
            if (c >= '0' && c <= '9') {
                for (var j = 0; j < parseInt(c); j++) {
                    Yahia.AI.g_board[Yahia.AI.MakeSquare(row, col)] = 0;
                    col++;
                }
            }
            else {
                var isBlack = c >= 'a' && c <= 'z';
                var piece = isBlack ? Yahia.AI.colorBlack : Yahia.AI.colorWhite;
                if (!isBlack) 
                    c = pieces.toLowerCase().charAt(i);
                piece |= Yahia.AI.getPieceType(c);
                if (piece & Yahia.AI.TYPE_MASK) {
                    Yahia.AI.g_board[Yahia.AI.MakeSquare(row, col)] = piece;
                }
                col++;
            }
        }
    }

    Yahia.AI.g_toMove = chunks[1].charAt(0) == 'w' ? Yahia.AI.colorWhite : pieceEmpty;

    var hashResult = Yahia.AI.SetHash();
    Yahia.AI.g_hashKeyLow = hashResult.hashKeyLow;
    Yahia.AI.g_hashKeyHigh = hashResult.hashKeyHigh;

    Yahia.AI.g_baseEval = 0;
    for (var i = 0; i < 256; i++) {
        if (Yahia.AI.g_board[i] & Yahia.AI.colorWhite) {
            Yahia.AI.g_baseEval += pieceSquareAdj[Yahia.AI.g_board[i] & Yahia.AI.TYPE_MASK][i];
            Yahia.AI.g_baseEval += Yahia.AI.materialTable[Yahia.AI.g_board[i] & Yahia.AI.TYPE_MASK];
        } else if (Yahia.AI.g_board[i] & Yahia.AI.colorBlack) {
            Yahia.AI.g_baseEval -= pieceSquareAdj[Yahia.AI.g_board[i] & Yahia.AI.TYPE_MASK][Yahia.AI.flipTable[i]];
            Yahia.AI.g_baseEval -= Yahia.AI.materialTable[Yahia.AI.g_board[i] & Yahia.AI.TYPE_MASK];
        }
    }
    if (!Yahia.AI.g_toMove) Yahia.AI.g_baseEval = -Yahia.AI.g_baseEval;
    Yahia.AI.g_move50 = 0;

    return '';
}

function UndoHistory(move, step, baseEval, hashKeyLow, hashKeyHigh, move50, captured) {
    this.move = move;
    this.step = step;
    this.baseEval = baseEval;
    this.hashKeyLow = hashKeyLow;
    this.hashKeyHigh = hashKeyHigh;
    this.move50 = move50;
    this.captured = captured;
}

Yahia.AI.MakeStep = function(move, step) {
    var me = Yahia.AI.g_toMove >> Yahia.AI.TYPE_SIZE;
    var flags = move & 0xFF000000;
    var to = (move >> 8) & 0xFF;
    var from = move & 0xFF;
    var target = (move >> 16) & 0xFF;

    var captured = target ? Yahia.AI.g_board[target] : pieceEmpty;
    var piece = Yahia.AI.g_board[from];

    g_moveUndoStack[Yahia.AI.g_moveCount] = new UndoHistory(move, step, Yahia.AI.g_baseEval, Yahia.AI.g_hashKeyLow, Yahia.AI.g_hashKeyHigh, Yahia.AI.g_move50, captured);
    Yahia.AI.g_moveCount++;

    if (captured) {
        var capturedType = captured & Yahia.AI.PIECE_MASK;
        Yahia.AI.g_baseEval += Yahia.AI.materialTable[captured & Yahia.AI.TYPE_MASK];
        Yahia.AI.g_baseEval += pieceSquareAdj[captured & Yahia.AI.TYPE_MASK][me ? Yahia.AI.flipTable[target] : target];
        Yahia.AI.g_board[target] = pieceEmpty;

        Yahia.AI.g_hashKeyLow ^= Yahia.AI.g_zobristLow[target][capturedType];
        Yahia.AI.g_hashKeyHigh ^= Yahia.AI.g_zobristHigh[target][capturedType];
        Yahia.AI.g_move50 = 0;
    }

    Yahia.AI.g_hashKeyLow ^= Yahia.AI.g_zobristLow[from][piece & Yahia.AI.PIECE_MASK];
    Yahia.AI.g_hashKeyHigh ^= Yahia.AI.g_zobristHigh[from][piece & Yahia.AI.PIECE_MASK];
    Yahia.AI.g_hashKeyLow ^= Yahia.AI.g_zobristLow[to][piece & Yahia.AI.PIECE_MASK];
    Yahia.AI.g_hashKeyHigh ^= Yahia.AI.g_zobristHigh[to][piece & Yahia.AI.PIECE_MASK];

    Yahia.AI.g_baseEval -= pieceSquareAdj[piece & Yahia.AI.TYPE_MASK][me == 0 ? Yahia.AI.flipTable[from] : from];

    if (flags & moveflagPromotion) {
        var newPiece = piece & (~Yahia.AI.TYPE_MASK);
        newPiece |= pieceKing;

        Yahia.AI.g_hashKeyLow ^= Yahia.AI.g_zobristLow[to][piece & Yahia.AI.PIECE_MASK];
        Yahia.AI.g_hashKeyHigh ^= Yahia.AI.g_zobristHigh[to][piece & Yahia.AI.PIECE_MASK];
        Yahia.AI.g_board[to] = newPiece;
        Yahia.AI.g_hashKeyLow ^= Yahia.AI.g_zobristLow[to][newPiece & Yahia.AI.PIECE_MASK];
        Yahia.AI.g_hashKeyHigh ^= Yahia.AI.g_zobristHigh[to][newPiece & Yahia.AI.PIECE_MASK];

        Yahia.AI.g_baseEval += pieceSquareAdj[newPiece & Yahia.AI.TYPE_MASK][me == 0 ? Yahia.AI.flipTable[to] : to];
        Yahia.AI.g_baseEval -= Yahia.AI.materialTable[pieceMan];
        Yahia.AI.g_baseEval += Yahia.AI.materialTable[newPiece & Yahia.AI.TYPE_MASK];
    } else {
        Yahia.AI.g_board[to] = Yahia.AI.g_board[from];
        Yahia.AI.g_baseEval += pieceSquareAdj[piece & Yahia.AI.TYPE_MASK][me == 0 ? Yahia.AI.flipTable[to] : to];
    }
    Yahia.AI.g_board[from] = pieceEmpty;

    Yahia.AI.g_repMoveStack[Yahia.AI.g_moveCount - 1] = Yahia.AI.g_hashKeyLow;
    Yahia.AI.g_move50++;

    return captured;
}

Yahia.AI.UnmakeStep = function() {
    Yahia.AI.g_moveCount--;
    var move = g_moveUndoStack[Yahia.AI.g_moveCount].move;
    Yahia.AI.g_baseEval = g_moveUndoStack[Yahia.AI.g_moveCount].baseEval;
    Yahia.AI.g_hashKeyLow = g_moveUndoStack[Yahia.AI.g_moveCount].hashKeyLow;
    Yahia.AI.g_hashKeyHigh = g_moveUndoStack[Yahia.AI.g_moveCount].hashKeyHigh;
    Yahia.AI.g_move50 = g_moveUndoStack[Yahia.AI.g_moveCount].move50;

    var flags = move & 0xFF000000;
    var captured = g_moveUndoStack[Yahia.AI.g_moveCount].captured;
    var to = (move >> 8) & 0xFF;
    var from = move & 0xFF;
    var target = (move >> 16) & 0xFF;

    var piece = Yahia.AI.g_board[to];

    if (flags & moveflagPromotion) {
        piece = (Yahia.AI.g_board[to] & (~Yahia.AI.TYPE_MASK)) | pieceMan;
        Yahia.AI.g_board[from] = piece;
    } else {
        Yahia.AI.g_board[from] = Yahia.AI.g_board[to];
    }

    Yahia.AI.g_board[to] = pieceEmpty;
    if (captured) {
        Yahia.AI.g_board[target] = captured;
    }

    return g_moveUndoStack[Yahia.AI.g_moveCount].step;
}

Yahia.AI.MakeMove = function(move) {
    for (var i = 0; i < move.length; i++) {
        if (Yahia.AI.MakeStep(move[i], i) == pieceEmpty) break;
    }
    Yahia.AI.g_toMove = Yahia.AI.colorWhite - Yahia.AI.g_toMove;
    Yahia.AI.g_baseEval = -Yahia.AI.g_baseEval;
    Yahia.AI.g_hashKeyLow ^= Yahia.AI.g_zobristBlackLow;
    Yahia.AI.g_hashKeyHigh ^= Yahia.AI.g_zobristBlackHigh;
    return true;
}

Yahia.AI.UnmakeMove = function(move) {
    Yahia.AI.g_toMove = Yahia.AI.colorWhite - Yahia.AI.g_toMove;
    Yahia.AI.g_baseEval = -Yahia.AI.g_baseEval;
    while (Yahia.AI.UnmakeStep() > 0);
}

function debugPlyCallback(bestMove, value, time, ply) {
    console.log(Yahia.AI.FormatMove(bestMove) + ', v = ' + value + ', t = ' + time + ', ply = ' + ply);
}

var garbo = function(bestMove, value, timeTaken, ply) {
  resultMove = Yahia.AI.FormatMove(bestMove);  
  inProgress = false;
  console.log('Garbo: ' + resultMove + ', value = ' + value + ', time = ' + timeTaken + ', ply = ' + ply);
  if (Yahia.AI.callback) {
      Yahia.AI.callback(resultMove);
  }
}

Ai.prototype.setContext = function(ctx, board) {
  if (this.parent) {
      this.parent.setContext(ctx, board);
  }
  ctx.timestamp = Date.now();
  ctx.board  = board;
  inProgress = false;
  resultMove = null;
  player     = board.player;
  if (once) {
      Yahia.AI.ResetGame();
      once = false;
  }
}

Ai.prototype.getMove = function(ctx) {
  var moves = Yahia.AI.generate(ctx, ctx.board);
  if (moves.length == 0) {
      return { done: true, ai: "nothing" };
  }
  if (moves.length == 1) {
      return {
           done: true,
           move: moves[0],
           time: Date.now() - ctx.timestamp,
           ai:  "once"
      };
  }
  if (resultMove !== null) {
      var bestMove = null;
      _.each(moves, function(move) {
          if (move.toString().startsWith(resultMove)) {
              bestMove = move;
          }
      });
      if (bestMove !== null) {
          return {
              done: true,
              move: bestMove,
              time: Date.now() - ctx.timestamp,
              ai:  "garbo"
         };
      }
      if (this.parent) {
          return this.parent.getMove(ctx);
      }
  }
  if (inProgress) {
      return {
           done: false,
           time: Date.now() - ctx.timestamp,
           ai:  "garbo"
      };
  }
  var setup = Yahia.Model.getSetup(ctx.design, ctx.board);
  var result = setup.match(/[?&]setup=(.*)/);
  if (result) {
      inProgress = true;
      var fen = result[1];
      setTimeout(function () {
            var s = Yahia.AI.InitializeFromFen(fen);
            if (s == '') {
                Search(garbo, Yahia.AI.g_maxply, debugPlyCallback);
            } else {
                console.log(s);
            }
        }, 100);
      return {
           done: false,
           time: Date.now() - ctx.timestamp,
           ai:  "garbo"
      };
  }
  if (this.parent) {
      return this.parent.getMove(ctx);
  }
}

})();
