const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const isDev = require('electron-is-dev')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: isDev,
    icon: path.join(__dirname, '../build/icons/96x96.png'),
  })

  if (!isDev) {
    mainWindow.setMenu(null)
  }

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  if (process.platform !== 'win32') {
    app.setAboutPanelOptions({
      applicationName: 'Tasks',
      applicationVersion: '0.1.7',
    })
  }

  mainWindow.on('closed', () => (mainWindow = null))

  // Open links in browser
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault()
    electron.shell.openExternal(url)
  })

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err))

    installExtension(REDUX_DEVTOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err))
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
