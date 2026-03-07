import type { Artboard, PortfolioDraft, StyleProfile } from "../types/contracts.js";

let importedArtboards: Artboard[] = [];
let styleProfile: StyleProfile | undefined;
let generatedDraft: PortfolioDraft | undefined;

const out = document.getElementById("output") as HTMLPreElement;
const write = (value: unknown) => {
  out.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
};

(document.getElementById("analyze-style") as HTMLButtonElement).addEventListener("click", async () => {
  const url = (document.getElementById("portfolio-url") as HTMLInputElement).value;
  styleProfile = await window.portfolioWriter.profileStyle(url);
  write({ styleProfile });
});

(document.getElementById("import-design") as HTMLButtonElement).addEventListener("click", async () => {
  const source = (document.getElementById("source-kind") as HTMLSelectElement).value as "figma" | "adobe-xd";
  const reference = (document.getElementById("source-reference") as HTMLInputElement).value;
  importedArtboards = await window.portfolioWriter.importDesign({ source, reference });
  write({ importedArtboardsCount: importedArtboards.length, importedArtboards });
});

(document.getElementById("generate-draft") as HTMLButtonElement).addEventListener("click", async () => {
  const projectTitle = (document.getElementById("project-title") as HTMLInputElement).value;
  const projectSummary = (document.getElementById("project-summary") as HTMLTextAreaElement).value;

  generatedDraft = await window.portfolioWriter.generateDraft({
    projectTitle,
    projectSummary,
    artboards: importedArtboards,
    styleProfile
  });
  write(generatedDraft);
});

(document.getElementById("publish-draft") as HTMLButtonElement).addEventListener("click", async () => {
  if (!generatedDraft) {
    write("Generate a draft first.");
    return;
  }

  const markdown = [
    `# ${generatedDraft.title}`,
    ...generatedDraft.sections.map((section) => `## ${section.heading}\n\n${section.body}`)
  ].join("\n\n");

  const result = await window.portfolioWriter.publishDraft(markdown);
  write(result);
});
