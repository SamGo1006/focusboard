# Focusboard

**A calm task board that keeps work in progress under control.**

![CI](https://github.com/SamGo1006/focusboard/actions/workflows/ci.yml/badge.svg)
![Language](https://img.shields.io/badge/language-JavaScript-164e63)
![License](https://img.shields.io/badge/license-MIT-44643a)

- Responsive, three-column board with priority labels, search, and completion tracking.
- A three-task limit for active work, including imported backups.
- Local browser persistence with versioned JSON import/export.
- Keyboard-operable controls, visible focus states, accessible labels, and live status messages.
- Plain-text task rendering; no external fonts, analytics, or runtime packages.

## Quick start

Node.js 22+ and a current browser; no install step. Run these commands from the repository root after cloning.

```sh
node server.mjs
# Open http://127.0.0.1:4173
```

## Verification

```sh
node --test test/*.test.mjs
```

The CI workflow runs the test suite on pushes and pull requests. See the actual Actions result rather than assuming a badge implies success.

## How it works

`UI events → pure state functions → validated snapshot → localStorage → render`

`src/board.mjs` owns data rules and immutable operations; `src/app.mjs` handles browser storage and rendering. A save is attempted before replacing in-memory state, so storage failures are surfaced. Imported data is fully validated before replacement, and replacement asks for confirmation. Task titles are inserted with `textContent`.

The development server binds to loopback and serves an explicit file allowlist. It includes a Content Security Policy and MIME sniffing protection. The same static files can be hosted on a static host.

## Scope and tradeoffs

- Single-browser local storage; no accounts, cloud sync, collaboration, or encryption.
- Clearing browser data loses the board unless you exported a backup.
- Delete has no undo. Export important boards before editing.
- Search filters visible cards while counts reflect the entire board.
- The included server is for local development, not internet deployment.
- Imports allow at most 1,000 tasks and 1 MB; existing malformed storage is reported rather than silently replaced.

## Explore the code

See [DESIGN.md](DESIGN.md) for review questions and an extension exercise. Sample inputs are synthetic. This is an independent portfolio project, created with AI assistance and accompanied by executable tests; it is not affiliated with an employer or a production service.

## Next extension

Implement undo, indexed search, or an accessible board history view.

MIT licensed. See [LICENSE](LICENSE).
