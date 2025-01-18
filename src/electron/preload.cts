import { IpcRendererEvent } from "electron"

const electron = require("electron")

electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) => ipcOn("statistics", (stats) => {
        callback(stats)
    })
    ,
    getStaticData: () => ipcInvoke("getStaticData")
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMaping>(
    key: Key
): Promise<EventPayloadMaping[Key]> {
    return electron.ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMaping>(
    key: Key,
    callback: (payload: EventPayloadMaping[Key]) => void
) {
    const cb = (_: IpcRendererEvent, payload: any) => callback(payload)
    electron.ipcRenderer.on("statistics", cb)
    return () => electron.ipcRenderer.off("statistics", cb)
}