export const PUBLIC_PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "X / Twitter" },
  { id: "telegram", label: "Telegram" },
  { id: "spotify", label: "Spotify" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "snapchat", label: "Snapchat" },
] as const;

export type PlatformId = (typeof PUBLIC_PLATFORMS)[number]["id"];

export function categoryPlatform(name: string): PlatformId | null {
  const value = name.toLowerCase();
  if (value.includes("instagram") || value.includes("threads")) return "instagram";
  if (value.includes("tiktok") || value.includes("tik tok") || value.includes("douyin")) return "tiktok";
  if (value.includes("youtube")) return "youtube";
  if (value.includes("facebook")) return "facebook";
  if (
    value.includes("twitter") ||
    value.includes(" x ") ||
    value.startsWith("x ") ||
    value.endsWith(" x") ||
    value === "x" ||
    /\bx\b/.test(value)
  ) {
    return "twitter";
  }
  if (value.includes("telegram")) return "telegram";
  if (value.includes("spotify")) return "spotify";
  if (value.includes("linkedin")) return "linkedin";
  if (value.includes("snapchat")) return "snapchat";
  return null;
}

export function isPlatformId(value: string | null): value is PlatformId {
  return PUBLIC_PLATFORMS.some((platform) => platform.id === value);
}
