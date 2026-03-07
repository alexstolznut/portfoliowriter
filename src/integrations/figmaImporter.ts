import type { Artboard } from "../types/contracts.js";

const readFigmaToken = (): string => {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing FIGMA_ACCESS_TOKEN in environment.");
  }
  return token;
};

const parseFigmaFileKey = (reference: string): string => {
  const url = new URL(reference);
  const match = url.pathname.match(/\/file\/([^/]+)/);
  if (!match?.[1]) {
    throw new Error("Could not parse Figma file key from URL.");
  }
  return match[1];
};

export const importFigmaArtboards = async (reference: string): Promise<Artboard[]> => {
  const token = readFigmaToken();
  const fileKey = parseFigmaFileKey(reference);

  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { "X-Figma-Token": token }
  });

  if (!response.ok) {
    throw new Error(`Figma file fetch failed: ${response.status}`);
  }

  const json = (await response.json()) as {
    document?: { children?: Array<{ id: string; name: string; children?: Array<{ id: string; name: string; absoluteBoundingBox?: { width: number; height: number } }> }> };
  };

  const pages = json.document?.children ?? [];
  const artboards: Artboard[] = [];

  for (const page of pages) {
    for (const frame of page.children ?? []) {
      artboards.push({
        id: frame.id,
        name: `${page.name} / ${frame.name}`,
        width: frame.absoluteBoundingBox?.width,
        height: frame.absoluteBoundingBox?.height
      });
    }
  }

  return artboards;
};
