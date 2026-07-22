import request from "supertest";
import { app } from "../app.js";

vi.mock("../services/geminiClient.js", () => ({
  parseFaultFromText: vi.fn(),
}));

import { parseFaultFromText } from "../services/geminiClient.js";

const mockedParseFaultFromText = vi.mocked(parseFaultFromText);

describe("POST /api/faults/parse", () => {
  beforeEach(() => {
    mockedParseFaultFromText.mockReset();
  });

  it("returns 400 when rawText is missing", async () => {
    const res = await request(app).post("/api/faults/parse").send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 when rawText is empty", async () => {
    const res = await request(app).post("/api/faults/parse").send({ rawText: "   " });
    expect(res.status).toBe(400);
  });

  it("returns the parsed note when the AI call succeeds", async () => {
    const note = {
      vehicleSummary: "2018 Ford Fiesta",
      mainSymptoms: ["Grinding noise"],
      urgency: "Thursday",
      followUpQuestions: ["Any other noises?"],
    };
    mockedParseFaultFromText.mockResolvedValueOnce(note);

    const res = await request(app)
      .post("/api/faults/parse")
      .send({ rawText: "grinding noise" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", note });
  });

  it("falls back to a manual review draft when the AI call fails", async () => {
    mockedParseFaultFromText.mockRejectedValueOnce(new Error("timeout"));

    const res = await request(app)
      .post("/api/faults/parse")
      .send({ rawText: "grinding noise" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("fallback");
    expect(res.body.reason).toBe("timeout");
    expect(res.body.note.vehicleSummary).toBe("grinding noise");
  });
});
