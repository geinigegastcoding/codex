import {describe, expect, it} from "vitest";
import {parseCaptions} from "../scripts/research/transcripts";

describe("caption normalization", () => {
  it("removes rolling-caption duplication so WPM and hook analysis are not inflated", () => {
    const cues = parseCaptions(`WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nThe actual problem\n\n00:00:03.000 --> 00:00:05.000\nThe actual problem is not the model.\n`);
    expect(cues).toEqual([{start: 1, end: 3, text: "The actual problem"}, {start: 3, end: 5, text: "is not the model."}]);
  });
});
