module.exports = baseMap;

function baseMap(version, beatsPerMinute, beatsPerBar, noteJumpSpeed, shuffle, shufflePeriod, time, events) {
    this._version = version;
    this._beatsPerMinute = beatsPerMinute;
    this._beatsPerBar = beatsPerBar;
    this._noteJumpSpeed = noteJumpSpeed;
    this._shuffle = shuffle;
    this._shufflePeriod = shufflePeriod;
    this._time = time;
}

baseMap.prototype.setNJS = function(njs) { this._noteJumpSpeed = njs; }

baseMap.prototype.getVersion = function() { return this._version; }
baseMap.prototype.getBeatsPerMinute = function() { return this._beatsPerMinute; }
baseMap.prototype.getBeatsPerBar = function () { return this._beatsPerBar; }
baseMap.prototype.getNoteJumpSpeed = function () { return this._noteJumpSpeed; }
baseMap.prototype.getShuffle = function () { return this._shuffle; }
baseMap.prototype.getShufflePeriod = function() { return this._shufflePeriod; }
baseMap.prototype.getTime = function() { return this._time; }
