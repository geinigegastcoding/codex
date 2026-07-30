# SOP: Video to PRD Conversion

## Prerequisites
- A local video file downloaded or accessible within the workspace.
- The `view_file` tool capabilities allowing analysis of video files.
- The `write_to_file` tool to save the output Product Requirements Document (PRD).

## Procedural Steps
1. **Locate and Ingest Video**:
   - Confirm the absolute path of the target video file.
   - Use the `view_file` tool to process and analyze the video file contents in their entirety.

2. **Exhaustive Feature Extraction**:
   - Systematically review the video segment-by-segment.
   - Document every single feature, UI element, interaction, user flow, and functional capability shown.
   - Note micro-interactions, layout structures, and any text/copy visible on screen. Do not omit any detail, regardless of how minor it appears.

3. **Synthesize Product Summary**:
   - Write a high-level executive summary of the product based on the observed video.
   - Define the core objective, target audience (if apparent), and primary value proposition of the product shown in the video.

4. **Draft the Product Requirements Document (PRD)**:
   - Format the extracted information into a structured PRD (referencing existing PRD structures if applicable, e.g., `dashboard-PRD.md`).
   - Include sections for:
     - 1. Objective & Vision (from the synthesis step).
     - 2. Information Architecture & Layout (from visual UI analysis).
     - 3. Core Modules & Features (detailed breakdown from step 2).
     - 4. Technology Stack (hypothesized or explicit from the video).

5. **Final Review and Output**:
   - Verify the PRD contains every detail noted during the exhaustive extraction.
   - Save the finalized PRD as a Markdown document in the appropriate project directory using `write_to_file`.

## Validation & Verification
- Check that the generated PRD includes a "Core Modules & Features" section detailing all minute elements observed in the video.
- Ensure the PRD contains a clear, concise "Objective & Vision" summary.
- Verify the output file is successfully saved in `.md` format.

## AI Execution Prompt
```text
You are tasked with converting a video into a comprehensive Product Requirements Document (PRD). 
1. Use `view_file` to analyze the provided local video file. 
2. Extract every single feature, UI element, workflow, and micro-interaction visible in the video. Leave no detail unrecorded.
3. Write a clear summary of the product's vision and core objective based on your analysis.
4. Structure your findings into a standard PRD format (Objective & Vision, Architecture & Layout, Core Features, Tech Stack).
5. Save the final PRD to the designated markdown file using `write_to_file`. 
Do not omit any detail; the PRD must be an exhaustive reflection of the video's contents.
```
