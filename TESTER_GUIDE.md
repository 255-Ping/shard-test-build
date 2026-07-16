# Shard: Tester Guide

Thanks for testing **Shard**, a top-down bullet-hell roguelite where you don't pick your upgrades, **you build them** from fragments enemies drop, mid-fight. This guide explains how to play, what to test, and what is intentionally unfinished so you don't report it as a bug.

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
| Pause (full menu) | **Esc** |
| Peek pause (freeze, keep the board visible) | **P** |
| Screenshot | **F2** (see "Where screenshots go" below) |
| Toggle HUD | **F1** |
| Open console | **~** (tilde, if enabled in Settings > Developer) |

The game renders at a small internal resolution and scales up, so pixel art stays crisp. The window is resizable.

### Where screenshots go

**Tip: press `P` to freeze the action first.** `P` is a "peek pause", it freezes the run but keeps the whole game board visible (unlike `Esc`, which covers the screen with a menu). That makes it easy to line up and capture exactly the moment you want before you take a screenshot. Press `P` again to resume.

The in-game **F2** screenshot saves a PNG named `shard_<date>_<time>.png`, but **where it lands depends on how you're playing**:

- **Playing in your browser (the GitHub Pages link):** F2 saves the image into the browser's *private storage* for the page, **not** to your Downloads folder. You can't easily get the file back out, so **F2 is not useful for sharing screenshots on the web build.** Use your operating system's screenshot tool instead:
  - **Windows:** `Win` + `Shift` + `S` (Snipping Tool), or `PrtSc`.
  - **macOS:** `Cmd` + `Shift` + `4`.
  - Then paste or attach that image to your bug report.
