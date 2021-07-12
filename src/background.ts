'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const { autoUpdater } = require('electron-updater')
const singleInstance = app.requestSingleInstanceLock()
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win: BrowserWindow

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      enableRemoteModule: true
    }
  })

  // win.setMenuBarVisibility(false)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // Ipc receiver
  ipcMain.on('min', () => {
    win.minimize()
  })
  ipcMain.on('max', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize();
    }
  })
  ipcMain.on('close', () => {
    win.close()
  })

  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

if (!singleInstance) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    win.focus()
  })
  // Create windows, load the rest of the app, etc...
  app.whenReady().then(() => {
    console.log('Starting....')    
  }).then(() => {
    setTimeout(() => {
      // Check la différence entre checkForUpdates & AndNotify (Apparemment, AndNotify throw a notification windows)
      if(isDevelopment){ autoUpdater.checkForUpdates() } 
      else { autoUpdater.checkForUpdatesAndNotify() }
    }, 3000)

    autoUpdater.on('checking-for-update', () => {
      console.log('check update')
    }).on('update-available', (info: any) => {
      console.log('update found', info)
    }).on('update-not-available', (info: any) => {
      console.log('update not found', info)
      createWindow()
    }).on('error', (err:any) => {
      console.log('update error: ' , err)
    }).on('download-progress', (progressObj:any) => {
      // Debug - show in console (Electron) the progression
      let log_message = 'Download speed: ' + progressObj.bytesPerSecond
      log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
      log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
      console.log(log_message)

      // sendStatusToWindow(splash, 'Téléchargement en cours...')
      // sendSpeedDownload(splash, progressObj.bytesPerSecond)
      // sendPercentageDownload(splash, progressObj.percent)
    }).on('update-downloaded', (info:any) => {
      console.log('Téléchargement terminé', info)
      setTimeout(() => {
        console.log("Lancement de l'install")
        setTimeout(() => {
          autoUpdater.quitAndInstall(true, true)
        }, 2000)
      }, 1000)
    })
  })
}
