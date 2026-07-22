import { addSubmission, deleteSubmission, loadSubmissions } from "./storage";
import { seedSubmissions } from "./seedSubmissions";
import type { FaultSubmission } from "./types";

const STORAGE_KEY = "garage-fault-intake:submissions";

const submission: FaultSubmission = {
  id: "sub-1",
  createdAt: "2026-07-22T10:00:00.000Z",
  customerName: "Jordan Blake",
  customerPhone: "07700 900000",
  rawText: "Squealing brakes on my Honda Civic",
  result: {
    status: "ok",
    note: {
      vehicleSummary: "Honda Civic",
      mainSymptoms: ["Squealing brakes"],
      urgency: "Not specified",
      followUpQuestions: [],
    },
  },
};

beforeEach(() => {
  localStorage.clear();
});

describe("loadSubmissions", () => {
  it("seeds and persists the sample submissions when storage is empty", () => {
    const result = loadSubmissions();

    expect(result).toEqual(seedSubmissions);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(seedSubmissions);
  });

  it("returns previously saved submissions instead of reseeding", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([submission]));

    expect(loadSubmissions()).toEqual([submission]);
  });

  it("returns an empty list when the stored value is not an array", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: "an array" }));

    expect(loadSubmissions()).toEqual([]);
  });

  it("returns an empty list when the stored value is not valid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not json");

    expect(loadSubmissions()).toEqual([]);
  });

  it("filters out entries that don't match the submission shape", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([submission, { id: "sub-2", customerName: "Missing other fields" }]),
    );

    expect(loadSubmissions()).toEqual([submission]);
  });
});

describe("addSubmission", () => {
  it("prepends the new submission and persists it", () => {
    const result = addSubmission([submission], { ...submission, id: "sub-2" });

    expect(result.map((s) => s.id)).toEqual(["sub-2", "sub-1"]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(result);
  });
});

describe("deleteSubmission", () => {
  it("removes the matching submission and persists the rest", () => {
    const result = deleteSubmission([submission, { ...submission, id: "sub-2" }], "sub-1");

    expect(result.map((s) => s.id)).toEqual(["sub-2"]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(result);
  });

  it("leaves the list unchanged when the id isn't found", () => {
    const result = deleteSubmission([submission], "does-not-exist");

    expect(result).toEqual([submission]);
  });
});
