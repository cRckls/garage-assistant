import type { FaultNote } from "./faultNote.js";

export type ParseFaultResult =
  | { status: "ok"; note: FaultNote }
  | { status: "fallback"; note: FaultNote; reason: string };

export function buildFallbackResult(rawText: string, reason: string): ParseFaultResult {
  return {
    status: "fallback",
    reason,
    note: {
      vehicleSummary: rawText,
      mainSymptoms: [],
      likelyCause: "",
      urgency: "",
      recommendedNextStep: "Review manually — automatic parsing was unavailable.",
      followUpQuestions: [],
    },
  };
}
