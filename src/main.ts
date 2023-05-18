import { app, BrowserView, BrowserWindow, ipcMain } from "electron"
import * as path from "path"

import batteryLevel = require('battery-level')

declare global {
    interface Window {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      api: any;
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
        }
    })

    mainWindow.setFullScreen(true)

    mainWindow.loadFile(path.join(__dirname, "../pages/index.html"))

    mainWindow.webContents.openDevTools()

    mainWindow.webContents.setVisualZoomLevelLimits(1, 3)

    setInterval(() => {
        batteryLevel().then(level => {
            mainWindow.webContents.send('battery-level', level)
        })
    }, 10000)

    const view = new BrowserView({ 
        webPreferences: {
            nodeIntegration: false,
            sandbox: true,
            partition: 'persist:userSession',
            javascript: true,
            webSecurity: true,
            allowRunningInsecureContent: false,
            contextIsolation: true,
            safeDialogs: true,
            autoplayPolicy: 'user-gesture-required',
            minimumFontSize: 6, // Resemble Chrome's settings
            webviewTag: false,
            zoomFactor: 1.0,
            navigateOnDragDrop: true,
            scrollBounce: true
        }
    })

    mainWindow.addBrowserView(view)

    view.setBounds({ x: 0, y: 52, width: 850, height: 600 })

    view.setBackgroundColor('#fff')

    view.webContents.loadURL('https://google.com/')

    view.webContents.openDevTools({mode: 'right'})

    view.webContents.setWindowOpenHandler((details) => {
        view.webContents.loadURL(details.url)
        return { action: "deny" }
    })

    ipcMain.on('setWinPos', (_e: Event, id: number, x: number, y: number) => {
        view.setBounds({ x: x, y: y + (mainWindow.isFullScreen() ? 30 : 52), width: 850, height: 650 })
    })
}


app.whenReady().then(() => {
    createWindow()
})