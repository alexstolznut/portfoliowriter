import "dotenv/config";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importDesign } from "../services/designImportService.js";
import { profileWritingStyle } from "../services/styleProfiler.js";
import { generatePortfolioDraft } from "../services/portfolioWriter.js";
import { publishToSquarespace } from "../services/squarespacePublisher.js";
import type { DesignImportRequest, PortfolioDraftRequest } from "../types/contracts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = async () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await window.loadFile(path.join(app.getAppPath(), "src/renderer/index.html"));
};

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("design:import", async (_event, payload: DesignImportRequest) => {
  return importDesign(payload);
});

ipcMain.handle("style:profile", async (_event, portfolioUrl: string) => {
  return profileWritingStyle(portfolioUrl);
});

ipcMain.handle("draft:generate", async (_event, payload: PortfolioDraftRequest) => {
  return generatePortfolioDraft(payload);
});

ipcMain.handle("publish:squarespace", async (_event, draftMarkdown: string) => {
  return publishToSquarespace(draftMarkdown);
});
