import { Type } from "@google/genai";
import { z } from "zod";

export const faultNoteSchema = z.object({
  vehicleSummary: z.string(),
  mainSymptoms: z.array(z.string()).min(1),
  likelyCause: z.string(),
  urgency: z.string(),
  recommendedNextStep: z.string(),
  followUpQuestions: z.array(z.string()),
});

export type FaultNote = z.infer<typeof faultNoteSchema>;

export function validateFaultNote(data: unknown): FaultNote | null {
  const result = faultNoteSchema.safeParse(data);
  return result.success ? result.data : null;
}

// Mirrors faultNoteSchema for the Gemini API's `responseSchema` config —
// Gemini's structured output needs its own JSON-schema-shaped descriptor,
// not a Zod schema, so the two are kept in sync by hand.
export const faultNoteResponseSchema = {
  type: Type.OBJECT,
  properties: {
    vehicleSummary: {
      type: Type.STRING,
      description: "Make, model, year and colour if mentioned",
    },
    mainSymptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    likelyCause: {
      type: Type.STRING,
      description: "Likely cause or component, if inferable",
    },
    urgency: {
      type: Type.STRING,
      description: "Urgency level or customer's preferred arrival time",
    },
    recommendedNextStep: { type: Type.STRING },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "vehicleSummary",
    "mainSymptoms",
    "likelyCause",
    "urgency",
    "recommendedNextStep",
    "followUpQuestions",
  ],
};
