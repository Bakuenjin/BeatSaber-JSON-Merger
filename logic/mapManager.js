module.exports = mapManager;

const fs = require('fs');
const path = require('path');

const BaseMap = require("./baseMap");
const EventPart = require("./eventPart");
const MapPart = require("./mapPart");
const ObstaclePart = require("./obstaclePart");
const MapValidater = require("./mapValidater");

function mapManager() {
    this._validater = new MapValidater();
    this._baseMap = undefined;
    this._eventParts = [];
    this._mapParts = [];
    this._obstacleParts = [];
    this._savePath = undefined
    this._baseLoaded = false;
    this._partsLoaded = false;
    this._ownEvents = false;
}

mapManager.prototype.loadBaseMap = function (path) {
    this._baseMap = undefined;
    this._baseLoaded = false;
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        const baseData = JSON.parse(data);

        const version = baseData["_version"];
        const beatsPerMinute = baseData["_beatsPerMinute"];
        const beatsPerBar = baseData["_beatsPerBar"];
        const noteJumpSpeed = baseData["_noteJumpSpeed"];
        const shuffle = baseData["_shuffle"];
        const shufflePeriod = baseData["_shufflePeriod"];
        const time = baseData["_time"];

        this._baseMap = new BaseMap(version, beatsPerMinute, beatsPerBar, noteJumpSpeed, shuffle, shufflePeriod, time);
        this._baseLoaded = true;
    }
}

mapManager.prototype.loadEventParts = function (eventPath) {
    if (fs.existsSync(eventPath)) {
        var files = [];
        var dirname = "";
        if (fs.lstatSync(eventPath).isDirectory()) {
            dirname = eventPath;
            files = fs.readdirSync(eventPath);
        }
        else if (fs.lstatSync(eventPath).isFile()) {
            dirname = path.join(eventPath, "..");
            files.push(path.basename(eventPath));
        }
        if (files.length > 0) {
            this._eventParts = [];
            files.forEach(file => {
                if (path.extname(file) == ".json") {
                    const filePath = path.join(dirname, file);
                    const data = fs.readFileSync(filePath);
                    const mapData = JSON.parse(data);

                    var eventPart = new EventPart(file);
                    eventPart.parseData(mapData["_events"]);
                    if (eventPart._events.length > 0)
                        this._eventParts.push(eventPart);
                }
            });

            if (this._eventParts.length > 0)
                this._ownEvents = true;
        }
    }
}

mapManager.prototype.loadParts = function (mapsPath) {
    if (!this._ownEvents)
        this._eventParts = [];
    this._mapParts = [];
    this._obstacleParts = [];
    this._partsLoaded = false;

    if (fs.existsSync(mapsPath)) {
        var files = fs.readdirSync(mapsPath);

        files.forEach(file => {
            if (path.extname(file) == ".json") {
                const filePath = path.join(mapsPath, file);
                const data = fs.readFileSync(filePath);
                const mapData = JSON.parse(data);


                var eventPart = new EventPart(file);
                var mapPart = new MapPart(file);
                var obstaclePart = new ObstaclePart(file);

                if (!this._ownEvents)
                    eventPart.parseData(mapData["_events"]);
                mapPart.parseData(mapData["_notes"]);
                obstaclePart.parseData(mapData["_obstacles"]);

                if (eventPart._events.length > 0)
                    this._eventParts.push(eventPart);
                if (mapPart._notes.length > 0)
                    this._mapParts.push(mapPart);
                if (obstaclePart._obstacles.length > 0)
                    this._obstacleParts.push(obstaclePart);
            }
        });

        this.sortEventParts();
        this.sortMapParts();
        this.sortObstacleParts();
        this._partsLoaded = true;
    }
}

mapManager.prototype.hasLoaded = function () {
    return this._baseLoaded && this._partsLoaded;
}

mapManager.prototype.setSavePath = function (savePath) {
    this._savePath = savePath;
}

mapManager.prototype.sort = function (array) {
    array.sort((a, b) => {
        var first = a.getLowestObject();
        var second = b.getLowestObject();
        if (first._time > second._time)
            return 1;
        if (first._time < second._time)
            return -1;
        return 0;
    })
}

mapManager.prototype.sortEventParts = function () {
    this.sort(this._eventParts);
}

mapManager.prototype.sortMapParts = function () {
    this.sort(this._mapParts);
}

mapManager.prototype.sortObstacleParts = function () {
    this.sort(this._obstacleParts);
}

