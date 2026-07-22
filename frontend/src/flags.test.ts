import { detectFlags } from "./flags";

describe("detectFlags", () => {
  it("returns no flags for text with no keywords", () => {
    expect(detectFlags("Grinding noise when turning left")).toEqual([]);
  });

  it("flags an MOT mention", () => {
    expect(detectFlags("Is the MOT still valid on this?")).toEqual(["MOT"]);
  });

  it("flags a service mention case-insensitively", () => {
    expect(detectFlags("due for a Service next month")).toEqual(["Service"]);
  });

  it("flags both when both are mentioned", () => {
    expect(detectFlags("needs an MOT and a service")).toEqual(["MOT", "Service"]);
  });

  it("does not match keywords embedded in other words", () => {
    expect(detectFlags("broke down on the motorway, needs a serviceable jack")).toEqual([]);
  });
});