- **Playing a downloaded desktop build:** F2 saves to the game's user-data folder, and the full path is printed to the log/console each time. The folder is:
  - **Windows:** `%APPDATA%\Shard\screenshots\` (paste that into the File Explorer address bar).
  - **macOS:** `~/Library/Application Support/Shard/screenshots/`
  - **Linux:** `~/.local/share/Shard/screenshots/`

If you're on the GitHub Pages link, just assume **F2 won't help** and grab screenshots with your OS shortcut above.

### Audio & Settings

The game has sound: a looping menu track, two battle themes that alternate during a run, and effect/UI sounds (pickups, run start, the craft-meter-full chime, button and slider clicks). On the **web build**, audio is muted by the browser until your **first click or keypress**, then it kicks in; that first-gesture delay is normal, not a bug.

Open **Settings** from the main menu to adjust:
- **Volume**: Master, Music, Effects, and UI Sounds (independent sliders).
- **Display**: toggle the bottom-right **"new fragments"** overlay, bullet trails toggle, and a **HUD Size** slider.
- **Accessibility**: toggle to show/hide the HUD (also toggled by F1).
- **Developer**: console toggle (~ key), session logging toggle, and an "Open data folder" button.

Settings are saved and persist between sessions.

---

## 3. How to play (start here if you're lost)

### The Main Menu
From the menu you have:
- **New Character** / **Continue** (resume a saved character).
- **Collection**: a game-wide discovery log of every fragment in the game (see section 6).
- **Settings**: audio volumes, display, accessibility, and developer options (see "Audio & Settings" above).
- **Exit**.

### Getting into a run
1. **Main Menu** -> **New Character**.
2. **Create Character**: pick an **appearance** (one of four crystal avatars, purely cosmetic) and a **mode**:
   - **Standard**: death keeps your character, its stockpile, and its levels.
   - **Ironman**: *permadeath*, death ends that character for good (it stays listed but greyed out, and can never be replayed).
   - Press **Confirm**.
3. **Run Select**: this screen shows your character, level, and XP. From here you can:
   - Open **Skills** to spend skill points (see below).
   - Open **Stats** to see your character's run history.
   - Press **Play** to go to run selection.
4. **Run Selection**: press **Create Custom Run** to open the custom builder. Pick your options:
   - **Time length**: 1:00, 2:00, 3:00, 5:00, 8:00, or 12:00.
   - **Boss**: choose from The Pyre, The Hollow, The Permafrost, Practice Boss, or **Boss Rush** (all three real bosses in random order at 1/3 time intervals).
   - **Enemy density** and **difficulty modifiers** if you want to customize the challenge.
5. The run begins. You spawn into an open world; enemies stream in from off-screen.

To come back to an existing character later, use **Continue** from the main menu instead of New Character.

### Surviving a run
- **Survive until the boss spawns.** A timer counts up at the top-centre toward your chosen run length. The default is 5:00.
- When the timer hits the mark it flips to **BOSS** and the selected boss spawns into whatever chaos is already on screen. **Kill the boss to win.**
- In **Boss Rush** mode, all three real bosses spawn in random order at 1/3 time intervals. Kill all three to win.
- You start with **10 HP** and a single basic **Projectile** ability. There is no healing during a run; every hit you take is permanent for the run, so dodging matters. (You can use the `heal` console command if testing.)
- Enemies deal damage by touching you. After a hit you get a brief moment of invulnerability so one bump costs one hit.
- Dying ends the run immediately (see persistence below for what you keep).

### The kill rewards
Every enemy you kill can drop:
- **Shards** (gold diamonds): currency, used only for decrafting. Fly to you when you get close.
- **XP orbs** (cyan-green): bank into your character's level at the end of the run.
- **Fragments** (icons): the building blocks of your abilities. Drop chance varies by enemy type (around 15% for a typical enemy): fast swarmers drop them rarely, while big tanky enemies drop them far more often, and the boss is a guaranteed drop. New fragments show in the bottom-right **"NEW FRAGMENTS"** overlay, which pulses to nudge you toward crafting.
- **Elite enemies** (gold crown): appear after 2:00 at an 8% chance. They have 1.5x HP, 1.15x speed, and 1.3x contact damage. They always drop a fragment.

---

## 4. The Craft Meter and crafting (the core of the game)

- The **Craft Meter** (bottom-centre) fills as you **collect shards** (not from kills directly). It starts **full** at the beginning of a run, so you can craft immediately.
- When it's full, the prompt **"CRAFT READY, press C"** appears. Press **C** to open the crafting screen. **The game pauses while you craft.** Closing the screen resumes the game and shoves nearby enemies back to give you breathing room.
- Opening the screen spends the full meter, so you have to earn the next craft with more shard collection.

### Inside the crafting screen
Everything is **drag-and-drop**:
- **Craft Bench** (left): drag a **base** fragment here. The base's frame appears with empty **modifier slots** and **wildcard slots**. Drag modifier fragments onto modifier slots, wildcard fragments onto wildcard slots. Press the **CRAFT** button (or **C**) to assemble the ability.
- **Equipped** (top-left): your two ability slots. A freshly crafted ability auto-fills the first empty slot, otherwise it goes to **Storage**.
- **Storage** (bottom-left): crafted abilities you own but don't have equipped. Drag between Equipped and Storage to swap your loadout.
- **Fragments** (right): your loose fragment inventory; drag from here.
- A live **preview** under the bench shows what the bench will produce (damage, cooldown, etc.).

### Wildcard reveal
Wildcards are **face-down** when you pick them up (shown as a "???" unknown glyph). When you craft an ability with a face-down wildcard, a **reveal animation** plays: the glyph pulses, shakes, flashes white, and flips to reveal the real wildcard with a name banner. The reveal happens while the game is paused (crafting pauses), so it's a safe dramatic beat.

### Modifying and breaking down abilities (the decraft economy)
- **Adding** a modifier or wildcard to an ability is **free** (drag a fragment onto an open socket).
- **Removing** a modifier or wildcard costs **10 shards** and is **confirm-gated**. The removed fragment has a chance to be **destroyed** based on its rarity (Common 50%, Rare 15%, Wildcard 5%). If it survives, it returns to your inventory.
- Once an ability is stripped down to just its **bare base** (no modifiers or wildcards), you can drag it onto the **Fragments** panel to break it back into a base fragment, **for free**.

> Decrafting is intentionally risky and final; that's the design, not a bug.

---

## 5. Fragments and their interactions

### Base forms (set how many modifier slots you get)
| Base | Rarity | Slots | Behaviour |
|---|---|---|---|
| **Projectile** | Common | 3 + 1 wildcard | Single aimed bullet. The generalist. |
| **Nova** | Common | 3 + 1 | Bursts bullets in all directions; longer cooldown. |
| **Beam** | Rare | 4 + 1 | Continuous piercing ray. |
| **Trap** | Rare | 4 + 1 | Places a device that detonates when enemies approach (max 3 active). |
| **Aura** | Epic | 5 + 2 | Persistent damage zone around you. **Passive, always on while equipped.** |
| **Summon** | Epic | 5 + 2 | Orbiting entity that auto-attacks. **Passive, always on while equipped.** |

Manual bases (Projectile / Nova / Beam / Trap) fire only from the **active** slot when you hold fire. Passive bases (Aura / Summon) run on their own from **either** slot, so an off-hand aura keeps working while you shoot the other ability.

### Modifier families
- **Behavioral**: Chain (jumps between enemies), Volley (3-shot spread), Homing (seeks), Split (forks on impact), Detonate (explodes on hit/expiry), Echo (fires a timed 50% copy).
- **Stat**: Amplify (+25% damage), Accelerate (+40% speed), Hasten (-30% cooldown), Expand (+35% size), Endure (+50% duration on timed effects).
- **Fire**: Ignite (burn stacks), Scorch (fire splash on hit), Inferno (scales with burning enemies on screen).
- **Ice**: Chill (frost stacks then Freeze), Glaciate (kill grants a shield), Permafrost (frozen enemies auto-shatter after 2s).
- **Void**: Corrupt (debuff stacks, then Corrupted enemies attack neighbours), Entropy (chaos damage roll x0.5-2.5), Unravel (void implosion on kill).
- **Light**: Radiance (retaliation halo), Luminate (marks enemies, banks a stacking damage buff), Consecrate (drops a light aura on kill; void projectiles passing through it become Corrupted Light).

### Wildcards (11 total)
Wildcards fill the rainbow `+1` / `+2` wildcard slots on Rare/Epic frames (and Common's single wildcard slot). They are face-down until crafted into an ability, at which point a reveal animation plays and they log in your Collection. All 11 are wired:

| Wildcard | Effect |
|---|---|
| **Overcharge** | +200% damage, x2 cooldown |
| **Famine** | +40% damage, ignores Luminate buff |
| **Resonance** | +20% damage per unique element on the ability |
| **Surge** | Speed rush (1.6x speed for 3s) when you take damage |
| **Prism** | Random status effect on each hit |
| **Windfall** | Kills refund Craft Meter charge + 1 shard |
| **Fracture** | 3 bullets fire on kill |
| **Parasite** | Latches to an enemy, explodes on host death |
| **One for All** | 10x damage, takes the entire wildcard slot (removes all other mods/wilds) |
| **Augment** | +1 modifier slot |
| **Sprawl** | +2 modifier slots, -20% damage |

### Status effects and reactions (worth testing deliberately)
- **Burn** (Fire): ticks damage every 0.5s; at 10 stacks it **spreads** to nearby enemies.
- **Chill -> Freeze** (Ice): frost stacks slow the enemy, then **Freeze** it solid at 7 stacks (lasts 2.5s).
- **Shatter** (the headline reaction): hit a **Frozen** enemy with **Fire** (or freeze a burning one) to detonate a big icy AoE scaled to the enemy's max HP. **Permafrost** makes frozen enemies shatter on their own after 2s.
- **Stun** (Nova / Detonate / boss attacks): stops the enemy from acting for 0.8s. Bosses are stun-immune.
- **Mark** (Light/Luminate): marked enemies take **+20% damage from all sources**. Each kill by a Luminate ability banks a stacking damage buff to **all** your abilities (shown as "LIGHT xN" under the timer).
- **Debuffed -> Corrupted** (Void): Debuffed stacks slow the enemy (-20% speed, up to 3 stacks). At 3 stacks the enemy turns **Corrupted** and attacks its nearest non-corrupted neighbour every 2s.
- **Light vs Void tension**: a void hit strips a Mark off an enemy. It also **wipes your own Luminate light stacks** (your "LIGHT xN" buff): any bullet touched by a void fragment counts as a void source, so landing a void hit resets that buff to zero. Leaning on void and stacking light at the same time fights itself.
- **Consecrate + Corrupted Light**: when you have Consecrate equipped, killing an enemy drops a light aura on the ground. Your void projectiles that pass through the aura become **Corrupted Light** (2.5x damage). The aura is small (72px radius), so you have to aim through it deliberately.

Combining elements across your two ability slots (e.g. one Ice ability to freeze, one Fire ability to shatter) is the intended way to play. Please test cross-element combos heavily.

---

## 6. Persistence: what carries over between runs

This is one of the most important things to test. The model is **soft persistence**:

| Carries over | Does **not** carry over |
|---|---|
| Your **equipped loadout** (both abilities, fully assembled) | **Shards** (reset to 0 each run) |
| Your **stored crafted abilities** (the Storage stash, kept assembled) | The **Craft Meter** (refills each run) |
| **Every loose fragment you're holding**, any rarity or type (Common to Epic, modifiers and bases) | (nothing else: your whole haul carries) |
| Character **XP, level, and unlocked perks** | |
| **Avatar** and **mode** | |

A few specifics:
- **All crafted abilities carry over fully assembled.** Both your **equipped** abilities and everything in **Storage** (unequipped crafted abilities) are saved exactly as built and handed straight back next run. They are *not* broken into fragments anymore; a stored "Nova + Amplify + Ignite" comes back as that same ability, still in Storage.
- **All loose fragments carry over too**, any rarity or type (Commons, bases, modifiers, everything). They come back in your inventory at the start of the next run.
- A **brand-new character** starts with a single bare **Projectile** equipped, an empty Storage, and no loose fragments.
- The only way to lose a fragment is to have it **destroyed by decrafting** during the run (see section 4). Anything not destroyed comes back.
- **Surviving (killing the boss)** banks your fragments and XP; both modes keep the character.
- **Dying in Standard** still banks your fragments and XP; you keep the character.
- **Dying in Ironman** ends the character permanently. Its file stays so it shows in the menu greyed-out with its final level, but it can't be played again.
- **Quit to Menu** (from the Esc pause menu) banks your fragments. In **Standard** the character survives; in **Ironman** quitting mid-run **counts as a death** (it's confirm-gated with a warning, and forfeits the character permanently).

The Continue screen shows each character's total saved **fragments** count.

### The Collection (game-wide discovery log)
Open **Collection** from the main menu to see every fragment in the game, split into **Bases / Modifiers / Wildcards**, with a discovered/total count. Any fragment you've **ever** picked up (on **any** character) shows in full with its tooltip; ones you haven't found yet appear as a **dark silhouette** with a "???" tooltip, so the shape hints at what's still out there. Discovery is shared across all your characters, and a wildcard only counts as discovered once you've **crafted** (revealed) it.

### Leveling and skill trees
- XP banks into your character at run end and raises your **level**. Each level = **1 skill point**.
- Spend points in the **Skills** screen (from Select Run): **five element trees** (Kinetic, Fire, Ice, Void, Light), each a small branching tree where a capstone needs nodes from both branches.
- **Respec is free**: use the Respec button to refund all points and re-spend.
- All 30 perks (6 per tree) are wired and have real effects. Perks **only supplement** crafting (buff fragments/elements/economy). They never give you an ability.

---

## 7. Developer Console (useful for testing)

Open the console with **`~`** (tilde, requires Settings > Developer > Console enabled). It pauses the game so you can type commands safely. Tab completes commands and arguments; Up/Down walks history.

| Command | What it does | Why you'd use it for testing |
|---|---|---|
| `godmode` | Toggle invincibility | Test enemy behavior, boss phases, or walk into a crowd to check knockback / status FX without dying |
| `heal <amount>` | Restore HP (capped at max) | Recover after testing a hit, skip re-running to reposition |
| `boss` | Spawn the run's boss immediately | Test boss encounters without waiting for the timer; works in Boss Rush too (advances to next boss) |
| `time set <s>` / `time add <s>` | Jump or advance the run clock | Skip to the boss spawn time, test late-game spawn ramps, or fast-forward through quiet sections |
| `killall` | Kill every active enemy | Clear the board to test boss spawn timing or measure performance of an empty scene |
| `clearpickups` | Remove all ground pickups | Clean up after a big fight or reset the field for a perf capture |
| `shards <op> <n>` | Set/add/remove/reset shards | Give yourself decraft budget or test economy edge cases |
| `getfragment <name>` | Spawn any fragment into your inventory | Test specific combos without relying on RNG drops; Tab completes fragment names |
| `xp <op> <n>` | Adjust XP | Test level-up pacing, check XP thresholds |
| `unlockcollection` | Reveal every fragment in the Collection | Verify Collection display, check all tooltips render |
| `perflog run` / `perflog time <s>` | Capture a performance CSV | Profile frame times, draw calls, memory, enemies/pickups over a run interval; logs to `user://logs/` |

