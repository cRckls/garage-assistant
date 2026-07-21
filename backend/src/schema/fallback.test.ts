import { buildFallbackResult } from "./fallback.js";

describe("buildFallbackResult", () => {
  it("preserves the raw customer text and records the failure reason", () => {
    const result = buildFallbackResult("engine is making a noise", "timeout");

    expect(result.status).toBe("fallback");
    expect(result.reason).toBe("timeout");
    expect(result.note.vehicleSummary).toBe("engine is making a noise");
  });

  it("leaves the rest of the note blank for manual entry", () => {
    const result = buildFallbackResult("raw text", "some error");

    expect(result.note.mainSymptoms).toEqual([]);
    expect(result.note.likelyCause).toBe("");
    expect(result.note.urgency).toBe("");
    expect(result.note.followUpQuestions).toEqual([]);
    expect(result.note.recommendedNextStep).not.toBe("");
  });
});
