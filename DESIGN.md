# Engineering walkthrough

## The core decision

`UI events → pure state functions → validated snapshot → localStorage → render`

`src/board.mjs` owns data rules and immutable operations; `src/app.mjs` handles browser storage and rendering. A save is attempted before replacing in-memory state, so storage failures are surfaced. Imported data is fully validated before replacement, and replacement asks for confirmation. Task titles are inserted with `textContent`.

The development server binds to loopback and serves an explicit file allowlist. It includes a Content Security Policy and MIME sniffing protection. The same static files can be hosted on a static host.

## Review it yourself

1. Run the documented example and trace one input through the implementation.
2. Run the tests, then change one edge-case input and predict the result.
3. Explain the memory and runtime costs and identify a scaling limit.
4. Implement one improvement, add a regression test, and explain the tradeoff in the commit.

## Suggested next change

Implement undo, indexed search, or an accessible board history view.

## Boundaries

- Single-browser local storage; no accounts, cloud sync, collaboration, or encryption.
- Clearing browser data loses the board unless you exported a backup.
- Delete has no undo. Export important boards before editing.
- Search filters visible cards while counts reflect the entire board.
- The included server is for local development, not internet deployment.
- Imports allow at most 1,000 tasks and 1 MB; existing malformed storage is reported rather than silently replaced.
