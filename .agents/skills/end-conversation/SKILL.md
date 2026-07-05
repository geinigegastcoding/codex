---
name: end-conversation
description: Summarize the current conversation, generate a token-optimized log file containing key decisions, files changed, and next steps, and save it in the Kennis/logs folder.
---
# end-conversation Skill

This skill is activated when the user types `/end` or requests to end and summarize the conversation. The goal is to generate a highly concise, token-optimized summary of the session and save it as a log file in the `Kennis/logs` folder.

## Execution Workflow

1. **Information Gathering**:
   - Identify the current date in `YYYY-MM-DD` format (using the current system time provided in the metadata).
   - Retrieve the current **Session ID** (Conversation ID) from the metadata or environment.
   - Identify all files that were created, modified, or deleted during this conversation.
   - Identify key decisions made, assumptions, and next steps.
   - Identify related notes (e.g. files in the `Kennis` directory that were referenced or updated).

2. **Log Drafting Guidelines**:
   - **Tone & Style**: Extremely concise, token-optimized, direct, and dense. No conversational filler, no introductory/concluding fluff, and no unnecessary words.
   - **Topic Name**: Choose a descriptive topic name of 2-5 words (e.g. "Skill Creation", "Page Removal & Mobile Perf").
   - **Template**:
     ```markdown
     # YYYY-MM-DD - <Topic Name>

     - **Session ID**: <Session_ID>

     ## Summary
     <A dense, token-optimized summary of the session's objectives, accomplishments, and context (1-3 sentences max).>

     ## Files Changed
     - `<file_path>` (<created|modified|deleted>)

     ## Key Decisions & Assumptions
     - <Decision/Assumption 1>
     - <Decision/Assumption 2>

     ## Next Steps
     - <Action item 1>
     - <Action item 2>

     ## Related Notes
     - [[<note_name_1>]]
     - [[<note_name_2>]]
     ```

3. **File Output**:
   - Format the filename as `YYYY-MM-DD - <Topic Name>.md`.
   - **Target Directories**:
     1. First, attempt to save the file to `E:\MData\Kennis\logs/<Filename>`.
     2. If `E:\MData\Kennis\logs` is unavailable or fails (e.g. the directory or drive does not exist), save the file to the workspace's local log directory: `C:\Users\Daniël\Desktop\Codex\Kennis\logs/<Filename>`.
   - Ensure the selected target directory exists before writing.

4. **Completion**:
   - Output **exactly** a single-sentence factual confirmation indicating the path where the log was created.
   - Do NOT ask any follow-up questions, do NOT output conversational filler, and do NOT write any other text.
     - *Example*: `I have summarized the conversation and saved the log to C:/Users/Daniël/Desktop/Codex/Kennis/logs/2026-06-30 - Skill Creation.md.`
