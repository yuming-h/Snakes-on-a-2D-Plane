var PF = require("pathfinding");

/**
 * Returns an array of coordinates [{x:n, y:m},...] representing a path to destination.
 * @param {*} state Unaltered game state
 * @param {*} snake The snake object to find the path for
 * @param {x:n, y:m} destination The desired destination
 */
const getPath = (state, snake, destination) => {
  // var matrix = [
  //   [0, 0, 0, 1, 0],
  //   [1, 0, 0, 0, 1],
  //   [0, 0, 1, 0, 0],
  //   [0, 0, 1, 0, 0]
  // ];
  // var grid = new PF.Grid(matrix);
  // var finder = new PF.AStarFinder();
  // var path = finder.findPath(1, 2, 4, 2, grid);

    const matrix = gernerateMatrix(state.body.board);

    return path;

};

// generate a matrix with
function gernerateMatrix(board) {
    var x = new Array(board.width);
    for (var i = 0; i < board.width; i++) {
        x[i] = new Array(board.height);
        x[i].fill(0);
    }

  return matrix;
}

// returns a matrix with other snakes as walls
function addblocks(otherSnake) {
  return matrix;
}

module.exports = {
  getPath
};
