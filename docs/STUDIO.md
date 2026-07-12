# Repository as development studio

This repository is the durable operating system for Ash & Oak. Product thinking, code, assets, tests, playtest findings, architectural decisions, releases, and automation should converge here.

## Sources of truth

| Concern | Source |
| --- | --- |
| Product principles | `docs/PRODUCT.md` |
| What actually works | `docs/CURRENT_STATE.md` |
| Planned milestones | `docs/ROADMAP.md` |
| Architectural/product decisions | `docs/DECISIONS.md` |
| Agent behavior | `AGENTS.md` |
| Implementation | Repository source and tests |
| Work queue | GitHub Issues |
| Change review | Pull requests |
| Released prototype | Tagged commits and Sites checkpoints |

## Issue-first development

Every substantial change starts with a player-facing problem. An issue should answer:

1. What can the player currently not perceive, decide, or do?
2. What observable behavior should exist in the world?
3. Which simulation systems own that behavior?
4. How will we verify it without relying only on prose or screenshots?
5. What is explicitly outside the issue's scope?

Use playtest issues for confusion. Do not immediately solve confusion by adding instructions. First ask whether the world, affordance, feedback, or verb itself is missing.

## Pull-request standard

A pull request should include:

- Player-facing result
- Systems and data changed
- Evidence of observable consequences
- Tests run
- Screenshots or recordings when presentation changed
- Known limitations and follow-up issues
- Documentation updates when the repository's truth changed

## Dogfooding loop

1. Build the smallest playable behavior.
2. Play it without developer narration.
3. Record moments of confusion, boredom, false choice, or missing feedback.
4. Convert those observations into issues.
5. Let an agent or human implement one bounded issue on a branch.
6. Review both code and player experience.
7. Merge, deploy, and repeat.

## Agent usage

Agents are useful for scoped implementation, test creation, repository research, issue triage, visual asset generation, documentation maintenance, CI diagnosis, and PR feedback.

Agents should not be asked to “make the whole world alive” in one unbounded pass. Give them observable acceptance criteria and require them to distinguish implemented systems from illustrative placeholders.

When a capability needs a new skill or tool, record the need in an issue and document the installed workflow. Never place credentials or personal tokens in the repository.

## Release discipline

- `main` should represent the best known integrated state.
- Use branches and draft pull requests for work in progress.
- Tag meaningful playable builds.
- Update `CURRENT_STATE.md` before calling a milestone complete.
- Preserve the live Sites project identity in `.openai/hosting.json` while that deployment remains useful.
- Do not describe a feature as complete unless its acceptance criteria are exercised.
