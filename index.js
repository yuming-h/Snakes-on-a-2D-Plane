const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const pathing = require("./getPath");
const helpers = require("./helper");
const Constants = require("./Constants");
const priority = require("./priority");
const app = express();
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const STARVING = 25;
// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(poweredByHandler);

// Handle POST request to '/start'
app.post("/start", (request, response) => {
  try {
  // Response data
  const data = {
    color: "#DFFF00",
    headType: "smile",
    tailType: "bolt"
  }
  return response.json(data)
} catch (e) {
  return response.json({error: e.toString()})
}
});

// Handle POST request to '/move'
app.post("/move", (request, response) => {
  try {
    const state = request.body;

    const path = masterFindPath(state)
    const data = {
      move: helpers.translateMove(state.you, path)
    };

    return response.json(data);
  } catch (e) {
    return response.json({ error: e.toString(), stack: e.stack });
  }
});

const masterFindPath = state => {
  const priorityFunctions = priority(state).map(pri => {
    return functionPriorityMap[pri]
  })

  for (let index in priorityFunctions) {
    const maybePath = priorityFunctions[index](state)
    if(typeof maybePath !== 'undefined' && maybePath.length) {
      return maybePath
    }
  }
}

/**
 * Tries to find a path to food.
 * @param {*} state
 */
const findFoodSafe = state => {
  //Get all paths to food
  const pathList = state.board.food.map(food => {
    return pathing.getPath(state, state.you, food);
  });
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
    return maybeGoodPath
  }
};

const findFoodUnsafe = state => {
  //Get all paths to food
  const pathList = state.board.food.map(food => {
    return pathing.getPath(state, state.you, food);
  });
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
    return maybeGoodPath
  }
  if(pathList[0].length > 0) {
    return pathList[0]
  }
}

const findDefensePath = state => {
  const me = state.you
  return pathing.getPath(state, me, me.body[me.body.length - 1])
}

//TODO
const findOpenSpace = state => {

}

const functionPriorityMap = {
  [Constants.priorities.FOOD]: findFoodSafe,
  [Constants.priorities.FOOD_STARVING]: findFoodUnsafe,
  [Constants.priorities.DEFENCE]: findDefensePath,
}

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
  const otherSnakes = state.board.snakes.filter(snek => {
    if(snek.id === state.you.id) {
      return false
    }
    return true
  });
  const otherPathLengths = otherSnakes.map(snek => {
    const foundPath = pathing.getPath(state, snek, destination);
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
