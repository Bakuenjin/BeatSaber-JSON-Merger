module.exports = obstaclePart;

function obstaclePart(filename) {
    this._name = filename;
    this._obstacles = [];
}

obstaclePart.prototype.parseData = function (obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];

        this._obstacles.push(obstacleObj = {
            _time: obstacle["_time"],
            _lineIndex: obstacle["_lineIndex"],
            _type: obstacle["_type"],
            _duration: obstacle["_duration"],
            _width: obstacle["_width"]
        });
    }
}

obstaclePart.prototype.getName = function() { return this._name; }

obstaclePart.prototype.getObstacles = function () {
    return this._obstacles;
}

obstaclePart.prototype.getLowestObject = function () {
    if (this._obstacles.length > 0) {
        var lowestObj = this._obstacles[0];

        for (let i = 0; i < this._obstacles.length; i++) {
            const obstacle = this._obstacles[i];
            const time = obstacle._time;

            if (time < lowestObj._time)
                lowestObj = obstacle;
        }

        return lowestObj;
    }

    return undefined;
}

obstaclePart.prototype.getHighestObject = function () {
    if (this._obstacles.length > 0) {
        var highestObj = this._obstacles[0];

        for (let i = 0; i < this._obstacles.length; i++) {
            const obstacle = this._obstacles[i];
            const time = obstacle._time;

            if (time > highestObj._time)
                highestObj = time;
        }

        return highestObj;
    }

    return undefined;
}

obstaclePart.prototype.sort = function () {
    this._obstacles.sort((a, b) => {
        if (a._time > b._time)
            return 1;
        if (a._time < b._time)
            return -1;
        return 0;
    });
}