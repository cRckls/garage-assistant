export interface FaultNote {
  vehicleSummary: string;
  mainSymptoms: string[];
  urgency: string;
  followUpQuestions: string[];
}

export type ParseResult =
  | { status: "ok"; note: FaultNote }
  | { status: "fallback"; note: FaultNote; reason: string };

export interface FaultSubmission {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  rawText: string;
  result: ParseResult;
}
