import { readFile } from "node:fs/promises";
import type { Artboard } from "../types/contracts.js";

const parseFigmaFileKey = (reference: string): string => {
  const url = new URL(reference);
  const match = url.pathname.match(/\/file\/([^/]+)/);
  if (!match?.[1]) {
    throw new Error("Could not parse Figma file key from URL.");
  }
  return match[1];
};

const loadFigmaDocument = async (reference: string): Promise<{
  document?: {
    children?: Array<{
      id: string;
      name: string;
      children?: Array<{
        id: string;
        name: string;
        absoluteBoundingBox?: { width: number; height: number };
      }>;
    }>;
  };
}> => {
  const trimmed = reference.trim();
  const token = process.env.FIGMA_ACCESS_TOKEN;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (!token) {
      throw new Error(
        "Figma URL import requires FIGMA_ACCESS_TOKEN. For a key-free flow, paste Figma JSON or provide a local .json file path."
      );
    }

    const fileKey = parseFigmaFileKey(trimmed);
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: { "X-Figma-Token": token }
    });

    if (!response.ok) {
      throw new Error(`Figma file fetch failed: ${response.status}`);
    }

    return (await response.json()) as {
      document?: {
        children?: Array<{
          id: string;
          name: string;
          children?: Array<{
            id: string;
            name: string;
            absoluteBoundingBox?: { width: number; height: number };
          }>;
        }>;
      };
    };
  }

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed) as {
      document?: {
        children?: Array<{
          id: string;
          name: string;
          children?: Array<{
            id: string;
            name: string;
            absoluteBoundingBox?: { width: number; height: number };
          }>;
        }>;
      };
    };
  }

  const raw = await readFile(trimmed, "utf8");
  return JSON.parse(raw) as {
    document?: {
      children?: Array<{
        id: string;
        name: string;
        children?: Array<{
          id: string;
          name: string;
          absoluteBoundingBox?: { width: number; height: number };
        }>;
      }>;
    };
  };
};

export const importFigmaArtboards = async (reference: string): Promise<Artboard[]> => {
  const json = await loadFigmaDocument(reference);
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
