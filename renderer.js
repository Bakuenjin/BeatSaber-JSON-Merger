const { dialog, shell } = require('electron').remote;
//const shell = require('electron').remote.shell;
const path = require('path');
const MapManager = require("./logic/mapManager");

const baseDialogBtn = document.getElementById("base-dialog-btn");
const pathDialogBtn = document.getElementById("path-dialog-btn");
const outputDialogBtn = document.getElementById("output-dialog-btn");
const validateDataBtn = document.getElementById("load-data-btn");
const saveDataBtn = document.getElementById("save-data-btn");
const clearDataBtn = document.getElementById("clear-data-btn");

const baseInput = document.getElementById("base-input");
const partsInput = document.getElementById("parts-input");
const outputInput = document.getElementById("output-input"); // I dare you to question my names

const validationDiv = document.getElementById("validation-output");
const errorLog = document.getElementById("error-log");

var mapManager = new MapManager();

var baseSelected = false;
var directorySelected = false;
var saveSelected = false;
var savePath = "";

function tryUnlock() {
    if (mapManager.hasLoaded() && baseSelected && directorySelected && saveSelected) {
        validateDataBtn.disabled = false;
    }

}

baseDialogBtn.onclick = function () {
    baseSelected = false;
    var basePath = dialog.showOpenDialog({
        title: "Path to base file.",
        filters: [{
            name: 'Beatmap',
            extensions: ['json']
        }]
    });

    if (basePath != undefined) {
        baseInput.value = basePath[0];
        mapManager.loadBaseMap(basePath[0]);
        baseSelected = true;
    }
    tryUnlock();
}

pathDialogBtn.onclick = function () {
    directorySelected = false;
    var mapsPath = dialog.showOpenDialog({
        title: "Path to directory containing all .json files.",
        properties: [
            "openDirectory"
        ]
    });

    if (mapsPath != undefined) {
        partsInput.value = mapsPath[0];
        mapManager.loadParts(mapsPath[0])
        directorySelected = true;
    }
    tryUnlock();
}

outputDialogBtn.onclick = function () {
    saveSelected = false;
    var outputPath = dialog.showSaveDialog({
        title: "Save file.",
        filters: [{
            name: 'Beatmap',
            extensions: ['json']
        }]
    });

    if (outputPath != undefined) {
        outputInput.value = outputPath;
        mapManager.setSavePath(outputPath);
        savePath = path.dirname(outputPath);
        saveSelected = true;
    }
    tryUnlock();
}

validateDataBtn.onclick = function () {
    var errorText = "Checking for problems...\n";
    var eventProblems = mapManager.validateEvents();
    var noteProblems = mapManager.validateNotes();
    var obstacleProblems = mapManager.validateObstacles();

    if (eventProblems.length > 0) {
        errorText += "\nFound " + eventProblems.length + " problem(s) while validating events:\n";
        eventProblems.forEach(problem => {
            errorText += "Time: " + problem + "\n";
        });
    }
    if (noteProblems.length > 0) {
        errorText += "\nFound " + noteProblems.length + " problem(s) while validating notes:\n";
        noteProblems.forEach(problem => {
            errorText += problem;
        });
    }
    if (obstacleProblems.length > 0) {
        errorText += "\nFound " + obstacleProblems.length + " problem(s) while validating obstacles:\n";
        obstacleProblems.forEach(problem => {
            errorText += "Time: " + problem + "\n";
        });
    }

    if (eventProblems.length == 0 && noteProblems.length == 0 && obstacleProblems.length == 0) {
        errorLog.value = "No problems found!"
        validationDiv.innerHTML = "VALID";
        validationDiv.classList.remove("valid", "invalid");
        validationDiv.classList.add("valid");
        saveDataBtn.disabled = false;
    }
    else {
        errorLog.value = errorText;
        validationDiv.innerHTML = "INVALID";
        validationDiv.classList.remove("valid", "invalid");
        validationDiv.classList.add("invalid");
        saveDataBtn.disabled = true;
    }
}

saveDataBtn.onclick = function () {
    if (mapManager.build())
        shell.openExternal(savePath);
    else
        dialog.showErrorBox("Failed creating .json file.", "Something went wrong. Make sure you don't modify any paths after selecting them.");
}

clearDataBtn.onclick = function () {
    mapManager = new MapManager();
    validateDataBtn.disabled = true;
    saveDataBtn.disabled = true;
    baseSelected = false;
    directorySelected = false;
    saveSelected = false;
    baseInput.value = "";
    partsInput.value = "";
    outputInput.value = "";
    errorLog.value = "";
    validationDiv.classList.remove("valid", "invalid");
}