mapManager.prototype.validateTransition = function () {
    var warnings = [];
    if (this._mapParts.length > 1) {
        for (let i = 0; i < this._mapParts.length - 1; i++) {
            const part = this._mapParts[i];
            const nextPart = this._mapParts[i + 1];
            if (!this._validater.validateTransition(part, nextPart)) {
                warnings.push("\n\t" + part.getHighestObject()._time + " (" + part.getName() + ")\n\t\thas a bad transition to\n\t" + nextPart.getLowestObject()._time + " (" + nextPart.getName() + ")\n");
            }
        }
    }
    return warnings;
}

mapManager.prototype.validate = function (array) {
    var problems = [];
    if (array.length > 1) {
        for (let i = 0; i < array.length - 1; i++) {
            const part = array[i];
            const nextPart = array[i + 1];
            if (!this._validater.validateBounds(part, nextPart)) {
                const partTime = Math.round(part.getHighestObject()._time * 100) / 100;
                const nextPartTime = Math.round(nextPart.getLowestObject()._time * 100) / 100
                problems.push("\n\t" + partTime + " (" + part.getName() + ")\n\t\tshould be lower than\n\t" + nextPartTime + " (" + nextPart.getName() + ")\n");
            }
        }
    }
    return problems;
}

mapManager.prototype.validateEvents = function () {
    return this.validate(this._eventParts);
}

mapManager.prototype.validateNotes = function () {
    var problems = this.validate(this._mapParts);
    return problems;
}

mapManager.prototype.validateObstacles = function () {
    return this.validate(this._obstacleParts);
}

mapManager.prototype.connectEventParts = function () {
    var allEvents = [];

    for (let i = 0; i < this._eventParts.length; i++) {
        const part = this._eventParts[i];
        allEvents = allEvents.concat(part.getEvents());
    }
    return allEvents;
}

mapManager.prototype.connectMapParts = function () {
    var allNotes = [];

    for (let i = 0; i < this._mapParts.length; i++) {
        const part = this._mapParts[i];
        allNotes = allNotes.concat(part.getNotes());
    }
    return allNotes;
}

mapManager.prototype.connectObstacleParts = function () {
    var allObstacles = [];

    for (let i = 0; i < this._obstacleParts.length; i++) {
        const part = this._obstacleParts[i];
        allObstacles = allObstacles.concat(part.getObstacles());
    }
    return allObstacles;
}

mapManager.prototype.build = function () {
    if (fs.existsSync(path.dirname(this._savePath))) {
        var eventData = this.connectEventParts();
        var mapData = this.connectMapParts();
        var obstacleData = this.connectObstacleParts();

        if (eventData != undefined && mapData != undefined && obstacleData != undefined) {
            var fullObj = {
                _version: this._baseMap.getVersion(),
                _beatsPerMinute: this._baseMap.getBeatsPerMinute(),
                _beatsPerBar: this._baseMap.getBeatsPerBar(),
                _noteJumpSpeed: this._baseMap.getNoteJumpSpeed(),
                _shuffle: this._baseMap.getShuffle(),
                _shufflePeriod: this._baseMap.getShufflePeriod(),
                _time: this._baseMap.getTime(),
                _events: eventData,
                _notes: mapData,
                _obstacles: obstacleData
            }

            fs.writeFileSync(this._savePath, JSON.stringify(fullObj), {
                encoding: 'utf-8'
            });

            return true;
        }
    }
    return false;
}

mapManager.prototype.getFilenames = function (array) {
    var names = [];

    array.forEach(element => {
        names.push(element.getName());
    });

    return names;
}

mapManager.prototype.getEventpartNames = function () {
    return this.getFilenames(this._eventParts);
}

mapManager.prototype.getMappartNames = function () {
    return this.getFilenames(this._mapParts);
}

mapManager.prototype.getObstaclepartNames = function () {
    return this.getFilenames(this._obstacleParts);
}

mapManager.prototype.validateNoteDirection = function (first, second) {
    const distance = first._time - second._time;
    const directions = [0, 5, 3, 7, 1, 6, 2, 4];
    const firstCD = directions.indexOf(first._cutDirection);
    const secondCD = directions.indexOf(second._cutDirection);
    const diff = Math.abs(Math.abs((secondCD - 4) - (firstCD - 4)) - 4);
    if (diff < 2 || diff == 2 && distance > 0.45)
        return true;
    return false;
}