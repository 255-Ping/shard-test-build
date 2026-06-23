# Shard — Tester Guide

Thanks for testing **Shard**, a top-down bullet-hell roguelite where you don't pick your upgrades, **you build them** from fragments enemies drop, mid-fight. This guide explains how to play, what to test, and what is intentionally unfinished so you don't report it as a bug.

Please read the **"Known incomplete / placeholder"** section near the bottom before logging issues. A lot of things are visible but not wired up yet, and that's expected at this stage.

---

## 1. How to launch

- If you were given a **web build**, open `docs/index.html` through a local web server (or the hosted link if one was shared). Opening the file directly with `file://` usually will not work; it needs to be served over `http://`.
- If you were given a **desktop build**, run the executable.
- If the build is **password protected**, a prompt appears on launch. Enter the password you were given and press **Unlock** (or Enter). If you weren't given one, the build isn't gated and you'll go straight to the menu.

---

## 2. Controls

| Action | Input |
|---|---|
| Move | **WASD** or **Arrow keys** |
| Aim | **Mouse** |
| Fire active ability | **Hold Left Mouse Button** |
| Switch ability slot | **1** / **2** |
| Open crafting | **C** (only when the Craft Meter is full) |
| Pause | **Esc** |
| Screenshot | **F12** |

The game renders at a small internal resolution and scales up, so pixel art stays crisp. The window is resizable.

---

## 3. How to play (start here if you're lost)

### Getting into a run
1. **Main Menu** → **New Character**.
2. **Create Character**: pick an **appearance** (one of four crystal avatars, purely cosmetic) and a **mode**:
   - **Standard** — death keeps your character, its stockpile, and its levels.
   - **Ironman** — *permadeath*: death ends that character for good (it stays listed but greyed out, and can never be replayed).
   - Press **Confirm**.
3. **Select Run**: this screen shows your character, level, and XP. From here you can:
   - Open **Skills** to spend skill points (see below).
   - Start **5-Minute Survival** (the only run type right now).
4. The run begins. You spawn into an open world; enemies stream in from off-screen.

To come back to an existing character later, use **Continue** from the main menu instead of New Character.

### Surviving a run
- **Survive 5 minutes.** A timer counts up at the top-centre toward `5:00`.
- At `5:00` the timer flips to **BOSS** and a large boss spawns into whatever chaos is already on screen. **Kill the boss to win.**
- You start with **10 HP** and a single basic **Projectile** ability. **There is no healing in this game** — every hit you take is permanent for the run, so dodging matters.
- Enemies deal damage by touching you. After a hit you get a brief moment of invulnerability so one bump costs one hit.
- Dying ends the run immediately (see persistence below for what you keep).

### The kill rewards
Every enemy you kill can drop:
- **Shards** (gold diamonds) — currency, used only for decrafting. Fly to you when you get close.
- **XP orbs** (cyan-green) — bank into your character's level at the end of the run.
- **Fragments** (icons) — the building blocks of your abilities (roughly a 15% drop per normal enemy). New fragments show in the bottom-right **"NEW FRAGMENTS"** overlay, which pulses to nudge you toward crafting.

---

## 4. The Craft Meter and crafting (the core of the game)

- The **Craft Meter** (bottom-centre) fills as you **kill enemies**. It starts **full** at the beginning of a run, so you can craft immediately.
- When it's full, the prompt **"CRAFT READY — press C"** appears. Press **C** to open the crafting screen. **The game pauses while you craft.** Closing the screen resumes the game and shoves nearby enemies back to give you breathing room.
- Opening the screen spends the full meter, so you have to earn the next craft with more kills.

### Inside the crafting screen
Everything is **drag-and-drop**:
- **Craft Bench** (left): drag a **base** fragment here. The base's frame appears with empty **modifier slots**. Drag **modifier** fragments onto those slots. Press the **CRAFT** button (or **C**) to assemble the ability.
- **Equipped** (top-left): your two ability slots. A freshly crafted ability auto-fills the first empty slot, otherwise it goes to **Storage**.
- **Storage** (bottom-left): crafted abilities you own but don't have equipped. Drag between Equipped and Storage to swap your loadout.
- **Fragments** (right): your loose fragment inventory; drag from here.
- A live **preview** under the bench shows what the bench will produce (damage, cooldown, etc.).

