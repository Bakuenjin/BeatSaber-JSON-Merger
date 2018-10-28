const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1000, height: 600, frame: false});
    //mainWindow.setMenu(null); resizable: false
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