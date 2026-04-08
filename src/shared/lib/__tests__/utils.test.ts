import { cn } from "../utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base-class", false && "hidden", "visible");
    expect(result).toContain("visible");
  });
});