### Modifying and breaking down abilities (the decraft economy)
- **Adding** a modifier to an ability is **free** (drag a fragment onto an open socket on an equipped/stored ability).
- **Removing** a modifier costs **10 shards** and is **confirm-gated**. The removed fragment has a chance to be **destroyed** based on its rarity (Common ~50%, Rare ~15%, Epic ~10%). If it survives, it returns to your inventory.
- Once an ability is stripped down to just its **bare base** (no modifiers), you can drag it onto the **Fragments** panel to break it back into a base fragment, **for free**.

> Decrafting is intentionally risky and final — that's the design, not a bug.

---

## 5. Fragments and their interactions

### Base forms (set how many modifier slots you get)
| Base | Rarity | Slots | Behaviour |
|---|---|---|---|
| **Projectile** | Common | 3 + 1 wildcard | Single aimed bullet. The generalist. |
| **Nova** | Common | 3 + 1 | Bursts bullets in all directions; longer cooldown. |
| **Beam** | Rare | 4 + 1 | Continuous piercing ray. |
| **Trap** | Rare | 4 + 1 | Places a device that detonates when enemies approach (max 3 active). |
| **Aura** | Epic | 5 + 2 | Persistent damage zone around you. **Passive — always on while equipped.** |
| **Summon** | Epic | 5 + 2 | Orbiting entity that auto-attacks. **Passive — always on while equipped.** |

Manual bases (Projectile / Nova / Beam / Trap) fire only from the **active** slot when you hold fire. Passive bases (Aura / Summon) run on their own from **either** slot, so an off-hand aura keeps working while you shoot the other ability.

### Modifier families
- **Behavioral**: Chain (jumps between enemies), Volley (3-shot spread), Homing (seeks), Split (forks on impact), Detonate (explodes on hit/expiry).
- **Stat**: Amplify (+25% damage), Accelerate (+40% speed), Hasten (-30% cooldown).
- **Fire** 🔥: Ignite (burn stacks), Scorch (fire splash), Inferno (scales with burning enemies).
- **Ice** ❄️: Chill (frost stacks → Freeze), Glaciate (kill grants a shield), Permafrost (frozen enemies auto-shatter).
- **Void** 🟣: Corrupt (debuff → turns enemies on each other), Entropy (chaos damage roll), Unravel (void implosion on kill).
- **Light** ✨: Radiance (retaliation halo), Luminate (marks enemies, banks a stacking damage buff), Consecrate (see "incomplete" below).

### Status effects and reactions (worth testing deliberately)
- **Burn** (Fire): ticks damage; at high stacks it **spreads** to nearby enemies.
- **Chill → Freeze** (Ice): frost stacks slow the enemy, then **Freeze** it solid at full stacks.
- **Shatter** (the headline reaction): hit a **Frozen** enemy with **Fire** (or freeze a burning one) to detonate a big icy AoE scaled to the enemy's max HP. **Permafrost** makes frozen enemies shatter on their own after a couple seconds.
- **Mark** (Light/Luminate): marked enemies take **+20% damage from all sources**. Each kill by a Luminate ability banks a stacking damage buff to **all** your abilities (shown as "LIGHT ×N" under the timer).
- **Corrupt** (Void): stacks a debuff; at full stacks the enemy is **Corrupted** and attacks its own neighbours.
- **Light vs Void tension**: a void hit strips a Mark off an enemy.

Combining elements across your two ability slots (e.g. one Ice ability to freeze, one Fire ability to shatter) is the intended way to play. Please test cross-element combos heavily.

---

## 6. Persistence — what carries over between runs

This is one of the most important things to test. The model is **soft persistence**:

| Carries over | Does **not** carry over |
|---|---|
| Your **equipped loadout** (both abilities, fully assembled) | Loose **Common** fragments |
| **Rare / Epic** non-base fragments (your "stockpile") | **Shards** (reset to 0 each run) |
| Character **XP, level, and unlocked perks** | The **Craft Meter** (refills each run) |
| **Avatar** and **mode** | Base fragments are not stockpiled (you re-acquire them in-run) |

A few specifics:
- **You begin each run** with your equipped abilities plus your saved Rare/Epic stockpile. Everything else you build from what drops **during** the run.
- A **brand-new character** starts with a single bare **Projectile** equipped.
- **Surviving (killing the boss)** banks your stockpile and XP — both modes keep the character.
- **Dying in Standard** still banks your stockpile and XP; you keep the character.
- **Dying in Ironman** ends the character permanently. Its file stays so it shows in the menu greyed-out with its final level, but it can't be played again.
- **Quit to Menu** (from the Esc pause menu) also banks your run's rares.

