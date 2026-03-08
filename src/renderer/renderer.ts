import type { Artboard, PortfolioDraft, StyleProfile } from "../types/contracts.js";

let importedArtboards: Artboard[] = [];
let styleProfile: StyleProfile | undefined;
let generatedDraft: PortfolioDraft | undefined;

type StatusTone = "idle" | "progress" | "success" | "error";

const out = document.getElementById("output") as HTMLPreElement;
const portfolioUrlInput = document.getElementById("portfolio-url") as HTMLInputElement;
const sourceKindInput = document.getElementById("source-kind") as HTMLSelectElement;
const sourceReferenceInput = document.getElementById("source-reference") as HTMLInputElement;
const websiteStatus = document.getElementById("website-status") as HTMLParagraphElement;
const figmaCompatibilityStatus = document.getElementById("figma-compatibility-status") as HTMLParagraphElement;
const designAnalysisStatus = document.getElementById("design-analysis-status") as HTMLParagraphElement;

const write = (value: unknown) => {
  out.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
};

const setStatus = (target: HTMLElement, tone: StatusTone, message: string) => {
  target.className = `status status-${tone}`;
  target.textContent = message;
};

const isValidHttpUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const assessFigmaReferenceCompatibility = (reference: string): { compatible: boolean; reason: string } => {
  const trimmed = reference.trim();

  if (!trimmed) {
    return { compatible: false, reason: "No Figma reference provided." };
  }

  if (trimmed.startsWith("{")) {
    return { compatible: true, reason: "Looks compatible: detected pasted Figma JSON payload." };
  }

  if (trimmed.endsWith(".json")) {
    return { compatible: true, reason: "Looks compatible: detected local .json file path." };
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      const isFigmaHost = parsed.hostname === "figma.com" || parsed.hostname.endsWith(".figma.com");
      const hasSupportedPath = /^\/file\/[^/]+/.test(parsed.pathname);

      if (!isFigmaHost) {
        return {
          compatible: false,
          reason: "URL is not from figma.com. Use a Figma file URL, pasted JSON, or .json file path."
        };
      }

      if (!hasSupportedPath) {
        return {
          compatible: false,
          reason: "Figma URL is missing /file/{fileKey}. Use a standard Figma file URL."
        };
      }

      return { compatible: true, reason: "Looks compatible: valid Figma file URL format detected." };
    } catch {
      return {
        compatible: false,
        reason: "Figma URL is malformed. Check for a complete URL that starts with https://figma.com/file/..."
      };
    }
  }

  return {
    compatible: false,
    reason: "Unsupported Figma reference. Use a Figma URL, pasted JSON, or a .json file path."
  };
};

sourceKindInput.addEventListener("change", () => {
  if (sourceKindInput.value !== "figma") {
    setStatus(figmaCompatibilityStatus, "idle", "Figma URL compatibility: Not required for Adobe XD imports.");
    return;
  }

  const compatibility = assessFigmaReferenceCompatibility(sourceReferenceInput.value);
  setStatus(
    figmaCompatibilityStatus,
    compatibility.compatible ? "success" : "error",
    `Figma URL compatibility: ${compatibility.reason}`
  );
});

sourceReferenceInput.addEventListener("input", () => {
  if (sourceKindInput.value !== "figma") {
    setStatus(figmaCompatibilityStatus, "idle", "Figma URL compatibility: Not required for Adobe XD imports.");
    return;
  }

  const compatibility = assessFigmaReferenceCompatibility(sourceReferenceInput.value);
  setStatus(
    figmaCompatibilityStatus,
    compatibility.compatible ? "success" : "error",
    `Figma URL compatibility: ${compatibility.reason}`
  );
});

(document.getElementById("analyze-style") as HTMLButtonElement).addEventListener("click", async () => {
  const url = portfolioUrlInput.value.trim();

  if (!url) {
    setStatus(websiteStatus, "error", "Website status: Please enter a portfolio URL before analysis.");
    write("Please provide a website URL to analyze.");
    return;
  }

  if (!isValidHttpUrl(url)) {
    setStatus(websiteStatus, "error", "Website status: URL must start with http:// or https:// and be valid.");
    write("Invalid URL format. Example: https://your-portfolio.com/case-study");
    return;
  }

  setStatus(websiteStatus, "progress", "Website status: Finding website and analyzing writing style...");

  try {
    styleProfile = await window.portfolioWriter.profileStyle(url);
    setStatus(websiteStatus, "success", "Website status: Website found and writing style analyzed successfully.");
    write({ styleProfile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error while analyzing website.";
    setStatus(websiteStatus, "error", `Website status: Could not analyze website. ${message}`);
    write({ error: message });
  }
});

(document.getElementById("import-design") as HTMLButtonElement).addEventListener("click", async () => {
  const source = sourceKindInput.value as "figma" | "adobe-xd";
  const reference = sourceReferenceInput.value.trim();

  if (!reference) {
    setStatus(designAnalysisStatus, "error", "Design analysis status: Provide a source reference before importing.");
    write("Missing source reference. Add a Figma URL/JSON/path or Adobe XD JSON path.");
    return;
  }

  if (source === "figma") {
    const compatibility = assessFigmaReferenceCompatibility(reference);
    setStatus(
      figmaCompatibilityStatus,
      compatibility.compatible ? "success" : "error",
      `Figma URL compatibility: ${compatibility.reason}`
    );

    if (!compatibility.compatible) {
      setStatus(designAnalysisStatus, "error", "Design analysis status: Import blocked due to incompatible Figma reference.");
      write({ error: compatibility.reason });
      return;
    }
  } else {
    setStatus(figmaCompatibilityStatus, "idle", "Figma URL compatibility: Not required for Adobe XD imports.");
  }

  setStatus(designAnalysisStatus, "progress", "Design analysis status: Importing and analyzing design source...");

  try {
    importedArtboards = await window.portfolioWriter.importDesign({ source, reference });

    if (importedArtboards.length === 0) {
      setStatus(designAnalysisStatus, "error", "Design analysis status: Import succeeded but no artboards were found.");
      write({ warning: "No artboards found in source", importedArtboardsCount: 0, importedArtboards });
      return;
    }

    setStatus(
      designAnalysisStatus,
      "success",
      `Design analysis status: Imported and analyzed ${importedArtboards.length} artboard${importedArtboards.length === 1 ? "" : "s"}.`
    );
    write({ importedArtboardsCount: importedArtboards.length, importedArtboards });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown design import error.";
    setStatus(designAnalysisStatus, "error", `Design analysis status: Import failed. ${message}`);
    write({ error: message });
  }
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
  write(`${result.message}\n\n${result.copyBlock}`);
});
