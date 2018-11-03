module.exports = mapValidater;

function mapValidater() {

}

mapValidater.prototype.validateBounds = function(firstPart, secondPart) {
    const firstBound = firstPart.getHighestObject();
    const secondBound = secondPart.getLowestObject();

    return firstBound._time < secondBound._time;
}

mapValidater.prototype.validateTransition = function(firstPart, secondPart) {
    const directions = [0,5,3,7,1,6,2,4];
    const firstRedNote = firstPart.getHighestObject('red');
    const firstBlueNote = firstPart.getHighestObject('blue');
    const secondRedNote = secondPart.getLowestObject('red');
    const secondBlueNote = secondPart.getLowestObject('blue');

    const blueDistance = secondBlueNote._time - firstBlueNote._time;
    const redDistance = secondRedNote._time - firstRedNote._time;

    if(blueDistance > 1.95 && redDistance > 1.95)
        return true;

    const firstRedCD = directions.indexOf(firstRedNote._cutDirection);
    const secondRedCD = directions.indexOf(secondRedNote._cutDirection);
    const firstBlueCD = directions.indexOf(firstBlueNote._cutDirection);
    const secondBlueCD = directions.indexOf(secondBlueNote._cutDirection);

    const redDiff = Math.abs(Math.abs((secondRedCD - 4) - (firstRedCD - 4)) - 4);
    const blueDiff = Math.abs(Math.abs((secondBlueCD - 4) - (firstBlueCD - 4)) - 4);

    return (redDiff < 2 || redDiff == 2 && redDistance > 0.45) &&
           (blueDiff < 2 || blueDiff == 2 && blueDistance > 0.45);
}

mapValidater.prototype.validatePattern = function(part) {
    // LATER
}