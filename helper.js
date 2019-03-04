/**
 * Converts an array coordinate returned by getPath to battleSnake object format
 * @param {*} arrayCoord 
 */
const coordinateToObject = arrayCoord => {
  return {
    x: arrayCoord[0],
    y: arrayCoord[1]  
  }
}

/**
 * Given our snake and a path to take return the first move to take (this move)
 * @param {*} ourSnake
 * @param {*} path
 */
const translateMove = (ourSnake, path) => {
  const ourHead = ourSnake.body.shift();
  const coordinateToMoveTo = path.shift();
  if (ourHead.x !== coordinateToMoveTo[0]) {
    if (coordinateToMoveTo[0] > ourHead.x) {
      return "right";
    }
    return "left";
  } else {
    if (coordinateToMoveTo[1] > ourHead.y) {
      return "down";
    }
    return "up";
  }
};

module.exports = {
  coordinateToObject,
  translateMove
}