Run `help` in the console to see the full list. The console is a dev tool -- using it won't break your save, but it **does** run commands on the live game state, so `shards add 999` will actually give you 999 shards.

---

## 8. What we'd like you to test

**Persistence**
- [ ] Create a character, craft an ability, survive or die, return to menu, **Continue**. Is your loadout, level, and fragment haul correct?
- [ ] Pick up a mix of fragments (Common modifiers, a base, a Rare/Epic), end the run, start a new run. Are **all** of them in your inventory at the start?
- [ ] Craft a second ability so it lands in **Storage**, end the run, start a new one. Is that ability still sitting in Storage, fully assembled (not broken into fragments)?
- [ ] Level up, spend skill points, Respec, re-spend. Do points and perk effects behave?
- [ ] **Ironman**: die and confirm the character becomes permanently unplayable (greyed out, Continue refuses it).
- [ ] Confirm shards and the Craft Meter reset each run, while XP/level and your fragment haul persist.
- [ ] Quit-to-menu from the pause screen mid-run. Are your fragments banked?

**Custom run builder**
- [ ] Build a custom run with different time lengths (1:00, 5:00, 12:00). Does the boss spawn at the right time?
- [ ] Try **Boss Rush** mode. Do all three bosses spawn in order at 1/3 intervals? Does the "Boss N incoming!" warning appear?
- [ ] Change enemy density and difficulty modifiers. Do they affect gameplay?

