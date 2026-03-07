import type { Artboard, PortfolioDraft, PortfolioDraftRequest, StyleProfile, DesignImportRequest } from "../types/contracts.js";

declare global {
  interface Window {
    portfolioWriter: {
      importDesign: (payload: DesignImportRequest) => Promise<Artboard[]>;
      profileStyle: (portfolioUrl: string) => Promise<StyleProfile>;
      generateDraft: (payload: PortfolioDraftRequest) => Promise<PortfolioDraft>;
      publishDraft: (draftMarkdown: string) => Promise<{ success: boolean; message: string }>;
    };
  }
}

export {};
