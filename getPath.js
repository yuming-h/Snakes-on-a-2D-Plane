var PF = require("pathfinding");

/**
 * Returns an array of coordinates [{x:n, y:m},...] representing a path to destination.
 * @param {*} state Unaltered game state
 * @param {*} snake The snake object to find the path for
 * @param {x:n, y:m} destination The desired destination
 */
const getPath = (state, snake, destination) => {
  // var matrix = [
  //   [1, 1, 1, 1, 1],
  //   [1, 1, 1, 1, 1],
  //   [1, 1, 1, 1, 1],
  //   [1, 1, 1, 1, 1]
  // ];
  var matrix = gernerateMatrix(state.board);
  matrix = addblocks(matrix, state);

  var grid = new PF.Grid(matrix);
  var finder = new PF.AStarFinder();
  console.log(
    `snake is ${JSON.stringify(snake)} and destination is ${JSON.stringify(
      destination
    )}`
  );
  var path =
    snake.body.length > 0
      ? finder.findPath(
          snake.body[0].x,
          snake.body[0].y,
          destination.x,
          destination.y,
          grid
        )
      : [];

  path.shift();
  //console.log(path);
  //const matrix = gernerateMatrix(state.body.board);

  return path;
};

// generate a matrix with
function gernerateMatrix(board) {
  var matrix = new Array(board.height);
  for (var i = 0; i < board.height; i++) {
    matrix[i] = new Array(board.width);
    matrix[i].fill(0);
  }

  return matrix;
}

// returns a matrix with other snakes as walls
function addblocks(matrix, state) {
  //add the body of itself as block
  //console.log("beforeiteself");
  var matrixAfterItself = addItself(matrix, state);
  //console.log("beforeother");
  var matrixAfterOtherSanke = addOtherSnake(matrixAfterItself, state);
  //console.log("afterother");
  return matrixAfterOtherSanke;
}

//add the snake itself other than the head
function addItself(matrix, state) {
  var bodySnake = state.you.body;
  if(bodySnake.length > 1) {
    bodySnake.shift();
  }
  //console.log(bodySnake);
  bodySnake.forEach(xy => {
    turnZeroToOne(matrix, xy);
  });
  return matrix;
}

function turnZeroToOne(matrix, xy) {
  const x = xy.x;
  const y = xy.y;
  matrix[x][y] = 1;
}

function addOtherSnake(matrix, state) {
  var snakes = state.board.snakes;
  snakes.forEach(snake => {
    var snakeBody = snake.body;
    snakeBody.forEach(xy => {
      turnZeroToOne(matrix, xy);
    });
  });
  return matrix;
}

module.exports = {
  getPath,
  gernerateMatrix,
  turnZeroToOne,
  addItself,
  addblocks,
  addOtherSnake
};
