# Decision log

This is a lightweight record of decisions that constrain future work. Add new entries chronologically rather than rewriting old reasoning.

## 2026-07-11 — Build an interface prototype first

**Decision:** Use a React/Vinext site to explore the Riverward visual language, causal Chronicle, commitments, healer identity, and persistent browser state.

**Result:** The prototype clarified the product's themes and produced a deployable artifact, but it over-relied on prose, panels, meters, and outcome buttons.

**Status:** Superseded as the target gameplay architecture; retained as design evidence.

## 2026-07-12 — Stop expanding the dashboard

**Decision:** Treat the existing application as a prototype rather than the game.

**Reason:** It describes significance instead of producing it. The player has no embodied presence, NPCs have no autonomous behavior, verbs resolve in one click, and the world advances only through interface actions.

**Consequence:** New gameplay work should target a spatial 2D vertical slice. React may remain for journals and management overlays, but it should not own the core simulation experience.

## 2026-07-12 — Prove one healer life before broad simulation

**Decision:** Scope the first true game slice to Riverward, nearby Greendale, approximately 20 named NPCs, and one deep healer profession.

**Reason:** A small embodied world can prove movement, routines, physical objects, disease, diagnosis, economy, relationships, and history without pretending to be an MMO.

**Consequence:** Kingdoms, PvP, magic, generational play, ships, and global scale are deferred until the core life simulation is compelling.

## 2026-07-12 — Deterministic systems create history

**Decision:** AI will not drive ordinary NPC behavior or fabricate the primary world state.

**Reason:** Coherent history requires inspectable causes, reproducibility, testing, and persistence.

**Consequence:** NPC schedules, needs, goals, disease, production, travel, and consequences should be deterministic systems using seeded randomness. AI may later summarize, interpret, and phrase the resulting history.

## 2026-07-12 — GitHub becomes the canonical studio

**Decision:** `GhostlyGawd/ash-and-oak` is the source of truth for code, documentation, assets, issues, decisions, tests, and development workflow.

**Reason:** The project needs durable continuity across agents, tools, sessions, deployments, and playtests.

**Consequence:** Future changes use issues, branches, pull requests, recorded decisions, and verified milestones. Hosted prototypes are outputs of repository state, not the only copy of it.
