const { app, BrowserWindow, Notification } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, './android-chrome-512x512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('https://k-drive.devcours.fr'); // URL de ton application Symfony
}

function sendNotification(title, message) {
  new Notification({ title, body: message }).show();
}

autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'maj-drive',
  owner: 'imdadwf',
  private: true,
  token: process.env.K_DRIVE_TOKEN  // Assure-toi que GITHUB_TOKEN est défini dans tes variables d'environnement
});

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('checking-for-update', () => {
  sendNotification('Mise à jour', 'Vérification des mises à jour...');
});

autoUpdater.on('update-available', (info) => {
  sendNotification('Mise à jour', 'Une mise à jour est disponible.');
});

autoUpdater.on('update-not-available', (info) => {
  sendNotification('Mise à jour', 'Aucune mise à jour disponible.');
});

autoUpdater.on('error', (err) => {
  sendNotification('Erreur de mise à jour', 'Erreur lors de la mise à jour : ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Vitesse de téléchargement: ${progressObj.bytesPerSecond} - Téléchargé ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
  sendNotification('Progression de la mise à jour', message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendNotification('Mise à jour', 'Mise à jour téléchargée; l\'installation commencera dans 5 secondes...');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
