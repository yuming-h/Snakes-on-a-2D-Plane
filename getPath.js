var PF = require("pathfinding");

/**
 * Returns an array of coordinates [{x:n, y:m},...] representing a path to destination.
 * @param {*} state Unaltered game state
 * @param {*} snake The snake object to find the path for
 * @param {x:n, y:m} destination The desired destination
 */
const getPath = (state, snake, destination) => {
  var matrix = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ];
  var grid = new PF.Grid(matrix);
  var finder = new PF.AStarFinder();
  var path = finder.findPath(0, 0, 1, 0, grid);
  path = path.splice(0, 1);
  //const matrix = gernerateMatrix(state.body.board);

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
function addblocks(matrix, state) {
  //add the body of itself as block
  var matrixAfterItself = addItself(matrix, state);
  var matrixAfterOtherSanke = addOtherSnake(matrixAfterItself, state);
  return matrixAfterOtherSanke;
}

//add the snake itself other than the head
function addItself(matrix, state) {
  var bodySnake = state.you.body;
  var removeHead = bodySnake.splice(0, 1);
  removeHead.forEach(turnZeroToOne(matrix, state));
}

function turnZeroToOne(matrix, state) {}

function addOtherSnake(matrix, state) {
  var snakes = state.body.board.snakes;
  for (var snake in snakes) {
    var snakeBody = snake.body;
    for (xy in snakeBody) {
      turnZeroToOne(matrix, xy);
    }
  }
}

module.exports = {
  getPath
};
