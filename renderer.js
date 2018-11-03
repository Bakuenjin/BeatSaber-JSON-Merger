const { dialog, shell } = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
//const shell = require('electron').remote.shell;
const path = require('path');
const fs = require('fs');
const MapManager = require("./logic/mapManager");

const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');

const baseDialogBtn = document.getElementById("base-dialog-btn");
const eventsDialogBtn = document.getElementById("events-dialog-btn");
const pathDialogBtn = document.getElementById("path-dialog-btn");
const outputDialogBtn = document.getElementById("output-dialog-btn");
const validateDataBtn = document.getElementById("load-data-btn");
const saveDataBtn = document.getElementById("save-data-btn");
const clearDataBtn = document.getElementById("clear-data-btn");

const baseNameParent = document.getElementById("base-parent");
const eventsNameParent = document.getElementById("events-parent");
const partsNameParent = document.getElementById("parts-parent");
const outputNameParent = document.getElementById("output-parent");

const baseNameDiv = document.getElementById("base-name");
const eventsNameDiv = document.getElementById("events-name");
const partsNameDiv = document.getElementById("parts-name");
const outputNameDiv = document.getElementById("output-name");

// const basePopup = document.getElementById('base-btn-info');
// const eventsPopup = document.getElementById('events-btn-info');
// const pathPopup = document.getElementById('parts-btn-info');
// const outputPopup = document.getElementById('output-btn-info');

const eventsDialogModeCbx = document.getElementById("toggle-events-cbx");
const validationDiv = document.getElementById("validation-output");
const errorLog = document.getElementById("error-log");

var mapManager = new MapManager();

var baseSelected = false;
var eventsSelected = false;
var directorySelected = false;
var saveSelected = false;

var eventSelectDirectory = false;
var savePath = "";

function tryUnlock() {
    if (mapManager.hasLoaded() && baseSelected && directorySelected && saveSelected) {
        validateDataBtn.disabled = false;
    }

}

function appendNames(names, div, parent) {
    div.innerHTML = "";
    names.forEach(name => {
        var nameDiv = document.createElement('div');
        nameDiv.classList.add("nav-file-name");
        nameDiv.innerText = name;
        div.appendChild(nameDiv);
    });
    parent.style.display = "block";
}

eventsDialogModeCbx.onchange = function () {
    if (eventsDialogModeCbx.checked) {
        eventSelectDirectory = true;
        eventsDialogBtn.innerText = "Select events directory";
    }
    else {
        eventSelectDirectory = false;
        eventsDialogBtn.innerText = "Select events file";
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
        mapManager.loadBaseMap(basePath[0]);
        appendNames([path.basename(basePath[0])], baseNameDiv, baseNameParent);
        baseSelected = true;
    }
    tryUnlock();
}

eventsDialogBtn.onclick = function () {
    eventsSelected = false;
    var eventsPath = undefined;
    if(eventSelectDirectory)
    {
        eventsPath = dialog.showOpenDialog({
            title: "Select events file or directory.",
            properties: [ "openDirectory" ]
        });
    
    }
    else {
        eventsPath = dialog.showOpenDialog({
            title: "Select events file or directory.",
            filters: [{
                name: "Beatmap",
                extensions: ['json']
            }]
        });
    }
    if (eventsPath != undefined) {
        mapManager.loadEventParts(eventsPath[0]);
        appendNames(mapManager.getEventpartNames(), eventsNameDiv, eventsNameParent);
        eventsSelected = true;
    }
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
        mapManager.loadParts(mapsPath[0])
        appendNames(mapManager.getMappartNames(), partsNameDiv, partsNameParent);
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
        mapManager.setSavePath(outputPath);
        savePath = path.dirname(outputPath);
        appendNames([outputPath], outputNameDiv, outputNameParent);
        saveSelected = true;
    }
    tryUnlock();
}

validateDataBtn.onclick = function () {
    var errorText = "Checking for problems...\n";
    var eventProblems = mapManager.validateEvents();
    var noteProblems = mapManager.validateNotes();
    var obstacleProblems = mapManager.validateObstacles();
    var noteWarnings = mapManager.validateTransition();

    if (eventProblems.length > 0) {
        errorText += "\nFound " + eventProblems.length + " problem(s) while validating events:\n";
        eventProblems.forEach(problem => {
            errorText += problem;
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
            errorText += problem;
        });
    }
    if(noteWarnings.length > 0) {
        errorText += "\nFound " + noteWarnings.length + " warning(s) while validating transitions:\n";
        noteWarnings.forEach(warning => {
            errorText += warning;
        })
    }

    if (eventProblems.length != 0 || noteProblems.length != 0 || obstacleProblems.length != 0) {
        errorLog.value = errorText;
        validationDiv.innerHTML = "INVALID";
        validationDiv.classList.remove("valid", "invalid", "warning");
        validationDiv.classList.add("invalid");
        saveDataBtn.disabled = true;
    }
    else if(noteWarnings.length > 0) {
        errorLog.value = errorText;
        validationDiv.innerHTML = "WARNING";
        validationDiv.classList.remove("valid", "invalid", "warning");
        validationDiv.classList.add("warning");
        saveDataBtn.disabled = false;
    }
    else {
        errorLog.value = "No problems found!"
        validationDiv.innerHTML = "VALID";
        validationDiv.classList.remove("valid", "invalid", "warning");
        validationDiv.classList.add("valid");
        saveDataBtn.disabled = false;
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
    var sidenavText = document.getElementsByClassName("nav-file-name");
    validateDataBtn.disabled = true;
    saveDataBtn.disabled = true;
    baseSelected = false;
    directorySelected = false;
    saveSelected = false;
    errorLog.value = "";
    for (let i = 0; i < sidenavText.length; i++) {
        const textDiv = sidenavText[i];
        textDiv.remove();
    }

    baseNameParent.style.display = "none";
    eventsNameParent.style.display = "none";
    partsNameParent.style.display = "none";
    outputNameParent.style.display = "none";

    baseNameDiv.innerHTML = "";
    eventsNameDiv.innerHTML = "";
    partsNameDiv.innerHTML = "";
    outputNameDiv.innerHTML = "";

    validationDiv.classList.remove("valid", "invalid");
}

minimizeBtn.onclick = function () {
    ipcRenderer.send("minimize");
}

closeBtn.onclick = function () {
    ipcRenderer.send("close");
}
