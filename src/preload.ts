import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('api', {

    handleSetBatteryLevel: (handler: (e: IpcRendererEvent, level: number) => void) => ipcRenderer.on('battery-level', handler),

    setWindowPos: (id: number, x: number, y: number) => ipcRenderer.send('setWinPos', id, x, y)
})

