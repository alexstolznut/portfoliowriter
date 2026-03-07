import { readFile } from "node:fs/promises";
import type { Artboard } from "../types/contracts.js";

export const importAdobeXdArtboards = async (reference: string): Promise<Artboard[]> => {
  const file = await readFile(reference, "utf8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(file);
  } catch {
    throw new Error("Adobe XD import expects a JSON export for this scaffold.");
  }

  if (!parsed || typeof parsed !== "object" || !("artboards" in parsed)) {
    throw new Error("Adobe XD JSON must include an artboards array.");
  }

  const artboards = (parsed as { artboards: Array<{ id: string; name: string; width?: number; height?: number; imageUrl?: string }> }).artboards;

  return artboards.map((artboard) => ({
    id: artboard.id,
    name: artboard.name,
    width: artboard.width,
    height: artboard.height,
    imageUrl: artboard.imageUrl
  }));
};
