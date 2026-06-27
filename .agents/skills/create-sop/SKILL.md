---
name: create-sop
description: Create a highly detailed, token-optimized SOP (Standard Operating Procedure) for a specified topic, incorporating context from the Kennis folder, and saving it to E:\MData\Kennis\SOP's\<topic>-SOP.md.
---
# create-sop Skill

This skill is activated when the user requests an SOP (Standard Operating Procedure) for a topic. The goal is to generate a highly detailed, token-optimized SOP for either a human or an AI to follow.

## Execution Workflow

1. **Information Gathering**:
   - Identify the target topic requested by the user.
   - Search the `E:\MData\Kennis` folder for any relevant files, notes, or logs. Use `grep_search` and `list_dir` to find matching documents.
   - Read relevant context files using `view_file`.

2. **SOP Drafting Guidelines**:
   - **Tone & Style**: Dense, technical, direct. No conversational filler, no introductory/concluding fluff, and no unnecessary words. Use compact markdown.
   - **Target Audience**: Dual-use. Clear enough for a human, precise and structured enough for an AI agent.
   - **Structure**:
     - **Title**: `# SOP: <Topic Name>`
     - **Prerequisites**: Bulleted list of required inputs, tools, settings, or state.
     - **Procedural Steps**: Numbered sequential actions. Each step must be clear, actionable, and unambiguous. Use sub-bullets for specific details or edge cases.
     - **Validation & Verification**: Specific checks to confirm the procedure was completed successfully (e.g. expected outputs, commands to run, log checks).
     - **AI Execution Prompt**: A fenced block containing a highly optimized system instruction/prompt that an AI agent can ingest to perform this exact task programmatically.

3. **File Output**:
   - Format the filename as `<sanitized-topic-name>-SOP.md`.
   - Save the file directly to `E:\MData\Kennis\SOP's/<sanitized-topic-name>-SOP.md`.
   - Ensure the directory `E:\MData\Kennis\SOP's` exists (create it if needed).

4. **Completion**:
   - Output a single-sentence factual confirmation indicating the path where the SOP was created, followed by a brief summary of the key sections included. Do not praise the quality of the generated SOP.
