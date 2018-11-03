module.exports = eventPart;

function eventPart(filename) {
    this._name = filename;
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

eventPart.prototype.getName = function() { return this._name; }

eventPart.prototype.getEvents = function () { return this._events; }

eventPart.prototype.getLowestObject = function () {
    if (this._events.length > 0) {
        var lowestObj = this._events[0];

        for (let i = 0; i < this._events.length; i++) {
            const event = this._events[i];
            const time = event._time;

            if (time < lowestObj._time)
                lowestObj = event;
        }

        return lowestObj;
    }

    return undefined;
}

eventPart.prototype.getHighestObject = function () {
    if (this._events.length > 0) {
        var highestObj = this._events[0];

        for (let i = 0; i < this._events.length; i++) {
            const event = this._events[i];
            const time = event._time;

            if (time > highestObj._time)
                highestObj = event;
        }

        return highestObj;
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