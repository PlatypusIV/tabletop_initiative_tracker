# 🎲 Tabletop Tracker

A lightweight React app for tracking initiative and effects during Dungeons & Dragons (Pathfinder mostly) combat encounters. Built to keep your fights moving smoothly without shuffling through notes.

---

## Features

- **Initiative Tracking** — Add characters and monsters to a combat roster, ordered by initiative roll.
- **Effect Tracking** — Attach active effects and conditions to any combatant and monitor them throughout the fight.
- **Turn Management** — Step through combat round by round with a clear view of who's up next.

---

## How to Use

### Starting a Combat Encounter

1. Add each combatant (players and enemies) using the add character form.
2. Enter their initiative roll for the encounter.
3. Press sort by initiative to sort the players automatically.

### Tracking Effects

- Select any combatant to attach an active effect or condition (e.g. _Poisoned_, _Stunned_, _Blessed_).
- Effects are displayed alongside the combatant so you never lose track of what's active.
- Removes effects automatically when they expire.
- Effects can be permanent too.

### Running Combat

- Use the **Next** button to advance through the initiative order.
- The current combatant is highlighted so it's always clear whose turn it is.
- The round counter increments automatically when the order cycles back to the top.
- Example dice roll: 4d6+8 or 1d8-1

---

## Tech stack

- Typescript
- React
- Redux Toolkit (TBA)

## Update Log

### v1.0.0

- Initial release.
- Initiative order tracking with automatic sorting.
- Effect and condition tracking per combatant.
- Round and turn counter.
- Dices rolling

---

_Roll for initiative._
