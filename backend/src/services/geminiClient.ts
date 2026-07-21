import { GoogleGenAI } from "@google/genai";
import { faultNoteResponseSchema, validateFaultNote, type FaultNote } from "../schema/faultNote.js";

const REQUEST_TIMEOUT_MS = 15_000;
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

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
  } finally {
    clearTimeout(timeout);
  }
}
