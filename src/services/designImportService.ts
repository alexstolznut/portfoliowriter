import type { Artboard, DesignImportRequest } from "../types/contracts.js";
import { importFigmaArtboards } from "../integrations/figmaImporter.js";
import { importAdobeXdArtboards } from "../integrations/adobeXdImporter.js";

export const importDesign = async (request: DesignImportRequest): Promise<Artboard[]> => {
  if (request.source === "figma") {
    return importFigmaArtboards(request.reference);
  }

  return importAdobeXdArtboards(request.reference);
};
