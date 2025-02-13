import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/logo.png?asset'
import db from './db.js'

// async function foo(event, data) {
//   try {
//     console.log(data)
//     dialog.showMessageBox({ message: 'message back' })
//   } catch (e) {
//     dialog.showErrorBox('Ошибка', e)
//   }
// }

async function getPartners() {
  try {
    const res = await db.query('SELECT * FROM persons');
    return res.rows;
  } catch (error) {
    console.log('Request has been error!')
  }
}

async function getPersonsJob() {
  try {
    const res = await db.query('SELECT * FROM persons_job');
    return res.rows;
  } catch (error) {
    console.log('Request has been error!')
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.webContents.openDevTools(); 
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  await db.connect(); // connect db

  // ipcMain.handle('sendSignal', foo)
  ipcMain.handle('getPartners', getPartners)
  ipcMain.handle('getPersonsJob', getPersonsJob)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
