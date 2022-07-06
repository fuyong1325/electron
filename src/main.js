// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const { updateHandle } = require('./update')
const config = require('./config')

const mainWindowURL = `${config.BASE_URL}` // 通过配置文件获取url
let mainWindow = null
let loadingWindow = null
let loadSrc = path.join(__dirname, './loading.html')
let mainContents = null

const showLoading = (cb) => {
  loadingWindow = new BrowserWindow({
    show: false,
    frame: false, // 无边框（窗口、工具栏等），只包含网页内容
    maximizable: false, // 禁止双击放大
    width: 400,
    height: 300,
    resizable: false, // 是否可手动调整大小
    transparent: true, // 窗口是否支持透明，如果想做高级效果最好为true
    backgroundColor: '#00000000',
  });

  loadingWindow.once('show', cb);
  loadingWindow.loadFile(loadSrc);
  loadingWindow.show();
};

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    // resizable: false,
    // maximizable: false,
    show: false,
    center: true, // 是否出现在屏幕居中的位置 
    icon: path.join(__dirname, './assets/favicon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      partition: String(+new Date()),
      nodeIntegration: true,
      contextIsolation: false,
      // enableRemoteModule: true,
      // nativeWindowOpen: true,
    }
  });
  Menu.setApplicationMenu(null); //隐藏应用程序菜单.
  mainWindow.loadURL(mainWindowURL, {
    'extraHeaders': 'pragma: no-cache\n',
    // userAgent: 'Chrome',
    // httpReferrer: 'http://www.baidu.com/'
  }); //设置访问地址

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, './index.html'))

  // mainWindow.show();
  mainContents = mainWindow.webContents
  mainContents.on('dom-ready', () => {
    console.log('webContents dom-ready');
    if (loadingWindow) {
      loadingWindow.hide();
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.maximize();
    mainWindow.show();
    mainContents.send('config', {
      appVersion: app.getVersion(),
      version: config.version,
    });
  });

  // mainContents.reloadIgnoringCache()
  // let session = mainWindow.webContents.session
  // session.clearCache()
  // session.clearStorageData()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

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

app.disableDomainBlockingFor3DAPIs(); // 关闭3D api, 提高兼容性 
app.disableHardwareAcceleration(); // 关闭硬件加速, 减少渲染问题
// app.commandLine.appendSwitch("--disable-http-cache"); // 禁用HTTP请求的磁盘缓存

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

// 监听版本更新信息
ipcMain.on('latestVersion', function(event, arg) {
  console.log(arg);
  if (arg && arg.downloadUrl) {
    updateHandle(mainWindow, arg.downloadUrl);
  }
  // 回应异步消息
  // event.sender.send('asynchronous-reply', 'pong');
})

// 监听数据持久化储存
const Store = require("electron-store")
const store = new Store()
ipcMain.handle('getStorage', (event) => {
  return Promise.resolve(store.store)
})
ipcMain.on('setStorage', function(event, arg) {
  if (arg) {
    store.set(arg.key, arg.value);
  }
})
