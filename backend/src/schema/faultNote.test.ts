import { validateFaultNote } from "./faultNote.js";

const validNote = {
  vehicleSummary: "2018 Ford Fiesta",
  mainSymptoms: ["Grinding noise when turning"],
  likelyCause: "Worn CV joint",
  urgency: "Thursday drop-off",
  recommendedNextStep: "Inspect suspension and steering",
  followUpQuestions: ["Any recent pothole impacts?"],
};

describe("validateFaultNote", () => {
  it("accepts a well-formed note", () => {
    expect(validateFaultNote(validNote)).toEqual(validNote);
  });

  it("rejects a note missing a required field", () => {
    const { likelyCause, ...incomplete } = validNote;
    expect(validateFaultNote(incomplete)).toBeNull();
  });

  it("rejects a note with the wrong field type", () => {
    expect(validateFaultNote({ ...validNote, mainSymptoms: "not an array" })).toBeNull();
  });

  it("rejects an empty mainSymptoms array", () => {
    expect(validateFaultNote({ ...validNote, mainSymptoms: [] })).toBeNull();
  });

  it("rejects non-object input", () => {
    expect(validateFaultNote("just a string")).toBeNull();
  });
});
