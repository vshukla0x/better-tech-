export const useOptions = [
  {
    id: "gaming",
    name: "Gaming",
    detail: "Casual, competitive, or a bit of both",
    icon: "game",
  },
  {
    id: "study",
    name: "Study or office work",
    detail: "Documents, classes, and getting it done",
    icon: "study",
  },
  {
    id: "programming",
    name: "Programming",
    detail: "Writing code and building things",
    icon: "code",
  },
  {
    id: "creation",
    name: "Content creation",
    detail: "Design, video, music, and photography",
    icon: "create",
  },
  {
    id: "browsing",
    name: "Everyday browsing",
    detail: "The web, streaming, and staying connected",
    icon: "globe",
  },
  {
    id: "older",
    name: "Reviving an older computer",
    detail: "Exploring options for an aging device",
    icon: "refresh",
  },
];
export const refineSteps = [
  "model",
  "cpu",
  "gpu",
  "ram",
  "storage",
  "mustHaves",
  "alternatives",
  "priorities",
  "comfort",
] as const;
export const totalRefine = refineSteps.length;
