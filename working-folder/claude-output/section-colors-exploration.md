# Section colors exploration (shelved)

Explored with Claude, October 26, 2026. **Shelved for the hand-crafted version**, which stays HTML and CSS written by Jason. This is context for the AI-assisted flavors: locally-generative, generative and sentient.

Design canvas with every option: https://claude.ai/artifact/4dJzZftatHiqD3wXDsQF1v (private; the car photos and Bungee Layers fonts are uploaded there too).

## The idea

Give each homepage aside section its own color, taken from three Hot Wheels Pantone cars:

| Section | Car | Pantone | Accent | Muted tint | Livelier tint |
|---|---|---|---|---|---|
| Case studies | VW Kool Kombi | 021 | `#FE5000` | `#F6CDB6` | `#F6CDB6` |
| Anecdotes | Nissan Fairlady Z | 533 | `#202A44` | `#C3C8D6` | `#BCC9F1` |
| Playgrounds | Ford Mustang Boss 302 | 195 | `#7A2E42` | `#DCC3CA` | `#F1BCCA` |

Jason's mapping: case studies = orange, anecdotes = blue, playgrounds = purple/maroon. The flavor tabs currently use these same colors (locally-generative = Boss 302, generative = Fairlady Z, sentient = Kool Kombi). Jason may reassign them.

## Where it landed

Favorite: **option G**, which is the homepage as it is today, except:

- Each "selected …" section frame and its cards use the section's tint as the background.
- The section's Pantone color replaces the orange accent: tag borders, crumb underline and icon, stats, card button, "all …" link.
- The matching nav item (case studies, anecdotes, playground) gets the Pantone color on its dotted outline and sub-heading.
- Card titles are plain black Bungee, not the stacked Bungee Layers.
- Everything else is unchanged: header tabs, logo, other nav items, lavender intro frames.

Follow-ups Jason was exploring on top of G:

- **J:** G with livelier anecdote and playground tints (the muted slate and mauve felt washed out next to the peach).
- **K:** G's tints with one shared accent (`#E05B08`), plus:
  - White card buttons with the section's Pantone color as the text.
  - Each "all …" link filled with the section's Pantone color.

Other options on the canvas, not chosen: C (lavender, pink and cream cards with a burnt-orange accent), E (Hot Wheels tints with one accent), F (Pantone accents on tints, as cards only), H (cards filled with the full Pantone color, white buttons), I (lavender cards with Pantone accents).

## Accessibility notes

- **Kool Kombi `#FE5000` is the problem color.** White text on it is about 3.2:1, so use black text (about 6.4:1). As text on white, it's also about 3.2:1, so darken it slightly for button-size text, or make the text large and bold.
- **On the tints:** Fairlady Z navy and Boss 302 maroon read well on their tints and on lavender. Kombi orange is faint as a border on lavender (about 1.9:1).
- **Site orange `#E05B08`:** about 3.6:1 against snow, so it fails for small white button text. Burnt orange `#B8460A` passes (about 5.2:1).
- **Mono and dark modes** turn every color black or white, so the sections can only be told apart by their labels (and cars, if added).

## Car images

Saved in `working-folder/assets/hot-wheels/`:

- **Cutouts** (white background): `<car>-side.jpg`, `<car>-top.jpg`, `<car>-three-quarter.jpg`.
- **Photos:** in `photos/`.

Explored as icon-size images in the nav items and small corner decorations on each section, then pulled out for now. The JPGs need transparent PNG or WebP versions before they'll work in dark mode.
