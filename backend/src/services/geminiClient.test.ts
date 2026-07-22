import { ApiError } from "@google/genai";
import { toFriendlyMessage } from "./geminiClient.js";

describe("toFriendlyMessage", () => {
  it("gives a friendly message for a 503 (high demand)", () => {
    const error = new ApiError({
      status: 503,
      message: JSON.stringify({
        error: { code: 503, message: "This model is overloaded.", status: "UNAVAILABLE" },
      }),
    });

    expect(toFriendlyMessage(error)).toBe(
      "The AI service is currently experiencing high demand. Please try again shortly.",
    );
  });

  it("gives a friendly message for a 429 (rate limited)", () => {
    const error = new ApiError({ status: 429, message: "quota exceeded" });
    expect(toFriendlyMessage(error)).toBe(
      "The AI service is rate-limited right now. Please try again shortly.",
    );
  });

  it("unwraps the nested error message for other API errors", () => {
    const error = new ApiError({
      status: 404,
      message: JSON.stringify({
        error: { code: 404, message: "Model not found.", status: "NOT_FOUND" },
      }),
    });

    expect(toFriendlyMessage(error)).toBe("Model not found.");
  });

  it("falls back to a generic message when the API error body isn't JSON", () => {
    const error = new ApiError({ status: 500, message: "not json" });
    expect(toFriendlyMessage(error)).toBe("AI service error (status 500).");
  });

  it("passes through a plain Error's message unchanged", () => {
    expect(toFriendlyMessage(new Error("This operation was aborted"))).toBe(
      "This operation was aborted",
    );
  });

  it("handles non-Error values", () => {
    expect(toFriendlyMessage("weird throw")).toBe("Unknown error");
  });
});
