export interface FaultNote {
  vehicleSummary: string;
  mainSymptoms: string[];
  likelyCause: string;
  urgency: string;
  recommendedNextStep: string;
  followUpQuestions: string[];
}

export type ParseResult =
  | { status: "ok"; note: FaultNote }
  | { status: "fallback"; note: FaultNote; reason: string };
