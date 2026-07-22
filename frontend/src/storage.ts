import { seedSubmissions } from "./seedSubmissions";
import type { FaultSubmission } from "./types";

const STORAGE_KEY = "garage-fault-intake:submissions";

function isFaultSubmission(value: unknown): value is FaultSubmission {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.createdAt === "string" &&
    typeof v.customerName === "string" &&
    typeof v.customerPhone === "string" &&
    typeof v.rawText === "string" &&
    typeof v.result === "object" &&
    v.result !== null
  );
}

export function loadSubmissions(): FaultSubmission[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveSubmissions(seedSubmissions);
    return seedSubmissions;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFaultSubmission);
  } catch {
    return [];
  }
}

function saveSubmissions(submissions: FaultSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch {
    // Quota exceeded or storage unavailable (e.g. private browsing) — the
    // in-memory state still reflects the submission, so fail silently.
  }
}

export function addSubmission(
  submissions: FaultSubmission[],
  submission: FaultSubmission,
): FaultSubmission[] {
  const next = [submission, ...submissions];
  saveSubmissions(next);
  return next;
}

export function deleteSubmission(submissions: FaultSubmission[], id: string): FaultSubmission[] {
  const next = submissions.filter((submission) => submission.id !== id);
  saveSubmissions(next);
  return next;
}
