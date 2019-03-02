const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const pathing = require("./getPath");
const helpers = require("./helper")
const app = express();
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require("./handlers.js");
const board = require("./board");

var boardState;
var me = {
  x: null,
  y: null
};

const STARVING = 25;
// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(poweredByHandler);

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post("/start", (request, response) => {
  try {
    boardState = board.initializeBoard(request.body);
    me = request.body.you.body[0];
    // Response data
    const data = {
      color: "#DFFF00",
      headType: "smile",
      tailType: "bolt"
    };
    return response.json(data);
  } catch (e) {
    return response.json({ error: e.toString() });
  }
});

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  try {
  // NOTE: Do something here to generate your move
  const state = request.body

  console.log(JSON.stringify(state))
  // Response data
  const data = {
    move: findMoveFoodMode(state)
  }
  return response.json(data);
  }
  catch(e) {
  return response.json({error: e.toString(), stack: e.stack})
  }
});

/**
 * Given our snake and a path to take return the first move to take (this move)
 * @param {*} ourSnake
 * @param {*} path
 */
const translateMove = (ourSnake, path) => {
  const ourHead = ourSnake.body.shift;
  const coordinateToMoveTo = path.shift;
  if (ourHead.x !== coordinateToMoveTo.x) {
    if (coordinateToMoveTo.x > ourHead.x) {
      return "right";
    }
    return "left";
  } else {
    if (coordinateToMoveTo.y > ourHead.y) {
      return "down";
    }
    return "up";
  }
};

/**
 * The master function to return a move.
 * @param {*} state
 */
const findMoveFoodMode = state => {
  //Get all paths to food
  const pathList = state.board.food.map(food => {
    return pathing.getPath(state, state.you, food)
  })
  //Sort by shortest length so we can find good short paths first
  pathList.sort(path => {
    return path.length !== 0 ? path.length : Number.MAX_VALUE;
  });
  //Finds the shortest path that we are first to otherwise ends up undefined
  const maybeGoodPath = pathList.find(path => {
    return isFirst(
      state,
      path.length,
      helpers.coordinateToObject(path[path.length - 1])
    );
  });
  //Go for any food that we can be first to
  if (maybeGoodPath !== undefined) {
    return translateMove(state.you, maybeGoodPath);
  }
  //Go for the food with the shortest path if we are starving
  if (state.you.health < STARVING) {
    if (pathList[0].length > 0) {
      return translateMove(state.you, pathList[0]);
    }
  }
  //Otherwise chill (defensive mode) TODO
};

/**
 * Returns if the given path will be first to the destination
 * (Checks all other snake's paths to the destination and sees if they are valid)
 * Might want to be a bit conservative and only say we have the best path if we are at least 2 or 3 moves ahead
 * since we won't have time to optimize.
 * @param {*} state
 * @param pathLength - The length of the path to check against.
 * @param {x:n, y:m} destination - The destination square
 */
const isFirst = (state, pathLength, destination) => {
  const otherSnakes = state.board.snakes;
  const otherPathLengths = otherSnakes.map(snek => {
    const foundPath = getPath(state, snek, destination);
    if (!foundPath) {
      return Number.MAX_VALUE;
    }
    return foundPath.length;
  });

  otherPathLengths.forEach(len => {
    if (len <= pathLength) return false;
  });
  return true;
};

/**
 * Returns if a path is traversable without dying to a snake currently in the way.
 * This is useful if we are finding paths without regard for other snakes.
 * We don't need this if we pathfind with something like a*.
 * @param {*} state
 * @param {*} path The desired path
 */
const isValidPath = (state, path) => {};

/**
 * Returns a 2d array of how many moves a particular coordinate will be occupied for.
 * Used for isValidPath.
 * @param {*} state
 */
const occupiedSquares = state => {};

app.post("/end", (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({});
});

app.post("/ping", (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
});

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use("*", fallbackHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(app.get("port"), () => {
  console.log("Server listening on port %s", app.get("port"));
});
