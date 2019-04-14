const path = require('path')
const { app, BrowserWindow, Menu, shell } = require('electron')
const updater = require('electron-simple-updater')
const { isDarwin } = require('./utils')
const config = require('./config')
const { appMenu, contextMenu } = require('./menu')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

app.setAppUserModelId('com.minws.devdoc')
app.commandLine.appendSwitch('ignore-certificate-errors')

let mainWindow
const mainURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`
let isQuitting = false

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  process.exit()
}

if (mainWindow) {
  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }
  if (!mainWindow.isVisible()) {
    mainWindow.show()
  }
  mainWindow.focus()
}

function createMainWindow() {
  const windowState = config.get('windowState')

  const win = new BrowserWindow({
    show: false, // Hide application until your page has loaded
    title: app.getName(),
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: config.get('minWidth'),
    minHeight: config.get('minHeight'),
    // titleBarStyle: 'hiddenInset',
    alwaysOnTop: config.get('alwaysOnTop'),
    autoHideMenuBar: config.get('autoHideMenuBar'),
    backgroundColor: '#f2f2f2',
    icon: path.join(__dirname, '../../build/icons/256x256.png')
  })

  if (isDarwin) {
    win.setSheetOffset(40)
  }

  win.loadURL(mainURL)

  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.on('context-menu', e => {
    contextMenu.popup()
  })

  win.on('close', e => {
    if (!isQuitting) {
      e.preventDefault()
      isDarwin ? app.hide() : win.hide()
    }
  })

  return win
}

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu)
  const { webContents } = (mainWindow = createMainWindow())
  webContents.on('dom-ready', () => {
    // webContents.insertCSS(fs.readFileSync(path.join(__dirname, './index.css'), 'utf8'))
  })
  webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
  updater.init({
    checkUpdateOnStart: true,
    autoDownload: false
  })
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  isQuitting = true
  if (!mainWindow.isFullScreen()) {
    config.set('windowState', mainWindow.getBounds())
  }
})

app.on('ready', () => {})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
