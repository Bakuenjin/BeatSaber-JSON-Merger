module.exports = obstaclePart;

function obstaclePart() {
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

obstaclePart.prototype.getObstacles = function () {
    return this._obstacles;
}

obstaclePart.prototype.getLowestTime = function () {
    if (this._obstacles.length > 0) {
        var lowestTime = this._obstacles[0]._time;

        for (let i = 0; i < this._obstacles.length; i++) {
            const obstacle = this._obstacles[i];
            const time = obstacle._time;

            if (time < lowestTime)
                lowestTime = time;
        }

        return lowestTime;
    }

    return undefined;
}

obstaclePart.prototype.getHighestTime = function () {
    if (this._obstacles.length > 0) {
        var highestTime = this._obstacles[0]._time;

        for (let i = 0; i < this._obstacles.length; i++) {
            const obstacle = this._obstacles[i];
            const time = obstacle._time;

            if (time > highestTime)
                highestTime = time;
        }

        return highestTime;
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