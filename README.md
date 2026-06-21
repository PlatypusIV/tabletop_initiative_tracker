# 🎲 Tabletop Tracker

A lightweight React app for tracking initiative, hitpoints, and effects during Dungeons & Dragons (Pathfinder mostly) combat encounters. Built to keep your fights moving smoothly without shuffling through notes.

---

## Features

- **Initiative Tracking** — Add characters and monsters to a combat roster, sorted by initiative roll.
- **Hitpoint Tracking** — Edit a combatant's HP inline, including arithmetic input like `-5+3` to apply damage and healing in one go.
- **Defense Tracking** — Record each combatant's defenses (e.g. `ac: 18, ff: 14, t: 12`).
- **Effect Tracking** — Attach active effects and conditions to any combatant, each with a name, description, and round duration.
- **Turn & Round Management** — Step through combat round by round with a clear view of who's up next; the current combatant is highlighted.
- **Saved Characters** — Save combatants to a reusable collection and drop them back into any encounter, with search and delete.
- **Dice Roller** — Roll dice formulas (e.g. `4d6+8`, `1d8-1`) with a running log of recent results.
- **Persistence** — The current roster, active turn, and saved characters are stored in the browser's local storage, so your encounter survives a refresh.

---

## How to Use

### Starting a Combat Encounter

1. Press **Add character** and fill in the name, hitpoints, initiative score, and defense for each combatant (players and enemies).
2. Press **Sort by initiative** to order the roster automatically.

### Managing Combatants

- Click a combatant's **Hitpoints**, **Initiative**, or **Defense** value to edit it inline.
- Hitpoint edits accept arithmetic — type `-7` to take damage, `+5` to heal, or `-7+2` to combine them.
- Use the up/down arrows to reorder a combatant manually.
- Press **Save** on a combatant to store it in your saved characters collection for reuse.

### Saved Characters

- Open the **Add character** modal to see your saved characters list.
- Search by name, then press **Add** to drop a saved combatant into the current encounter, or **✕** to delete it permanently.

### Tracking Effects

- Add an effect to any combatant with a name, description, and a number of rounds (e.g. _Poisoned_, _Stunned_, _Blessed_).
- Effects are displayed alongside the combatant so you never lose track of what's active.
- Durations count down automatically each round and the effect is removed when it expires.
- Set the duration to `0` for a permanent effect.

### Running Combat

- Use the **Next** button to advance through the initiative order.
- The current combatant is highlighted so it's always clear whose turn it is.
- The round counter increments automatically when the order cycles back to the top.
- **Reset round** sends the turn marker back to the top, **Clear all** wipes the roster (with a confirmation prompt).

### Rolling Dice

- Enter a formula such as `4d6+8` or `1d8-1` and press **Roll**.
- The most recent rolls are kept in a log; press **Clear logs** to empty it.

---

## Tech stack

- TypeScript
- React 19
- Redux Toolkit
- Vite
- Tailwind CSS
- Browser local storage for persistence

---

## Update Log

### v1.2.0 — UI unification

This release is a visual overhaul; the underlying mechanics (dice rolling, hitpoints, effects, saved characters) were already in place and were re-skinned here.

- Unified dark theme driven by shared CSS design tokens across the cards, modal, and dice roller.
- Combatant effects redesigned from a plain list into a styled table (name / effect / duration) with an empty state.
- Stat rows (hitpoints, initiative, defense) restyled with consistent inline-edit controls.
- Dice roller and round counter restyled to match the new look.
- Random background art and a loading screen; removed the old footer.

### v1.1.0

- Added Redux Toolkit.

### v1.0.0

- Initial release.
- Initiative order tracking with automatic sorting.
- Effect and condition tracking per combatant.
- Round and turn counter.
- Dice rolling.

---

App is visible at: https://platypusiv.github.io/tabletop_initiative_tracker/
