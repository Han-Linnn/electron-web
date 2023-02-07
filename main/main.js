import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
} from 'electron-devtools-installer';

let mainWindow = null;

const fileURL = path.join('file:', __dirname, 'index.html');
const winURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : new URL(fileURL).href;

async function devtoolsInstall() {
  try {
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF].forEach(async (extension) => {
      await installExtension(extension);
    });
  } catch (e) {
    console.error(`Error while installing extension".`, e);
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    // autoHideMenuBar: true, // 菜单隐藏
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      webSecurity: false,

      // enableRemoteModule: true, // 是否有子页面
      // nodeIntegrationInSubFrames: true, // 否允许在子页面(iframe)或子窗口(child window)中集成 Node.js
    },
  });

  if (process.env.NODE_ENV === 'development') {
    await devtoolsInstall();
  }

  mainWindow.loadURL(winURL);
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
