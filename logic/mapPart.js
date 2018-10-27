module.exports = mapPart;

function mapPart(filename) {
    this._name = filename;
    this._notes = [];
}

mapPart.prototype.parseData = function (notes) {
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const time = note["_time"];
        const lineIndex = note["_lineIndex"];
        const lineLayer = note["_lineLayer"];
        const type = note["_type"];
        const cutDirection = note["_cutDirection"];

        this._notes.push(noteObj = {
            _time: time,
            _lineIndex: lineIndex,
            _lineLayer: lineLayer,
            _type: type,
            _cutDirection: cutDirection
        });
    }
}

mapPart.prototype.getName = function() { return this._name; }

mapPart.prototype.getNotes = function () {
    return this._notes;
}

mapPart.prototype.getLowestTime = function () {
    if (this._notes.length > 0) {
        var lowestTime = this._notes[0]._time;

        for (let i = 0; i < this._notes.length; i++) {
            const note = this._notes[i];
            const time = note._time;

            if (time < lowestTime)
                lowestTime = time;
        }

        return lowestTime;
    }

    return undefined;
}

mapPart.prototype.getHighestTime = function () {
    if (this._notes.length > 0) {
        var highestTime = this._notes[0]._time;

        for (let i = 0; i < this._notes.length; i++) {
            const note = this._notes[i];
            const time = note._time;

            if (time > highestTime)
                highestTime = time;
        }

        return highestTime;
    }

    return undefined;
}

mapPart.prototype.sort = function () {
    this._notes.sort((a, b) => {
        if (a._time > b._time)
            return 1;
        if (a._time < b._time)
            return -1;
        return 0;
    });
}