# Roadmap

The roadmap is organized around proving an actual game, not expanding the existing dashboard prototype.

## Milestone 0 — Repository and studio foundation

- [x] Canonical GitHub repository
- [x] Preserve live prototype source and hosting identity
- [x] Record product direction and current limitations
- [x] Add agent working agreement
- [x] Add issue and pull-request templates
- [x] Add continuous integration for lint and tests
- [ ] Establish release and playtest labels

## Milestone 1 — One embodied day

The player can live one coherent day as Elara.

Acceptance criteria:

- Walk from Elara's room to the clinic
- Open and close doors
- Interact with shelves, a bed, a stove, the clinic sign, and treatment table
- Open the clinic for business
- A scheduled NPC walks from their home to the clinic
- The player can greet, examine, diagnose, and treat that NPC
- Medicine uses physical ingredients from storage
- The patient leaves and follows a recovery state over time
- The game saves and restores the exact world state
- The permanent UI contains only contextual essentials

Technical work:

- Select Phaser or PixiJS after a small rendering spike
- Create tilemap and collision pipeline
- Implement input, movement, interaction targeting, and camera
- Define simulation clock and deterministic seeded randomness
- Separate simulation state from rendering
- Add IndexedDB save versioning

## Milestone 2 — One living week

- 20 named Riverward residents
- Homes, workplaces, schedules, pathfinding, inventories, money, health, goals, relationships, and memories
- Five illnesses with overlapping symptoms
- Eight medicinal ingredients
- Diagnosis, remedy preparation, dosage, and aftercare
- Clinic opening hours, capacity, pricing, charity, and deferred payment
- Market inventory driven by local production and consumption
- Weather and day/night affecting routines
- A journal that records observed events after they occur

## Milestone 3 — The Greendale outbreak

- Water use and contact-based disease transmission
- Greendale farms and lower well as functional world locations
- Illness changes household labor, production, travel, and demand
- The player can notice patterns through patients and observation
- Investigation happens through spatial evidence and conversations
- Multiple interventions with uncertain second-order consequences
- Visible recovery, loss, migration, shortages, and relationship change
- Chronicle summary generated from the actual event graph

## Milestone 4 — Professions and property

- Generalize occupation, workplace, production, contract, and reputation systems
- Add farmer and merchant as second and third deep lifestyles
- Functional property ownership, leases, taxation, damage, repair, and historical memory
- Settlement infrastructure and local public works

## Milestone 5 — Persistent shared world research

- Server-authoritative simulation prototype
- Accounts and character identity
- Offline time advancement
- Simulation fidelity promotion/demotion
- Concurrency and conflict model
- Abuse and griefing protections
- AI steward limited to continuity, summarization, rumors, and high-level interpretation

## Explicitly deferred

Combat, PvP, kingdoms, permanent death, magic, ships, generational play, and full MMO scale remain design questions. They should not block proving one embodied, systemic life.
