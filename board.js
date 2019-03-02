
const SNAKE_STARTER_SIZE = 1
const FOOD_MARKER = -1
var board

const updateFoodPoints = (food) => {
    for (let foodPoint of food) {
        let {x} = foodPoint
        let {y} = foodPoint
        board[y][x] = FOOD_MARKER
    }
}
const initializeSnakes = (snakes) => {
    for (let snake of snakes) {
        let {x} = snake
        let {y} = snake
        board[y][x] = SNAKE_STARTER_SIZE
    }
}
const initializeBoard = (boardData) => {
    let {width} = boardData
    let {height} = boardData
    board = new Array(height).fill(0).map(() => new Array(width).fill(0))
    updateFoodPoints(boardData.food)
    initializeSnakes(boardData.snakes)
}

module.exports = {
    initializeBoard
}