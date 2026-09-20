# Fluxo Design System

## Direction

Fluxo is an Operate workspace for beginners managing personal finances. The interface prioritizes scan speed, predictable actions and guided interpretation. The approved composition is `.impeccable/mocks/decision/comp-c.png`: a ledger-first dashboard with the Fluxometer as a companion inspector.

The system is structurally inspired by rigorous, accessible token-based product systems. It does not copy proprietary components or branding.

## Color tokens

Components consume semantic CSS variables from `src/index.css`; they do not own visual hex values. Category colors are persisted domain data and are selected from the centralized options in `src/lib/category-options.ts`.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#FFFFFF` | `#0F0F0F` |
| Secondary surface | `#F3F3F3` | `#181818` |
| Raised surface | `#FFFFFF` | `#222222` |
| Main text | `#111111` | `#F7F7F7` |
| Secondary text | `#5E5E5E` | `#A6A6A6` |
| Divider | `#D8D8D8` | `#333333` |
| Primary action | `#000000` | `#FFFFFF` |
| Brand | `#146B4A` | `#4FD49A` |
| Positive | `#087F5B` | `#4FD49A` |
| Negative | `#C63C32` | `#FF776D` |
| Warning | `#8A5500` | `#F4B860` |
| Information | `#276EF1` | `#6EA0FF` |

The light theme is the default. The selected theme is stored under `fluxo-theme` and applied before React mounts.

## Typography

- IBM Plex Sans Variable: navigation, headings, body, controls and financial values.
- Fraunces Variable: Fluxometer score and its main diagnostic emphasis.
- IBM Plex Mono: chart axes, compact dates and technical measurements.
- Financial values use tabular lining numerals without changing the family to mono.
- Page title: `28/34`, weight 700.
- Section title: `20/28`, weight 600.
- Body: `16/24`, weight 400.
- Compact interface: `14/20`, weight 500.
- Metadata: `12/16`, weight 600.

## Geometry and spacing

- Base grid: 4px.
- Main spacing values: 8, 12, 16, 24, 32 and 48px.
- Radius vocabulary: 0, 4 and 8px.
- Separation relies on surfaces, 1px dividers and whitespace. Shadows are reserved for overlays and the elevated mobile action.
- Interactive targets are at least 44px.

## Shell and responsive behavior

- Desktop (`>= 768px`): fixed 216px sidebar and sticky utility header.
- Tablet (`768x1024`): sidebar remains; dense tables switch to semantic lists when the remaining content width is insufficient.
- Mobile: contextual top bar, four-destination bottom navigation and central add action. Tables become lists with visible actions.
- The dashboard uses a 12-column composition at wide desktop and stacks ledger, diagnosis, chart and goals on narrower screens.

## Core components

- Monthly metric rail: current balance, income, expenses, savings rate and Fluxometer score.
- Transaction ledger: table on desktop, list on mobile/tablet; signed values and textual transaction types.
- Fluxometer inspector: score, classification, segmented scale, contributing factors, guidance and calculation disclosure.
- Goal rows: current value, target, percentage, deadline and textual status.
- Category rows: explicit icon map, domain color, type and always-visible edit/delete actions.
- Dialogs: field-level validation, recoverable submit errors and preserved form values.
- Feedback: loading skeletons, empty states, actionable errors, confirmation messages and `Tentar novamente` controls.

## Backend constraints

- The dashboard represents `DashboardResponseDTO` and its nested DTOs.
- The API currently exposes the current month only, so the UI has no fake month selector.
- `TransacaoResponseDTO` has no running balance, so transaction tables do not invent a balance column.
- The Fluxometer remains a transparent frontend calculation using monthly totals, comparison, recurring expenses and active goals.

## Accessibility and motion

- WCAG AA token contrast in both themes.
- Visible focus ring, keyboard-operable controls and accessible names for icon-only actions.
- Status never depends on color alone.
- Progress animations use `transform`; no width animation is used.
- `prefers-reduced-motion` removes nonessential transitions and animations.
- Recoverable errors use live regions and state-preserving actions.
