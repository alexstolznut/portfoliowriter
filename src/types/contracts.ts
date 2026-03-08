export type DesignSourceKind = "figma" | "adobe-xd";

export interface DesignImportRequest {
  source: DesignSourceKind;
  reference: string;
}

export interface Artboard {
  id: string;
  name: string;
  imageUrl?: string;
  width?: number;
  height?: number;
}

export interface StyleProfile {
  voice: "concise" | "balanced" | "narrative";
  sentenceLength: "short" | "mixed" | "long";
  commonPhrases: string[];
  sectionPattern: string[];
}

export interface PortfolioDraftRequest {
  projectTitle: string;
  projectSummary: string;
  artboards: Artboard[];
  styleProfile?: StyleProfile;
}

export interface PortfolioDraft {
  title: string;
  sections: Array<{
    heading: string;
    body: string;
    images: string[];
  }>;
  editorNotes: string[];
}

export interface PublishDraftResult {
  success: boolean;
  message: string;
  copyBlock: string;
  suggestedSlug: string;
}
