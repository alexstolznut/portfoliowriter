import { contextBridge, ipcRenderer } from "electron";
import type { DesignImportRequest, PortfolioDraftRequest } from "../types/contracts.js";

contextBridge.exposeInMainWorld("portfolioWriter", {
  importDesign: (payload: DesignImportRequest) => ipcRenderer.invoke("design:import", payload),
  profileStyle: (portfolioUrl: string) => ipcRenderer.invoke("style:profile", portfolioUrl),
  generateDraft: (payload: PortfolioDraftRequest) => ipcRenderer.invoke("draft:generate", payload),
  publishDraft: (draftMarkdown: string) => ipcRenderer.invoke("publish:squarespace", draftMarkdown)
});
