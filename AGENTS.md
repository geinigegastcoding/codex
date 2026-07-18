# Custom Rules

- Whenever the user types `/end` or requests to end and summarize the conversation, you MUST load and execute the global `end-conversation` skill. Do not perform any other actions or ask further questions. Simply generate the token-optimized summary, write it to the `E:\MData\Kennis\logs` folder using the specified template and naming convention, and output the single-sentence confirmation.
- By default, always write or create `.md` files within the `E:\MData\Kennis` directory, as it serves as the central context vault for the project, unless the user explicitly specifies another location. Or if they are specific for a certain project or folder and doesn't serve the general context.

## General Rules

- **Think before coding**: No silent assumptions. State assumptions explicitly, surface trade-offs, ask before guessing, and push back if a simpler approach exists.
- **Simplicity first**: Write the minimum code required to solve the problem. Do not add speculative features or build abstractions for single-use code. If a senior engineer would call it overcomplicated, simplify it.
- **Surgical changes**: Touch only what must be changed. Do not improve adjacent code, comments, or formatting, and do not refactor what isn't broken. Match the existing codebase style.
- **Goal-driven execution**: Define success criteria and loop until verified. Do not tell the model what steps to follow; tell it what success looks like and let it iterate.
- **Surface conflicts; don't average them**: If two patterns in the code conflict, do not blend or mix them together. Pick one (usually the newer or more thoroughly tested pattern), explain the choice, and mark the other pattern for cleanup later.
- **Read before you write**: Before adding new code, check the file exports, the location where the code is called, and any shared utilities. Ensure the model actively reviews adjacent files to avoid duplicate functions.
- **Use the model only for judgment calls**: Reserve the AI for classification, drafting, summarizing, extraction, and judgment. Do not use it for deterministic routing, retries, or parsing status codes that should follow a fixed programmatic rule.
- **Tests must verify intent, not just behavior**: Every test must prove why the business logic behavior matters, rather than just asserting that a function executed or returned a generic response.
- **Checkpoint after every significant step**: After completing a milestone, require the model to summarize three things: what was done, what was verified, and what remains left to do before moving to the next step.
- **Match codebase conventions even if you disagree**: Adhere strictly to the existing codebase patterns (e.g., matching naming conventions like snake_case or architectural patterns like class components) even if the model assumes a different style is superior.
- **Fail loud**: Do not hide uncertainty or silent errors. A task is not complete if records were silently skipped or edge cases went unchecked. The model must surface warnings and validation failures explicitly by default.

## Additional Rules

- **Always use ponytail skill full mode**: Always activate and follow the `ponytail` skill in `full` mode for any coding, refactoring, or design task.
- **Website Context**: When working on the website, FIRST read `Kennis/website.md` to understand routing and architecture. ALWAYS search for relevant context files in the `Kennis` folder before starting tasks to avoid unnecessary tool calls.
- **Before pushing website update**: alwasy check technical seo. This includes but is not limited to: Open graphs, making sure titles are no longer then 70 characters, make sure every page has as least 3 internal links, fix rotten links so only link to actual pages that are not 404's or other error codes, dont link to pages like cdn-cgi/l/email-protection it is a 404 it is used for cloudflare mailing. 
## File usage
This repo is activaly being used between two seperate computers. This means that the file paths mentioned in the repo aren't always relevant.
So here is a rule you can use to find where to work. 
- If the project file is opened in `C:\Users\Daniël\Desktop\Codex` it means that the repo is located on the laptop. This means that all mentions of a E:\MData is not relevant and should be replaced by this one for example instead of E:\MData\Kennis\council use C:\Users\Daniël\Desktop\Codex\Kennis\council. When you know you are working on the laptop a quick way to see this is checking if there is a E drive because the laptop doesn't have it. 
- If the project file is opened in E:\MData than proceed with the regular file path descriptions or as mentioned above replace the file paths of the laptop with the one associated with the E drive instead. 
- **Verify when working on website**: When you are working on the main website of magisdata always verify your work using screenshots. 