### Leveling and skill trees
- XP banks into your character at run end and raises your **level**. Each level = **1 skill point**.
- Spend points in the **Skills** screen (from Select Run): **five element trees** (Kinetic, Fire, Ice, Void, Light), each a small branching tree where a capstone needs nodes from both branches.
- **Respec is free** — use the Respec button to refund all points and re-spend.
- Perks **only supplement** crafting (buff fragments/elements/economy). They never give you an ability.

---

## 7. What we'd like you to test

**Persistence**
- [ ] Create a character, craft an ability, survive or die, return to menu, **Continue** — is your loadout, level, and stockpile correct?
- [ ] Earn a Rare/Epic fragment, end the run, start a new run — is it in your inventory at the start?
- [ ] Level up, spend skill points, Respec, re-spend — do points and perk effects behave?
- [ ] **Ironman**: die and confirm the character becomes permanently unplayable (greyed out, Continue refuses it).
- [ ] Confirm shards and the Craft Meter reset each run, while XP/level/stockpile persist.
- [ ] Quit-to-menu from the pause screen mid-run — are rares banked?

**Fragments & crafting**
- [ ] Craft with every base form (Projectile, Nova, Beam, Trap, Aura, Summon) — do slot counts match the table above?
- [ ] Add modifiers (free), remove modifiers (costs 10 shards, can destroy), break a bare base back to a fragment (free).
- [ ] Swap loadout between Equipped and Storage; switch the active slot with 1/2 mid-fight.
- [ ] Confirm passive bases (Aura/Summon) keep firing from the **off-hand** slot.
- [ ] Try to overload a build with stacked modifiers — does damage/cooldown read sensibly in the preview?

**Interactions**
- [ ] **Shatter**: freeze an enemy with Ice, then hit it with Fire. Does the AoE pop?
- [ ] **Burn spread**, **Corrupt** turning enemies on each other, **Mark** damage bonus, **Luminate** stacking buff.
- [ ] **Glaciate** shield (kill grants a shield that eats the next hit — cyan ring around you).
- [ ] Mixing two elements across your two ability slots.

**General feel / bugs**
- [ ] Anything that crashes, freezes, or throws an error.
- [ ] Drag-and-drop that drops a fragment into the void, double-spends shards, or duplicates items.
- [ ] The boss fight at 5:00 — does it spawn, can it be killed, does the win screen show?
- [ ] Performance during big swarms.

---

## 8. Known incomplete / placeholder (please DON'T report these)

These are visible in the build but intentionally unfinished:

- **Settings menu** — the main-menu Settings button opens a "Coming soon" placeholder. No options yet.
- **The boss** is a **stub**: a big, slow, durable target with no special attacks, phases, or telegraphs. It exists to give the run a climax and a win state. Real boss behaviour comes later.
- **Some skill-tree perks are shown and selectable but have no effect yet.** Their tooltip says **"(effect coming soon)"**. They still cost a skill point if you buy them. The currently-inert perks are:
  - **Fire**: Wildfire, Scorched Earth, Pyroclasm
  - **Ice**: Deep Freeze, Shatterpoint
  - **Void**: Unstable, Implosion, Oblivion
  - **Light**: Purifier
  - (All other perks — damage, drop-weight, status-stack, shard/XP, chain/split, ice-shield, Berserker low-HP, Permafrost, Luminate/Mark perks — **are** live.)
- **Wildcard slots** appear on Rare/Epic ability frames, but **no wildcard fragments exist yet**, so those slots will always stay empty for now.
- **Consecrate** (a Light fragment) is defined but its field effect isn't built, so it **won't drop** and does nothing if encountered.
- **Void-vs-Light suppression** (a void source wiping your Luminate stacks) is wired but nothing in the current build triggers it — it's for future boss attacks.
- **Corrupt's enemy-damage reduction** isn't wired yet (Corrupt only slows for now; the friendly-fire part does work).
- **Missing art**: any fragment without finished art shows a **magenta "no texture"** placeholder of the right shape. It still works; it just looks unfinished.
- There is **no audio** yet (or it's minimal).

---

## 9. Reporting bugs

When you hit something, please include:
1. **What you did** (steps to reproduce).
2. **What you expected** vs **what happened**.
3. **Screenshot** (press **F12**) or a short clip if you can.
4. Your **character mode** (Standard/Ironman) and roughly your **level**, plus whether it was mid-run, in the craft screen, or in a menu.

Thanks for helping test Shard. Have fun breaking it.