**Fragments & crafting**
- [ ] Craft with every base form (Projectile, Nova, Beam, Trap, Aura, Summon). Do slot counts match the table above?
- [ ] Add modifiers (free), remove modifiers (costs 10 shards, can destroy), break a bare base back to a fragment (free).
- [ ] Swap loadout between Equipped and Storage; switch the active slot with 1/2 mid-fight.
- [ ] Confirm passive bases (Aura/Summon) keep firing from the **off-hand** slot.
- [ ] Try to overload a build with stacked modifiers. Does damage/cooldown read sensibly in the preview?
- [ ] **Wildcards**: find one (face-down "???"), socket it into a wildcard slot and craft. Does the reveal animation play, does it log in the Collection, and does its effect work?

**Audio, UI & Collection**
- [ ] Music plays on the menu and switches to battle themes in a run; the Settings sliders (Master/Music/Effects/UI) actually change the levels.
- [ ] On the web build, sound starts after your first click/keypress.
- [ ] The **Show new fragments** toggle, **HUD Size** slider, and **Bullet trails** toggle work, and settings persist after a restart.
- [ ] **Collection** opens from the menu, shows discovered fragments in full and undiscovered ones as silhouettes, and the counts look right.

**Interactions**
- [ ] **Shatter**: freeze an enemy with Ice, then hit it with Fire. Does the AoE pop?
- [ ] **Burn spread**, **Corrupt** turning enemies on each other, **Mark** damage bonus, **Luminate** stacking buff.
- [ ] **Glaciate** shield (kill grants a shield that eats the next hit, shown as a cyan ring around you).
- [ ] **Consecrate + Corrupted Light**: kill an enemy while Consecrate is equipped, then fire a void projectile through the aura. Does it convert to Corrupted Light?
- [ ] **Stun** from Nova or Detonate. Does the enemy freeze in place briefly?
- [ ] Mixing two elements across your two ability slots.
- [ ] **Void wipes Light**: build up Luminate stacks ("LIGHT xN" under the timer), then land a hit with a void ability (Corrupt / Entropy / Unravel). The stacks should drop to zero.

