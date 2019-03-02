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

module.exports = {
  coordinateToObject
}
