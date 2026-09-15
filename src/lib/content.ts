import { readData } from "@/lib/db";
import { caseStudies, services as staticServices, process as staticProcess, type CaseStudy, type CaseMetric, type Service, type ProcessStep } from "@/content/site";
import type { SelectedCut } from "@/lib/types";

export type { SelectedCut };

/**
 * Returns admin-overridden text if available, otherwise falls back to the
 * default value.
 */
export async function getText(
  key: string,
  fallback: string,
): Promise<string> {
  const overrides = await readData<Record<string, string>>(
    "content-overrides",
    {},
  );
  return overrides[key] !== undefined && overrides[key] !== "" ? overrides[key] : fallback;
}

/**
 * Returns all case studies dynamically loaded from the CMS store,
 * falling back to initial case studies if empty.
 */
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const raw = await readData<Record<string, unknown>[]>("case-studies", caseStudies as unknown as Record<string, unknown>[]);
    if (!raw || !Array.isArray(raw) || raw.length === 0) return caseStudies;
    return raw.map((item, idx) => ({
      slug: (item.slug as string) || (item.id as string) || `case-${idx + 1}`,
      number: (item.number as string) || `0${idx + 1}`,
      client: (item.client as string) || (item.title as string) || "Client Project",
      industry: (item.industry as string) || "Creative",
      summary: (item.summary as string) || (item.overview as string) || "",
      challenge: (item.challenge as string) || "",
      approach: (item.approach as string) || (item.strategyDetail as string) || "",
      outcome: (item.outcome as string) || (item.resultsDetail as string) || "",
      headlineMetric: (item.headlineMetric as string) || "Verified",
      headlineLabel: (item.headlineLabel as string) || "outcome",
      metrics: Array.isArray(item.metrics)
        ? (item.metrics as CaseMetric[])
        : [{ value: (item.headlineMetric as string) || "Verified", label: (item.headlineLabel as string) || "outcome" }],
      services: Array.isArray(item.services)
        ? (item.services as string[])
        : typeof item.services === "string"
        ? (item.services as string).split(",").map((s) => s.trim()).filter(Boolean)
        : ["Content creation", "Social management"],
      palette: (item.palette as string) || "blue",
      coverImage: (item.coverImage as string) || (item.imageUrl as string) || undefined,
      heroImage: (item.heroImage as string) || undefined,
    }));
  } catch {
    return caseStudies;
  }
}

/**
 * Returns a specific case study by slug from the dynamic CMS store.
 */
export async function getDynamicCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const all = await getAllCaseStudies();
  return all.find((s) => s.slug === slug);
}

/**
 * Returns services from the CMS/database, falling back to static services.
 */
export async function getAllServices(): Promise<Service[]> {
  try {
    const data = await readData<Service[]>("services", staticServices);
    if (!data || !Array.isArray(data) || data.length === 0) return staticServices;
    return data.map((s, idx) => ({
      id: s.id || `0${idx + 1}`,
      title: s.title || "Service",
      short: s.short || "",
      description: s.description || "",
      capabilities: Array.isArray(s.capabilities)
        ? s.capabilities
        : typeof (s as unknown as { capabilities: string }).capabilities === "string"
        ? ((s as unknown as { capabilities: string }).capabilities as string).split(",").map((c) => c.trim()).filter(Boolean)
        : [],
    }));
  } catch {
    return staticServices;
  }
}

/**
 * Returns process steps from CMS/database, falling back to static process steps.
 */
export async function getProcessSteps(): Promise<ProcessStep[]> {
  try {
    const data = await readData<ProcessStep[]>("process", staticProcess);
    if (!data || !Array.isArray(data) || data.length === 0) return staticProcess;
    return data;
  } catch {
    return staticProcess;
  }
}

export type BehindTheWorkItem = {
  id: string;
  title: string;
  phase: string;
  type: "image" | "video";
  mediaUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  caption?: string;
  equipment?: string;
  featured?: boolean;
  order?: number;
};

export async function getSelectedCuts(category?: string): Promise<SelectedCut[]> {
  try {
    const data = await readData<SelectedCut[]>("selected-cuts", []);
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
    if (category && category !== "all") {
      return sorted.filter((c) => (c.category || "video") === category);
    }
    return sorted;
  } catch {
    return [];
  }
}

export async function getBehindTheWork(): Promise<BehindTheWorkItem[]> {
  try {
    const defaultBts: BehindTheWorkItem[] = [
      {
        id: "bts-1",
        title: "Camera Systems & Cinema Lighting",
        phase: "02 Production",
        type: "image",
        mediaUrl: "/media/bts/camera-rig-placeholder.png",
        caption: "Hands adjusting a professional cinema camera rig on set.",
        equipment: "Sony FX3 / Cooke Anamorphic / Aputure 600d",
        featured: true,
        order: 1,
      },
      {
        id: "bts-2",
        title: "Editing, Pacing & Color Science",
        phase: "03 Post-production",
        type: "image",
        mediaUrl: "/media/bts/editing-suite-placeholder.png",
        caption: "Color grading and motion graphic assembly in the editing suite.",
        equipment: "DaVinci Resolve Studio / Apple M-Max / calibrated OLED",
        featured: true,
        order: 2,
      },
    ];
    const data = await readData<BehindTheWorkItem[]>("behind-the-work", defaultBts);
    return data && data.length > 0 ? data : defaultBts;
  } catch {
    return [];
  }
}
