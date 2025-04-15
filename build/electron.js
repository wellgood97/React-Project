const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show:true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // ✅ React 개발 서버 or 빌드된 파일을 로드
  const startUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000" // React 개발 서버 (react-scripts 기준)
    : `file://${path.join(__dirname, "../build/index.html")}`; // 빌드된 파일

    mainWindow.loadURL(startUrl);
});