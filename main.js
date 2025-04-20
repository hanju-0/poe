const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');

// 윈도우 객체를 전역 참조로 유지
let mainWindow;

function createWindow() {
  // 브라우저 윈도우 생성
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // webview 태그 사용 허용
      preload: __dirname + '/preload.js' // preload 스크립트 추가
    },
    title: 'Poe Electron App',
    backgroundColor: '#ffffff'
  });

  // index.html 로드
  mainWindow.loadFile('index.html');

  // 전역 단축키 등록
  globalShortcut.register('CommandOrControl+1', () => {
    mainWindow.webContents.executeJavaScript('switchToWebview(1)');
  });
  
  globalShortcut.register('CommandOrControl+2', () => {
    mainWindow.webContents.executeJavaScript('switchToWebview(2)');
  });

  // 웹뷰의 제목 변경 이벤트 수신
  mainWindow.webContents.on('page-title-updated', (event, title) => {
    // 기본 제목 변경 이벤트 방지 (웹뷰에서 처리할 것이므로)
    event.preventDefault();
  });

  // 윈도우가 닫힐 때 이벤트 처리
  mainWindow.on('closed', function () {
    // 전역 단축키 해제
    globalShortcut.unregisterAll();
    mainWindow = null;
  });
}

// Electron이 준비되면 윈도우 생성
app.whenReady().then(createWindow);

// 모든 윈도우가 닫히면 앱 종료 (Windows & Linux)
app.on('window-all-closed', function () {
  // macOS를 제외하고 앱 종료
  if (process.platform !== 'darwin') app.quit();
});

// macOS에서 dock 아이콘 클릭 시 윈도우 재생성
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// preload.js에서 전송하는 제목 업데이트 이벤트 처리
ipcMain.on('update-title', (event, title) => {
  if (mainWindow) {
    mainWindow.setTitle(title);
  }
});