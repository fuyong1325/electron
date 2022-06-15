const { autoUpdater } = require('electron-updater');
const { app, ipcMain, dialog } = require('electron');
// const packageConfig = require('../package.json');
// 更新服务器地址，比如"http://**.**.**.**:3002/download/"
const { UPLOAD_URL } = require('./config');
let mainWindow = null;

function updateHandle(window, url) {
  mainWindow = window;// 获取当前窗口
  autoUpdater.autoInstallOnAppQuit = false; // 退出时是否自动更新，默认为true
  autoUpdater.autoDownload = false; // 是否自动更新，默认为true
  // 检测是否有新版本
  // autoUpdater.checkForUpdates();

console.log(`App v${app.getVersion()} starting...`)
  // electron-update有 bug，在本地调试时会去取electron的版本，而不是软件的版本号
  // if (process.env.NODE_ENV !== 'production') {
  //   autoUpdater.currentVersion = packageConfig.version;
  // }
  //设置更新包的地址
  // autoUpdater.setFeedURL(UPLOAD_URL);
  autoUpdater.setFeedURL(url);

  //通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text) {
    mainWindow.webContents.send('message', text);
  }

  //监听升级失败事件
  autoUpdater.on('error', function(error) {
    console.log('监听升级失败事件');
    sendUpdateMessage({
      cmd: 'error',
      message: error,
    });
  });

  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function(message) {
    console.log(message);
    // console.log('监听开始检测更新事件');
    // sendUpdateMessage({
    //   cmd: 'checking-for-update',
    //   message: message,
    // });
  });

  //监听发现可用更新事件
  autoUpdater.on('update-available', function(message) {
    console.log('监听发现可用更新事件');
    sendUpdateMessage({
      cmd: 'update-available',
      message: message,
    });
  });

  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function(message) {
    console.log('监听没有可用更新事件');
    sendUpdateMessage({
      cmd: 'update-not-available',
      message: message,
    });
  });

  //更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    console.log('更新下载进度事件');
    sendUpdateMessage({
      cmd: 'download-progress',
      message: progressObj,
    });
  });

  //监听下载完成事件
  autoUpdater.on('update-downloaded', function(
    event,
    releaseNotes,
    releaseName,
    releaseDate,
    updateUrl,
    quitAndUpdate,
  ) {
    sendUpdateMessage({
      cmd: 'update-downloaded',
      message: {
        releaseNotes,
        releaseName,
        releaseDate,
        updateUrl,
      },
    });
    //退出并安装更新包，如果有下面这段代码，安装包下载完成之后会立刻退出软件并且安装
    // autoUpdater.quitAndInstall();
  });

  //接收渲染进程消息，开始检查更新
  ipcMain.on('checkForUpdate', (e, arg) => {
    console.log('接收渲染进程消息，开始检查更新');
    //执行自动更新检查
    // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
    autoUpdater.checkForUpdates();
  });

  //接收渲染进程信息，是否立即更新
  ipcMain.on('quitAndInstall', (e, arg) => {
    console.log('接收渲染进程信息，是否立即更新');
    //退出并安装更新包
    autoUpdater.quitAndInstall();
  });

  // 手动下载更新文件
  ipcMain.on('confirmDownloadUpdate', () => {
    autoUpdater.downloadUpdate();
  });

  try {
    //autoUpdater.setFeedURL('')
    autoUpdater.checkForUpdates()
    //autoUpdater.checkForUpdatesAndNotify()
  } catch (error) {
    console.log(error)
  }

}

module.exports = { updateHandle }
