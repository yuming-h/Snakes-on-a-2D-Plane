const SNAKE_STARTER_SIZE = 1
const FOOD_MARKER = -1

module.exports = class Board {

    constructor(gameData) {
        this.boardMatrix
        this.initializeMatrix(gameData)
        this.me = gameData.you.body[0]
    }

    initializeMatrix(gameData) {
        let width = gameData.board.width
        let height = gameData.board.height
        this.boardMatrix = new Array(height).fill(0).map(() => new Array(width).fill(0))
        this.updateFoodPoints(gameData.board.food)
        this.initializeSnakes(gameData.board.snakes)
    }

    updateFoodPoints(food) {
        for (let foodPoint of food) {
            let x = foodPoint.x
            let y = foodPoint.y
            this.boardMatrix[y][x] = FOOD_MARKER
        }
    }

    initializeSnakes(snakes) {
        for (let snake of snakes) {
            let body = snake.body[0]
            let x = body.x
            let y = body.y
            this.boardMatrix[y][x] = SNAKE_STARTER_SIZE
        }
    }
}