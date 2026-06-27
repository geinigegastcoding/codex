# Custom Rules

- Whenever the user types `/end` or requests to end and summarize the conversation, you MUST load and execute the global `end-conversation` skill. Do not perform any other actions or ask further questions. Simply generate the token-optimized summary, write it to the `E:\MData\Kennis\logs` folder using the specified template and naming convention, and output the single-sentence confirmation.
- By default, always write or create `.md` files within the `E:\MData\Kennis` directory, as it serves as the central context vault for the project, unless the user explicitly specifies another location.
