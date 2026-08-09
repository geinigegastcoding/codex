import {describe, expect, it} from "vitest";
import {scriptSchema} from "../src/pipeline/schemas";

describe("script schema", () => {
  it("rejects remote render assets so renders stay deterministic and rerunnable", () => {
    const result = scriptSchema.safeParse({title: "Test", slug: "test", template: "technical-concept", targetDurationSeconds: 60, scenes: [{id: "one", section: "hook", narration: "A useful line.", visual: {type: "screenshot", asset: "https://example.com/image.png"}}]});
    expect(result.success).toBe(false);
  });
});
