# Current implementation state

Last updated: 2026-07-12

## What exists

The repository contains a deployed React/Vinext browser prototype focused on Elara Thornfield, a healer in Riverward.

Implemented prototype surfaces:

- Commitment-selection onboarding
- A “Today” briefing
- Named patients with severity and diagnosis state
- Treatment and supply decisions
- Resource, energy, disease, bridge, debt, reputation, and relationship values
- Time advancement with recurring patients and worsening conditions
- Consequence previews describing costs, risks, and affected people
- World, work, life, and Chronicle views
- Local browser persistence
- Responsive styling
- A generated Riverward map asset
- Cloud-compatible build and artifact validation
- A live Sites deployment connected through `.openai/hosting.json`

## What it honestly is

This is a product and interface prototype. It is useful evidence about tone, information architecture, causal records, and player-purpose framing. It is not yet an embodied simulation game.

## What does not exist yet

- Direct character movement
- Tile-based or continuous navigable space
- Functional building interiors
- Physical items, containers, tools, or crafting interactions
- NPC schedules, pathfinding, jobs, inventories, goals, perception, or autonomous action
- A disease model based on specific transmission and hosts
- A treatment mechanic requiring player observation and diagnosis skill
- A world simulation that runs independently of interface actions
- Server-side persistence, accounts, multiplayer, or offline progression
- Combat, crime, law, family, inheritance, building placement, or settlement simulation
- A production AI world steward

## Known design failure

The current prototype still communicates too much through prose, buttons, bars, and predicted outcomes. It describes a living game rather than embodying one. It should not be expanded by adding more dashboard systems.

## Current technical stack

- React 19
- TypeScript
- Vinext / Vite
- Cloudflare-compatible worker output
- Tailwind imported for build compatibility; most prototype styling is custom CSS
- Browser `localStorage` for the current prototype save
- Optional Drizzle/D1 scaffolding, not active gameplay persistence

## Verification baseline

Before the repository was initialized, the prototype passed:

- `npm run lint`
- `npm test`
- Production build
- Sites artifact validation

Cloud-browser interaction testing was attempted during the latest rebuild but was unavailable under the browser policy at that time. Do not interpret the build checks as complete gameplay testing.
