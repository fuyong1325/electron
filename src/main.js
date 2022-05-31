// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

const mainWindowURL = 'http://ebicom.cn'
let loadingWindow = null
let loadSrc = path.join(__dirname, './loading.html')
let contents = null

const showLoading = (cb) => {
  loadingWindow = new BrowserWindow({
    show: false,
    frame: false, // 无边框（窗口、工具栏等），只包含网页内容
    maximizable: false, // 禁止双击放大
    width: 400,
    height: 300,
    resizable: false, // 是否可手动调整大小
    transparent: true // 窗口是否支持透明，如果想做高级效果最好为true
  });

  loadingWindow.once('show', cb);
  loadingWindow.loadFile(loadSrc);
  loadingWindow.show();
};

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    maximizable: false,
    show: false,
    // fullscreen: true,
    icon: path.join(__dirname, '../src/icons/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      // contextIsolation: false,
      // enableRemoteModule: true,
      // nativeWindowOpen: true,
    }
  });
  Menu.setApplicationMenu(null); //隐藏应用程序菜单.
  mainWindow.loadURL(mainWindowURL, {
    userAgent: 'Chrome',
    httpReferrer: 'http://www.baidu.com/'
  }); //设置访问地址

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  // mainWindow.loadFile('./dist/index.html')

  // mainWindow.show();
  contents = mainWindow.webContents
  // console.log('123456789', contents.getUserAgent())
  contents.on('dom-ready', () => {
    console.log('dom-ready----------');
    loadingWindow.hide();
    loadingWindow.close();
    mainWindow.show();
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  //禁止程序打开第二次, 第二次打开时会将焦点聚焦到上次打开的窗口.
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
      }
    });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // createWindow()
  showLoading(createWindow);

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