**General feel / bugs**
- [ ] Anything that crashes, freezes, or throws an error.
- [ ] Drag-and-drop that drops a fragment into the void, double-spends shards, or duplicates items.
- [ ] The boss fight: does it spawn with proper telegraphs, can it be killed, does the win screen show?
- [ ] Performance during big swarms.
- [ ] Elite enemies (gold crown). Do they appear after 2:00, drop guaranteed fragments, and feel appropriately dangerous?

---

## 9. Known incomplete / placeholder (please DON'T report these)

These are visible in the build but intentionally unfinished:

- **The Leaper** enemy borrows the Rusher sprite as a placeholder (it has its own behavior but not its own art yet).
- **Missing art**: any fragment without finished art shows a **magenta "no texture"** placeholder of the right shape. It still works; it just looks unfinished.
- **Consecrate aura visual**: the aura ring uses a code-drawn Line2D rather than the authored `consecrate_aura1-6.png` art frames. It functions correctly; it just doesn't use the final art.
- **Audio**: all sound effects are silent `.wav` placeholders. The music tracks work; the SFX do not produce sound yet.

---

## 10. Data we collect (heads-up)

This test build sends an **anonymous run summary** when a run ends (win, death, or quit-to-menu), so we can see how the game is actually being played. It's **fire-and-forget**: if it fails (offline, ad-blocker, etc.) nothing breaks and you won't notice.

Each summary contains **gameplay stats** about that run (things like how long you survived, what you built, kills, shards/XP), plus some technical metadata: your OS, the engine/game version, and a **random per-tester ID** generated on your machine. If your build is **password-gated**, the tester username tied to your code is also tagged on, so we can tell runs apart per tester. **No names, emails, accounts, or personal data are collected.** If you'd rather not send anything, let us know in Discord.

---

## 11. Reporting bugs

When you hit something, please include:
1. **What you did** (steps to reproduce).
2. **What you expected** vs **what happened**.
3. A **screenshot** or short clip if you can. Tip: press **P** to freeze the frame (the board stays visible) before you capture. On the browser (GitHub Pages) build, use your OS shortcut (`Win`+`Shift`+`S` / `Cmd`+`Shift`+`4`); the in-game **F2** only works for desktop builds (see "Where screenshots go").
4. Your **character mode** (Standard/Ironman) and roughly your **level**, plus whether it was mid-run, in the craft screen, or in a menu.

Thanks for helping test Shard. Have fun breaking it.
