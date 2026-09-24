# supraset.com

A brief portfolio site: it tells visitors what the owner does professionally and how to get in touch.

## Priorities

The portfolio comes first. The site is also a place for experiment and expression, and that side stays secondary: when an experiment competes with the portfolio's message or the path to contact, the portfolio wins.

## Constraints

- Hosted on Netlify.
- pnpm is the only package manager.
- Netlify is the only infrastructure. Propose any new external service or dependency on other infra before adding it.

## Verifying changes

- A change is done when `pnpm build` passes (it runs `astro check`).
- Add unit tests where they guard against a real regression. Keep testing at the unit level; scripted component and e2e tests are out of scope for now.

## Design and taste

Changes that serve plain communication (clarity, legibility, accessibility) proceed directly. Any choice of design or taste beyond that (visual style, layout, interaction, tone of copy) is the owner's call: ask for a decision before making it.

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the default labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
