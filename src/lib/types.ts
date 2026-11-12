export type OSId =
  "windows" | "macos" | "mint" | "ubuntu" | "fedora" | "xubuntu";
export type Family = "windows" | "macos" | "linux";
export type Priority =
  "familiarity" | "battery" | "privacy" | "customization" | "maintenance";
export interface Answers {
  device: string;
  currentOS: string;
  uses: string[];
  mustHaves: string;
  model: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  architecture: string;
  alternatives: string;
  comfort: string;
  priorities: Record<Priority, number>;
  refined: boolean;
}
export const emptyAnswers: Answers = {
  device: "",
  currentOS: "",
  uses: [],
  mustHaves: "",
  model: "",
  cpu: "",
  gpu: "",
  ram: "",
  storage: "",
  architecture: "",
  alternatives: "native",
  comfort: "new",
  priorities: {
    familiarity: 1,
    battery: 1,
    privacy: 1,
    customization: 1,
    maintenance: 1,
  },
  refined: false,
};
export interface Source {
  title: string;
  author: string;
  url: string;
  checked: string | null;
}
export interface OSOption {
  id: OSId;
  family: Family;
  name: string;
  subtitle: string;
  description: string;
  strengths: string[];
  tradeoff: string;
  ram?: number;
  storage?: number;
  requirements: string;
  source: Source;
  download: string;
}
export type Support =
  "native" | "web" | "layer" | "substitute" | "incompatible" | "unknown";
export interface ItemCheck {
  item: string;
  status: Support;
  detail: string;
  source?: Source;
}
export interface Evaluation {
  os: OSOption;
  score: number;
  reasons: { text: string; points: number }[];
  excluded: string[];
  checks: ItemCheck[];
  hardware: string[];
  provisional: boolean;
}
