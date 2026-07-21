import type { FaultNote } from "./faultNote.js";

export interface OkResult {
  status: "ok";
  note: FaultNote;
}

export interface FallbackResult {
  status: "fallback";
  note: FaultNote;
  reason: string;
}

export type ParseFaultResult = OkResult | FallbackResult;

export function buildFallbackResult(rawText: string, reason: string): FallbackResult {
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
