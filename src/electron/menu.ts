import { BrowserWindow, Menu, app } from 'electron';
import { ipcWebContentSend, isDev } from './util.js';

export function createMenu(mainWindow: BrowserWindow) {
    Menu.setApplicationMenu(
        Menu.buildFromTemplate([
            {
                label: process.platform === 'darwin' ? undefined : 'App',
                type: 'submenu',
                submenu: [
                    {
                        label: 'Quit',
                        click: app.quit,
                    },
                    {
                        label: 'DevTools',
                        click: () => mainWindow.webContents.openDevTools(),
                        visible: isDev(),
                    },
                ],
            },
            {
                label: 'View',
                type: 'submenu',
                submenu: [
                    {
                        label: 'CPU',
                        click: () =>
                            ipcWebContentSend('changeView', mainWindow.webContents, 'CPU'),
                    },
                    {
                        label: 'RAM',
                        click: () =>
                            ipcWebContentSend('changeView', mainWindow.webContents, 'RAM'),
                    },
                    {
                        label: 'STORAGE',
                        click: () =>
                            ipcWebContentSend(
                                'changeView',
                                mainWindow.webContents,
                                'STORAGE'
                            ),
                    },
                ],
            },
        ])
    );
}
