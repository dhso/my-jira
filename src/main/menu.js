const path = require('path')
const electron = require('electron')
const { app, shell, dialog, Menu } = electron
const { isDarwin, sendAction } = require('./utils')
const pkg = require('../../package.json')
const config = require('./config')

const settingsItems = [
  {
    label: 'Auto Hide Menu Bar',
    type: 'checkbox',
    checked: config.get('autoHideMenuBar'),
    visible: !isDarwin,
    click(menuItem, focusedWindow) {
      config.set('autoHideMenuBar', !menuItem.checked)
      focusedWindow.setAutoHideMenuBar(menuItem.checked)
      focusedWindow.setMenuBarVisibility(!menuItem.checked)
    }
  }
]

const editItems = [
  { role: 'undo' },
  { role: 'redo' },
  { type: 'separator' },
  { role: 'cut' },
  { role: 'copy' },
  { role: 'paste' },
  { role: 'delete' },
  { type: 'separator' },
  { role: 'selectall' },
  { type: 'separator' },
  {
    label: 'Search',
    accelerator: 'Cmd+F',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'show:search')
    }
  },
  { type: 'separator' }
]

const windowItems = [
  {
    label: 'Maximize',
    click(menuItem, focusedWindow) {
      const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
      focusedWindow.setBounds({
        x: 0,
        y: 0,
        width: parseInt(width),
        height: parseInt(height)
      })
    }
  },
  {
    type: 'checkbox',
    label: 'Always on Top',
    accelerator: 'CmdOrCtrl+Shift+T',
    checked: config.get('alwaysOnTop'),
    click(menuItem, focusedWindow) {
      config.set('alwaysOnTop', menuItem.checked)
      focusedWindow.setAlwaysOnTop(menuItem.checked)
    }
  }
]

const helpItems = [
  {
    label: `${app.getName()} Website`,
    click() {
      shell.openExternal(pkg.homepage)
    }
  },
  { type: 'separator' },
  {
    label: 'Toggle Developer Tools',
    accelerator: isDarwin ? 'Option+Cmd+I' : 'Ctrl+Shift+I',
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools()
    }
  }
]

const darwinTemplate = [
  {
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { label: `version ${app.getVersion()}`, enabled: false },
      { type: 'separator' },
      ...settingsItems,
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  { label: 'Edit', submenu: editItems },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }, { type: 'separator' }, { role: 'front' }, { role: 'togglefullscreen' }, { type: 'separator' }, ...windowItems]
  },
  { role: 'help', submenu: helpItems }
]

const otherTemplate = [
  {
    label: 'File',
    submenu: [{ label: `version ${app.getVersion()}`, enabled: false }, { type: 'separator' }, { role: 'quit' }]
  },
  {
    label: 'View',
    submenu: [...windowItems]
  },
  {
    label: 'Edit',
    submenu: [...editItems, ...settingsItems]
  },
  {
    role: 'help',
    submenu: [
      ...helpItems,
      { type: 'separator' },
      {
        role: 'about',
        click() {
          dialog.showMessageBox({
            title: `About ${app.getName()}`,
            message: `${app.getName()} ${app.getVersion()}`,
            detail: `Created by ${pkg.author}`,
            icon: path.join(__static, '/icons/icon.png')
          })
        }
      }
    ]
  }
]

const contextMenuTemplate = [{ role: 'copy' }, { role: 'paste' }, { type: 'separator' }, { role: 'selectall' }, { type: 'separator' }]

module.exports = {
  appMenu: Menu.buildFromTemplate(isDarwin ? darwinTemplate : otherTemplate),
  contextMenu: Menu.buildFromTemplate(contextMenuTemplate)
}
