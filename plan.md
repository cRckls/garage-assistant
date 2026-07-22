GOAL:
An automotive maintenance garage receives text descriptions of vehicle faults from customers. We need to Build a small application that helps transform this information into something more useful for a service adviser or workshop. 
The information should be concise and accurate. Any incorrect values should be checked before showing to a user.
We only have a few hours to work on this so the tech stack needs to be pragmatic and quick to set up.

## Structured Note Output
The AI parsing step should produce a structured note with these fields:
- vehicle summary (make/model/year if mentioned)
- main symptoms
- urgency or arrival preference
- follow-up questions for the customer

Deliberately excludes a "likely cause" or "recommended next step" field — the
human service adviser reviewing the note is better placed to judge cause and
next steps than the AI's guess, so surfacing one risked anchoring their
judgement.

## AI Provider
Use the Google Gemini API (native structured/JSON output via `responseSchema`) through `@google/genai` — no third-party wrapper. Read the key from `GEMINI_API_KEY` in `.env`. Default to a fast, free-tier-friendly model (e.g. a Flash-tier model) since this is a structured extraction task, not open-ended generation — check the current model list at build time in case names have shifted.

## Architectural Constraints (Non-Negotiable)
-NO Heavy Orchestration Frameworks: Do not pull in LangChain, Indexing/RAG engines, or complex agent systems. Use the native model SDK with explicit TypeScript typing and native JSON schema output / structured outputs.
-Lightweight Footprint: The architecture must consist of a modular Node.js/Express backend and a clean Vite + React + TypeScript frontend. Keep data persistence simple—use local JSON file storage or an in-memory data store for state. Do not spin up databases (Prisma, PostgreSQL, MongoDB, etc.).
-Styling: Use Tailwind CSS for layout/utility styling — no hand-written raw CSS files beyond Tailwind's own entry point. Chakra UI (v3) supplies specific interactive components (Textarea, Button, Badge) rather than raw HTML elements; the two coexist rather than one replacing the other.
-Explicit Error Handling & Fallback UX: AI models are non-deterministic. Every API call must be safely wrapped. If the model fails or returns unexpected schemas, catch the error gracefully and return structured payloads that allow the frontend to fall back to a manual user entry workflow.
-Timeouts count as failures: wrap the AI call with a request timeout so a slow/hung response triggers the same fallback path as an invalid schema, rather than leaving the UI hanging.

## Development Workflow
- Iterative Commits: Execute tasks in small, atomic phases. After successfully setting up a boundary or structural unit (e.g., Express server boilerplate, data validation utils, front-end dashboard shell), ask to execute a git commit with a clear semantic commit message prefix (`feat:`, `fix:`, `test:`).
-Install Vitest as our test runner for both the frontend and backend workspaces. 
Keep configurations lean, enable global test definitions in the config, and use Vitest 
to accompany our core processing utilities with fast, reliable unit tests.
- any information such as api keys, secrets etc should be kept in a .env file or equivalent to make sure no sensitive data is shared publicly.

-As this is an assessed exercise we will need to keep a short DEVELOPMENT.md file with prompts we used, decisions Claude Code helped make, or why we rejected an approach.

- there will need to be a simple readme file to explain how to run the project locally.

- Use the sample fault descriptions in `mock_data/mock-faults.json` as a "load sample" option in the UI so the app can be demonstrated immediately without typing.