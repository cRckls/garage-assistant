const FLAG_KEYWORDS: { label: string; pattern: RegExp }[] = [
  { label: "MOT", pattern: /\bmot\b/i },
  { label: "Service", pattern: /\bservice\b/i },
];

export function detectFlags(rawText: string): string[] {
  return FLAG_KEYWORDS.filter(({ pattern }) => pattern.test(rawText)).map(({ label }) => label);
}
