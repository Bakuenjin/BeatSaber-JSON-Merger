module.exports = mapManager;

const fs = require('fs');
const path = require('path');

const BaseMap = require("./baseMap");
const EventPart = require("./eventPart");
const MapPart = require("./mapPart");
const ObstaclePart = require("./obstaclePart");

function mapManager() {
    this._baseMap = undefined;
    this._eventParts = [];
    this._mapParts = [];
    this._obstacleParts = [];
    this._savePath = undefined
    this._baseLoaded = false;
    this._partsLoaded = false;
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

mapManager.prototype.loadParts = function (mapsPath) {
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

                eventPart.parseData(mapData["_events"]);
                mapPart.parseData(mapData["_notes"]);
                obstaclePart.parseData(mapData["_obstacles"]);

                this._eventParts.push(eventPart);
                this._mapParts.push(mapPart);
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
        if (a.getLowestTime() > b.getLowestTime())
            return 1;
        if (a.getLowestTime() < b.getLowestTime())
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

mapManager.prototype.validate = function (array) {
    var problems = [];
    if (array.length > 1) {
        for (let i = 0; i < array.length - 1; i++) {
            const part = array[i];
            const nextPart = array[i + 1];
            if (part.getHighestTime() >= nextPart.getLowestTime())
                problems.push("\n\t" + part.getHighestTime() + " (" + part.getName() + ")\n\tshould be lower than\n\t" + nextPart.getLowestTime() + " (" + nextPart.getName() + ")\n");
        }
    }
    return problems;
}

mapManager.prototype.validateEvents = function () {
    return this.validate(this._eventParts);
}

mapManager.prototype.validateNotes = function () {
    var problems = this.validate(this._mapParts);
    // console.log(problems);
    return problems;
}

mapManager.prototype.validateObstacles = function () {
    return this.validate(this._obstacleParts);
}

mapManager.prototype.connectEventParts = function () {
    if (this._eventParts.length > 0) {
        var allEvents = [];

        for (let i = 0; i < this._eventParts.length; i++) {
            const part = this._eventParts[i];
            allEvents = allEvents.concat(part.getEvents());
        }
        return allEvents;
    }
    return undefined;
}

mapManager.prototype.connectMapParts = function () {
    if (this._mapParts.length > 0) {
        var allNotes = [];

        for (let i = 0; i < this._mapParts.length; i++) {
            const part = this._mapParts[i];
            allNotes = allNotes.concat(part.getNotes());
        }
        return allNotes;
    }
    return undefined;
}

mapManager.prototype.connectObstacleParts = function () {
    if (this._obstacleParts.length > 0) {
        var allObstacles = [];

        for (let i = 0; i < this._obstacleParts.length; i++) {
            const part = this._obstacleParts[i];
            allObstacles = allObstacles.concat(part.getObstacles());
        }
        return allObstacles;
    }
    return undefined;
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