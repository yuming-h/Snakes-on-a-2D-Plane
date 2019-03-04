const Constants = require('./Constants')
/**
 * Returns a list of priorities based on gameState in order of highest to lowest priority.
 * @param {*} state
 */
const priority = state => {
  const priorities = []
  if(state.you.health < Constants.thresholds.STARVING) {
    priorities.push(Constants.priorities.FOOD_STARVING)
  }
  else if(state.you.health < Constants.thresholds.HUNGRY) {
    priorities.push(Constants.priorities.FOOD)
  }
  //Might want to add checks for attacking (Only in 1v1 situations) and 
  //gaining space on the board when we are getting closed in on.
  priorities.push(Constants.priorities.DEFENCE)
  return priorities
}

module.exports = priority
