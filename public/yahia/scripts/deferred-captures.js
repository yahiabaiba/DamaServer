(function() {

Yahia.Model.deferredStrike = true;

var checkVersion = Yahia.Model.checkVersion;

Yahia.Model.checkVersion = function(design, name, value) {
  if (name != "deferred-captures") {
     checkVersion(design, name, value);
  }
}

var CheckInvariants = Yahia.Model.CheckInvariants;

Yahia.Model.CheckInvariants = function(board) {
  _.chain(board.moves)
   .filter(function(move) {
        return move.actions.length > 0;
    })
   .each(function(move) {
        var mx = _.chain(move.actions)
         .map(function(action) {
              return action[3];
          }).max().value();
          var actions = [];
          _.each(move.actions, function(action) {
              var pn = action[3];
              if ((action[0] !== null) && (action[1] === null)) {
                  pn = mx;
              }
              actions.push([ action[0], action[1], action[2], pn ]);
          });
          move.actions = actions;
    });
  CheckInvariants(board);
}

})();
