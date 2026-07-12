# Ash & Oak

Ash & Oak is an experimental living-world fantasy game about inhabiting a life inside a world that keeps moving without you.

The long-term goal is a persistent world where places, people, economies, injuries, property, relationships, and history accumulate consequences instead of resetting. AI may help interpret and summarize that history, but deterministic game systems—not generated prose—must create it.

## Current state

This repository currently contains a browser-based design prototype. It proves parts of the product language—commitments, named relationships, causal history, scarcity, delayed consequences, and a healer-focused scenario—but it is **not yet the intended game**.

The next milestone is a small embodied 2D vertical slice in which the player can walk from Elara's room to her clinic, meet scheduled NPCs, inspect physical supplies, diagnose a patient, prepare treatment, and observe consequences in the world.

- Play the current prototype: [chronicle-ash-oak.hypertuff.chatgpt.site](https://chronicle-ash-oak.hypertuff.chatgpt.site)
- Read the product direction: [docs/PRODUCT.md](docs/PRODUCT.md)
- See the honest implementation state: [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md)
- Follow the roadmap: [docs/ROADMAP.md](docs/ROADMAP.md)
- Use the repository as a studio: [docs/STUDIO.md](docs/STUDIO.md)
- Review recorded decisions: [docs/DECISIONS.md](docs/DECISIONS.md)

## Product mantra

> Deep enough to create history. Readable enough to live in.

The player should be free enough to become anything, but remembered enough that nothing is erased. The world should be indifferent enough to have stakes, but resilient enough to preserve attachment.

## Development

Requirements:

- Node.js `>=22.13.0`
- npm

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run lint
npm test
```

The app uses Vinext, React, TypeScript, and the Cloudflare-compatible Sites runtime. `.openai/hosting.json` preserves the connection to the deployed prototype and must remain in source control.

## Repository workflow

1. Start with an issue that describes the player experience, observable world change, and acceptance criteria.
2. Work on a focused branch.
3. Add or update tests for the behavior.
4. Open a pull request using the included template.
5. Record architectural or product-direction changes in `docs/DECISIONS.md`.
6. Playtest the result and capture confusion as a playtest issue rather than explaining it away in UI copy.

## License

No license has been selected yet. All rights are reserved unless and until the repository owner adds one.
