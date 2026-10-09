---
# Playground item (see _includes/layout-playground.njk). Text from the playground mock, October 2026.
title: Dut Dut
# card = image on one side, article card on the other. prototype = heading + screenshot, with the body text beside it.
style: card
# Which side the image sits on: left or right.
media: left
# Position on /playground/ (1 is first).
order: 1
date: 2026-07-01
# Breadcrumb on the card, instead of "playground".
label: generative experiment
tags:
  - Claude Design
  - Claude Code
  - Generative Responses
summary: Evals help evaluate the quality of the generative outputs of this fully functioning web app.
stats:
  - value: "9"
    label: features create a product strategy that fills a gap
  - value: Claude
    label: multi-modal
image:
  # Add the screenshot here (for example /assets/playground/dut-dut.png). Until then a gray box holds its place.
  src:
  alt: The Dut Dut drumline cadence creator, with block-based patterns on the left and the generated sheet music on the right
  caption: Experimenting with Claude Design, Claude Code & Generative Output
# Optional: a link to the live app. Shown under the card.
link:
---
Designed a blocks-based drumline cadence creator in Claude Design and built with Claude Code. The responsive web app is fully functional in the browser.

**What sets this apart:**

<!-- The mock's first bullet ends at "between"; finish the sentence. -->
- The blocks based creator generates sheet music in realtime to help bridge an educational gap between
- Educational music theory insights are automatically generated without LLMs.
- Users can easily export the context of their creations to an LLM of their choosing to receive detailed insights
- Users can download a .json of their creation to save it locally and uploaded at a later time. They can also download sheet music and audio files of their creations.
- Loops and evals help assess the human-centeredness of the app's outputs
