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

// type 0 = red
// type 1 = blue
mapPart.prototype.getLowestObject = function (color = undefined) {
    if (this._notes.length > 0) {
        var lowestObj = undefined;
        if(color == 'blue') {
            for (let i = 0; i < this._notes.length; i++) {
                const note = this._notes[i];
                if(note._type == 1) {
                    if(lowestObj === undefined)
                        lowestObj = note;
                    else if(note._time < lowestObj._time)
                        lowestObj = note;
                }
            }
        }
        else if(color == 'red') {
            for (let i = 0; i < this._notes.length; i++) {
                const note = this._notes[i];
                if(note._type == 0) {
                    if(lowestObj === undefined)
                        lowestObj = note;
                    else if(note._time < lowestObj._time)
                        lowestObj = note;
                }
            }
        }
        else {
            lowestObj = this._notes[0];
            for (let i = 1; i < this._notes.length; i++) {
                const note = this._notes[i];
                const time = note._time;
    
                if (time < lowestObj._time)
                    lowestObj = note;
            }
        }
        return lowestObj;
    }

    return undefined;
}

mapPart.prototype.getHighestObject = function (color = undefined) {
    if (this._notes.length > 0) {
        var highestObj = undefined;
        if(color == 'blue') {
            for (let i = 0; i < this._notes.length; i++) {
                const note = this._notes[i];
                if(note._type == 1) {
                    if(highestObj === undefined)
                        highestObj = note;
                    else if(note._time > highestObj._time)
                        highestObj = note;
                }
            }
        }
        else if(color == 'red') {
            for (let i = 0; i < this._notes.length; i++) {
                const note = this._notes[i];
                if(note._type == 0) {
                    if(highestObj === undefined)
                        highestObj = note;
                    else if(note._time > highestObj._time)
                        highestObj = note;
                }
            }
        }
        else {
            highestObj = this._notes[0];
            for (let i = 1; i < this._notes.length; i++) {
                const note = this._notes[i];
                const time = note._time;
    
                if (time > highestObj._time)
                    highestObj = note;
            }
        }
        return highestObj;
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