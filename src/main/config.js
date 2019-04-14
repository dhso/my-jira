const ElectronStore = require('electron-store')

module.exports = new ElectronStore({
  defaults: {
    windowState: {
      width: 1080,
      height: 720
    },
    minWidth: 890,
    minHeight: 400,
    alwaysOnTop: false,
    autoHideMenuBar: false
  }
})
