
const SNAKE_STARTER_SIZE = 1
const FOOD_MARKER = -1
var board

const updateFoodPoints = (food) => {
    for (let foodPoint of food) {
        let x = foodPoint.x
        let y = foodPoint.y
        board[y][x] = FOOD_MARKER
    }
}
const initializeSnakes = (snakes) => {
    for (let snake of snakes) {
        let body = snake.body[0]
        let x = body.x
        let y = body.y
        board[y][x] = SNAKE_STARTER_SIZE
    }
}
const initializeBoard = (boardData) => {
    let width = boardData.board.width
    let height = boardData.board.height
    board = new Array(height).fill(0).map(() => new Array(width).fill(0))
    updateFoodPoints(boardData.board.food)
    initializeSnakes(boardData.board.snakes)
    return board
}

module.exports = {
    initializeBoard
}