import type { PortfolioDraft, PortfolioDraftRequest } from "../types/contracts.js";

const imageIdsForSection = (artboardIds: string[], sectionIndex: number): string[] => {
  if (artboardIds.length === 0) return [];
  return [artboardIds[sectionIndex % artboardIds.length]];
};

export const generatePortfolioDraft = async (request: PortfolioDraftRequest): Promise<PortfolioDraft> => {
  const pattern = request.styleProfile?.sectionPattern ?? ["Context", "Challenge", "Process", "Outcome", "Learnings"];
  const artboardIds = request.artboards.map((board) => board.id);

  const sections = pattern.map((heading, index) => ({
    heading,
    body:
      heading === "Context"
        ? `${request.projectSummary} This section introduces the project scope and goals in a clear, first-person narrative.`
        : `Describe ${heading.toLowerCase()} with concrete decisions, trade-offs, and measurable impact. Keep details accurate and aligned with your real process.`,
    images: imageIdsForSection(artboardIds, index)
  }));

  return {
    title: request.projectTitle,
    sections,
    editorNotes: [
      "Replace generic statements with specific decisions and outcomes.",
      "Ensure all claims are true and based on your actual contribution.",
      "Do a final personal edit before publishing."
    ]
  };
};
