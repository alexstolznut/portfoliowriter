import type { StyleProfile } from "../types/contracts.js";

const extractText = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const profileWritingStyle = async (portfolioUrl: string): Promise<StyleProfile> => {
  const response = await fetch(portfolioUrl);
  if (!response.ok) {
    throw new Error(`Unable to fetch portfolio URL: ${response.status}`);
  }

  const html = await response.text();
  const text = extractText(html);
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);

  const averageSentenceLength =
    sentences.length === 0
      ? 0
      : sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) / sentences.length;

  const sentenceLength: StyleProfile["sentenceLength"] =
    averageSentenceLength < 12 ? "short" : averageSentenceLength > 22 ? "long" : "mixed";

  const voice: StyleProfile["voice"] =
    text.length < 1000 ? "concise" : text.length > 5000 ? "narrative" : "balanced";

  return {
    voice,
    sentenceLength,
    commonPhrases: ["problem framing", "design rationale", "outcome"],
    sectionPattern: ["Context", "Approach", "Execution", "Results", "Reflection"]
  };
};
