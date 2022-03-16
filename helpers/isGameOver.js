export default function isGameOver(board) {
  var state = board,
    // One of the rows must be equal to either of these
    // value for
    // the game to be over
    matches = ["xxx", "ooo"],
    // These are all of the possible combinations
    // that would win the game
    rows = [
      state[1] + state[2] + state[3],
      state[4] + state[5] + state[6],
      state[7] + state[8] + state[9],
      state[1] + state[5] + state[9],
      state[3] + state[5] + state[7],
      state[1] + state[4] + state[7],
      state[2] + state[5] + state[8],
      state[3] + state[6] + state[9],
    ];

  // to either 'XXX' or 'OOO'
  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === matches[0] || rows[i] === matches[1]) {
      return 0;
    }
    //check if match is tie or not
    else if (board.toString().includes("-")) {
      return 2;
    }
  }

  return 1;
}
