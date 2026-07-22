# Development Notes

Decisions and trade-offs made while building this with Claude Code, kept for
review alongside the commit history.

## Chakra UI bundle size

Added Chakra UI v3 (`Textarea`, `Button`, `Badge`) for specific components,
styled with Tailwind everywhere else. This pushed the production bundle from
~190KB (60KB gzipped) to ~452KB (126KB gzipped).

That cost is mostly Chakra's shared runtime — Emotion (CSS-in-JS), the Ark UI
headless primitive layer underneath every component, and the styled-system/
theme engine (`createSystem(defaultConfig)` pulls in the *entire* default
theme: every color palette and component recipe, not just the three
components actually used) — rather than the three components themselves,
which already tree-shake via named imports.

Options considered: a slimmed custom theme config instead of `defaultConfig`,
dropping Chakra's theming layer for `@ark-ui/react` directly (its headless
base, styled with Tailwind), or reverting to plain HTML + Tailwind for these
three elements. Decided to keep Chakra as-is for this exercise — the app is
still fast enough in practice, and the added weight isn't worth the effort to
optimize given the time-boxed scope. Would revisit for a production app.
