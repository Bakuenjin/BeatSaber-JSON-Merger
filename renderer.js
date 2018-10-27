const dialog = require('electron').remote.dialog;
const path = require('path');
const mapManager = new (require("./logic/mapManager"));

const baseDialogBtn = document.getElementById("base-dialog-btn");
const pathDialogBtn = document.getElementById("path-dialog-btn");
const outputDialogBtn = document.getElementById("output-dialog-btn");
const loadDataBtn = document.getElementById("load-data-btn");
const saveDataBtn = document.getElementById("save-data-btn");

const baseInput = document.getElementById("base-input");
const partsInput = document.getElementById("parts-input");
const outputInput = document.getElementById("output-input"); // I dare you to question my names

const validationDiv = document.getElementById("validation-output");

baseDialogBtn.onclick = function () {
    var basePath = dialog.showOpenDialog({
        title: "Path to base file",
        filters: [{
            name: 'Beatmap',
            extensions: ['json']
        }]
    });

    if (basePath != undefined) {
        baseInput.value = basePath[0];
        mapManager.loadBaseMap(basePath[0]);
    }
}

pathDialogBtn.onclick = function () {
    var mapsPath = dialog.showOpenDialog({
        title: "Path to directory containing all .json files",
        properties: [
            "openDirectory"
        ]
    });

    if (mapsPath != undefined) {
        partsInput.value = mapsPath[0];
        mapManager.loadParts(mapsPath[0])
    }
}

outputDialogBtn.onclick = function () {
    var outputPath = dialog.showSaveDialog({
        title: "Path to product root directory",
        filters: [{
            name: 'Beatmap',
            extensions: ['json']
        }]
    });

    if (outputPath != undefined) {
        outputInput.value = outputPath;
        mapManager.setSavePath(outputPath);
    }
}

loadDataBtn.onclick = function () {
    if (mapManager.validateParts()) {
        validationDiv.innerHTML = "VALID";
        validationDiv.classList.remove("valid", "invalid");
        validationDiv.classList.add("valid");
    }
    else {
        validationDiv.innerHTML = "INVALID";
        validationDiv.classList.remove("valid", "invalid");
        validationDiv.classList.add("valid");
    }
}

saveDataBtn.onclick = function () {
    mapManager.build();
}