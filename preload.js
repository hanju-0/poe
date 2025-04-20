const { contextBridge, ipcRenderer } = require('electron');

// 렌더러 프로세스(웹페이지)에서 사용할 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  updateTitle: (title) => {
    ipcRenderer.send('update-title', title);
  }
});