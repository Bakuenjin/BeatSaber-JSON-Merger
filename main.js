const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 840, minWidth: 840, height: 600, minHeight: 600, frame: false});
    // mainWindow.setMenu(null); 
    mainWindow.loadFile('main.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function minimize() {
    mainWindow.minimize();
}

function close() {
    mainWindow.close();
}

ipcMain.on('minimize', minimize);
ipcMain.on('close', close);