import type { PublishDraftResult } from "../types/contracts.js";

const slugify = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "portfolio-case-study";

const extractTitle = (draftMarkdown: string): string => {
  const firstHeading = draftMarkdown
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("# "));

  return firstHeading ? firstHeading.replace(/^#\s+/, "").trim() : "New Portfolio Case Study";
};

export const publishToSquarespace = async (draftMarkdown: string): Promise<PublishDraftResult> => {
  const title = extractTitle(draftMarkdown);
  const suggestedSlug = slugify(title);

  const copyBlock = [
    "---",
    `Title: ${title}`,
    `Suggested URL slug: ${suggestedSlug}`,
    "Status: Draft",
    "---",
    "",
    draftMarkdown
  ].join("\n");

  return {
    success: true,
    message:
      "Squarespace API keys are optional in this version. Copy the prepared draft below and paste it into your Squarespace page editor.",
    copyBlock,
    suggestedSlug
  };
};
