const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')
const board = require('./board')

let boardState = []

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  boardState = board.initializeBoard(request.body)
  // Response data
  const data = {
    color: '#DFFF00',
    headType: "smile",
    tailType: "bolt"
  }
  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  const state = request.body

  // Response data
  const data = {
    move: 'up', // one of: ['up','down','left','right']
  }

  return response.json(data)
})


/**
 * Returns an array of coordinates [{x:n, y:m},...] representing a path to destination.
 * @param {*} state Unaltered game state
 * @param {*} snake The snake object to find the path for
 * @param {x:n, y:m} destination The desired destination
 */
const getPath = (state, snake, destination) => {

}

/**
 * Returns if a path is traversable without dying to a snake currently in the way.
 * This is useful if we are finding paths without regard for other snakes.
 * We don't need this if we pathfind with something like a*.
 * @param {*} state
 * @param {*} path The desired path
 */
const isValidPath = (state, path) => {

}

/**
 * Returns a 2d array of how many moves a particular coordinate will be occupied for.
 * Used for isValidPath.
 * @param {*} state
 */
const occupiedSquares = (state) => {

}

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
