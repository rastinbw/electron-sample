import { ipcMain, WebContents, WebFrameMain } from "electron"
import { getUIPath } from "./pathResolver.js"
import { pathToFileURL } from 'node:url'

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development'
}

export function ipcMainHandle<Key extends keyof EventPayloadMaping>(
    key: Key,
    handler: () => EventPayloadMaping[Key]
) {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame)
        return handler()
    })
}

export function ipcWebContentSend<Key extends keyof EventPayloadMaping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMaping[Key]
) {
    webContents.send(key, payload)
}

export function validateEventFrame(frame: WebFrameMain | null) {
    if (frame == null){
        throw new Error('NULL Frame')
    }

    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return
    }

    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicios Event')
    }
}