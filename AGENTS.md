# Repository working agreement

This repository is both the game and its development studio. Agents and humans should leave it easier to understand, test, and continue than they found it.

## Product constraints

- Build a game, not a narrative dashboard.
- Prefer observable world behavior over prose that explains significance.
- Important NPCs need location, routine, possessions, health, relationships, goals, and memory—not only dialogue and trust bars.
- A player verb must involve perception, execution, uncertainty, or mastery. Do not collapse a profession into a single outcome button.
- Consequences should appear first through characters, spaces, inventories, prices, traffic, damage, and routines. The Chronicle summarizes afterward.
- AI may steward continuity and presentation, but it must not replace deterministic simulation.
- Ordinary routines are valuable. Not every moment should announce itself as historically important.
- Keep the interface contextual and quiet. Never solve unclear play by adding more permanent meters or explanatory panels without testing a simpler embodied interaction first.

## Current product boundary

The existing React app is a design prototype. The next target is the embodied 2D vertical slice specified in `docs/ROADMAP.md`. Preserve useful prototype behavior, but do not treat the current dashboard architecture as sacred.

## Engineering rules

- Keep TypeScript strict and avoid hidden global state.
- Make simulation behavior deterministic from explicit state and a seeded random source.
- Separate simulation state, simulation systems, rendering, and presentation.
- Every meaningful state transition should be testable without rendering the full interface.
- Run `npm run lint` and `npm test` before handoff.
- Do not commit secrets, local environment files, build outputs, `.sites-runtime`, or dependencies.
- Preserve `.openai/hosting.json`; it connects this source to the live prototype.
- Update `docs/CURRENT_STATE.md` when capabilities materially change.
- Add a dated entry to `docs/DECISIONS.md` for decisions that constrain future work.

## GitHub workflow

- Use issues for scoped player problems, features, bugs, and playtest findings.
- Use branches and pull requests for changes after repository initialization.
- PR descriptions must state the player-facing result, systems changed, tests run, and known limitations.
- Avoid bundling unrelated changes.
- Never mark placeholder behavior as complete gameplay.
