import { ApiError, GoogleGenAI } from "@google/genai";
import { faultNoteResponseSchema, validateFaultNote, type FaultNote } from "../schema/faultNote.js";

const REQUEST_TIMEOUT_MS = 30_000;
const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

// The SDK's ApiError.message is often the raw JSON error body from the API
// (e.g. `{"error":{"code":503,"message":"...","status":"UNAVAILABLE"}}`)
// rather than a plain string — unwrap it so callers get something
// presentable instead of leaking that JSON into the UI.
export function toFriendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 503) {
      return "The AI service is currently experiencing high demand. Please try again shortly.";
    }
    if (error.status === 429) {
      return "The AI service is rate-limited right now. Please try again shortly.";
    }
    return extractApiErrorMessage(error.message) ?? `AI service error (status ${error.status}).`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

function extractApiErrorMessage(message: string): string | null {
  try {
    const parsed: unknown = JSON.parse(message);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "error" in parsed &&
      typeof (parsed as { error?: unknown }).error === "object" &&
      (parsed as { error?: unknown }).error !== null
    ) {
      const inner = (parsed as { error: { message?: unknown } }).error;
      return typeof inner.message === "string" ? inner.message : null;
    }
    return null;
  } catch {
    return null;
  }
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

// Throws on any failure (missing key, network error, timeout, empty response,
// invalid JSON, or a schema mismatch) — callers are expected to catch this and
// fall back to the manual review workflow rather than surface it to the user.
export async function parseFaultFromText(rawText: string): Promise<FaultNote> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await getClient().models.generateContent({
      model: MODEL,
      contents: `Extract a structured service note from this customer-reported vehicle fault description:\n\n${rawText}`,
      config: {
        abortSignal: controller.signal,
        responseMimeType: "application/json",
        responseSchema: faultNoteResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const note = validateFaultNote(JSON.parse(text));
    if (!note) {
      throw new Error("Gemini response did not match the expected schema");
    }

    return note;
  } catch (error) {
    throw new Error(toFriendlyMessage(error));
  } finally {
    clearTimeout(timeout);
  }
}
