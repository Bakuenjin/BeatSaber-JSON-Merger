module.exports = eventPart;

function eventPart() {
    this._events = [];
}

eventPart.prototype.parseData = function (events) {
    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        this._events.push(eventObj = {
            _time: event["_time"],
            _type: event["_type"],
            _value: event["_value"],
        });
    }
}

eventPart.prototype.getEvents = function () {
    return this._events;
}

eventPart.prototype.getLowestTime = function () {
    if (this._events.length > 0) {
        var lowestTime = this._events[0]._time;

        for (let i = 0; i < this._events.length; i++) {
            const event = this._events[i];
            const time = event._time;

            if (time < lowestTime)
                lowestTime = time;
        }

        return lowestTime;
    }

    return undefined;
}

eventPart.prototype.getHighestTime = function () {
    if (this._events.length > 0) {
        var highestTime = this._events[0]._time;

        for (let i = 0; i < this._events.length; i++) {
            const event = this._events[i];
            const time = event._time;

            if (time > highestTime)
                highestTime = time;
        }

        return highestTime;
    }

    return undefined;
}

eventPart.prototype.sort = function () {
    this._events.sort((a, b) => {
        if (a._time > b._time)
            return 1;
        if (a._time < b._time)
            return -1;
        return 0;
    });
}