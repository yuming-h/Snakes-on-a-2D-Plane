const SNAKE_STARTER_SIZE = 1;
const FOOD_MARKER = -1;
var board;

const updateFoodPoints = food => {
  for (let foodPoint of food) {
    let x = foodPoint.x;
    let y = foodPoint.y;
    board[y][x] = FOOD_MARKER;
  }
};
const initializeSnakes = snakes => {
  for (let snake of snakes) {
    let body = snake.body[0];
    let x = body.x;
    let y = body.y;
    board[y][x] = SNAKE_STARTER_SIZE;
  }
};
const initializeBoard = boardData => {
  let width = boardData.board.width;
  let height = boardData.board.height;
  board = new Array(height).fill(0).map(() => new Array(width).fill(0));
  updateFoodPoints(boardData.board.food);
  initializeSnakes(boardData.board.snakes);
  return board;
};

module.exports = {
  initializeBoard
};

/**
 * Returns a 2d array of how many moves a particular coordinate will be occupied for.
 * Used for isValidPath.
 * @param {*} state
 */
function getOccupiedSquares(state) {
  const boardHeight = state.board.height;
  const boardWidth = state.board.width;
  const board = new Array(boardHeight)
    .fill(0)
    .map(() => new Array(boardWidth).fill(0));

  var snakes = state.board.snakes;

  //Encode occupied turns for opponent snakes
  for (var i = 0; i < state.board.snakes.length; i++) {
    var snake = snakes[i];
    for (var coordIndex = 0; coordIndex < snake.body.length; coordIndex++) {
      var coord = snake.body[coordIndex];
      var occupiedTurns = snake.body.length - coordIndex;
      board[coord.y][coord.x] = occupiedTurns;
    }
  }

  // Encode occupied turns for our snake
  const you = state.you;
  for (var coordIndex = 0; coordIndex < you.body.length; coordIndex++) {
    var coord = you.body[coordIndex];
    var occupiedTurns = you.body.length - coordIndex;
    board[coord.y][coord.x] = occupiedTurns;
  }

  //console.log(JSON.stringify(board));
  return board;
}
