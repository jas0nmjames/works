# works

My portfolio at https://jasonjames.works/

[![Netlify Status](https://api.netlify.com/api/v1/badges/543e3dda-da04-4872-8df8-fe9438b0767e/deploy-status)](https://app.netlify.com/sites/jasonjamesworks/deploys)

- Repository on [GitHub](https://github.com/jas0nmjames/works).
- Static site generated with [Eleventy](https://www.11ty.dev/)
- Deployed with [Netlify](https://www.netlify.com)
- [Privacy-friendly](https://plausible.io/privacy-focused-web-analytics) analytics *will be* by [Plausible](https://plausible.io/)
- Domain managed by [GoDaddy](https://www.godaddy.com/)

## developing

The site is built with [Eleventy](https://www.11ty.dev/) (v3). The homepage (`index.html`) is hand-written HTML and CSS; anecdote pages are generated from markdown.

```bash
npm install
npm start      # eleventy --serve, live reload at http://localhost:8080
npm run build  # one-off build into _site/
```

- `eleventy.config.js` copies static files (CSS, `assets/`, media) into `_site/` and sets up dates (below). Without it Eleventy only outputs templates, and CSS, images and video 404.
- `_site/` is build output.

### writing an anecdote

Add a markdown file to `collections/anecdotes/`. The layout is `_includes/layout-anecdote.njk`.

```yaml
---
layout: layout-anecdote.njk
title: Securing UX Training for the Team
date: 2023-10-01          # Eastern Time, see "dates" below
tags:                     # must be a list; "anecdote" is the collection marker and is hidden
  - anecdote
  - Santander Bank
summary: One-sentence summary (optional; the summary box is hidden without it)
outcomes:                 # optional list; the outcomes box is hidden without it
  - Two designers earned NN/g Master Certification
video:                    # optional; the video section is hidden without it
  src: /assets/anecdotes/ux-training/summary.mp4
  captions: /assets/anecdotes/ux-training/captions.vtt        # optional
  subtitles_es: /assets/anecdotes/ux-training/subtitles_es.vtt # optional
---
The markdown body becomes the article text.
```

- **Video files** live in `assets/anecdotes/<slug>/`. `.mp4` (H.264) plays in the most browsers; the current `summary.mov` should be converted.
- **Dates** are written and displayed as Eastern Time. Use `2026-10-01` or `2026-10-01T14:30:00` (no `-04:00` offset). Templates must print `page.date` (with the `displayDate` / `isoDate` filters), not the raw front-matter `date`, because only `page.date` gets the Eastern handling.
- **Tag links** are placeholders (`href=""`) until tag pages exist.

### color modes

The brush / sun / moon buttons switch between light, black & white (mono), and dark. The mode is stored on `<html data-mode="...">`, saved in `localStorage` (`theme-mode`), and defaults to the system setting (high contrast means mono). Search the repo for `claude-color-modes` to find every piece.

- Homepage: inline in `index.html` plus `styles.css`.
- Anecdote pages: partials in `_includes/` (`theme-head.njk` goes in `<head>` above the stylesheet, `theme-controls.njk` is the buttons, `theme-script.njk` goes at the end of `<body>`) plus `template-anecdote/styles.css`. These are copies of the homepage code, so a change to one needs the same change in the other.

## environmental usage

AI assistance (Claude Code) helped build and document the Eleventy / anecdote-template work. This is a rough, order-of-magnitude estimate for that one working session, as of 2026-10-01. It is not a measurement.

| Scenario | Energy | Carbon (CO&#8322;e) | Water |
| --- | --- | --- | --- |
| Low | ~20 Wh | ~3&ndash;8 g | ~22 mL |
| Central | ~40 Wh | ~5&ndash;15 g | ~44 mL |
| High | ~100 Wh | ~13&ndash;38 g | ~110 mL |

How it was calculated (so it can be updated):

- **Model calls:** about 85 model turns in the session (each tool-using step is a turn).
- **Per-call energy:** Google's published figure for a median Gemini text prompt, 0.24 Wh, times 1 (low), 2 (central) or 5 (high). The multiplier covers long contexts and tool use, which cost more than a short chat prompt. 85 &times; 0.24 Wh &asymp; 20 Wh.
- **Carbon:** the low end of each range uses Google's published ratio (0.03 g per 0.24 Wh &asymp; 0.125 g/Wh, which reflects Google's clean-energy purchases); the high end uses a typical US grid average of about 0.37 g/Wh.
- **Water:** Google's published ratio (0.26 mL per 0.24 Wh &asymp; 1.1 mL/Wh), data-center cooling only. Water used to generate the electricity is not included and would raise it.

Caveats: Anthropic has not published per-prompt figures for Claude, so Google's numbers (from May 2025 data) are only a proxy. Model training, hardware manufacturing, and local work such as Eleventy builds and browser previews are not counted. Source: [Google, "Measuring the environmental impact of AI inference"](https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference).

## Project Notes

### Attributions

- `h1` is [Bungee](https://djr.com/bungee) by David Jonathan Ross ([Google Fonts](https://fonts.google.com/specimen/Bungee))
- `p` is [Lexend](https://www.lexend.com/), a "variable font empirically shown to significantly improve reading-proficiency." ([Google Fonts](https://fonts.google.com/specimen/Lexend))

### To-Do List

- [x] Original design by me (in Sketch) to refresh UI toolkit beyond day-to-day Figma use
- [x] Original code written in vanilla HTML & CSS by me to refresh those skills.
- [ ] (Optional) Store and embed non-public content from https://github.com/jas0nmjames/works-private.  Originally, "Confidential content [was going to live] in a separate, private repo. On the site, you'd need a password or other credential to access any confidential content." But I decided against having the bulk of my case studies behind a password.  Content in the public repo will be sanitized.
- [ ] Privacy-friendly analytics by Plausible or similar.

<!-- 

### Project outline

#### discovery

1. Me
	2. What is my purpose? To bring healing by facilitating belonging 
	2. What is my mission?
	3. What is my vision?
	4. What are my priorities?
	5. What are my goals?
	4. What sets me apart as a designer and professional?  What am I good at?  What tangible skills do I have?  What intangible skills do I have?
		5. Remembering those not in the room.
			6. Case in point: Recognizing that CX was not in a design review of a new debit card.  (January 2024)
		6. Unafraid to ask basic questions.
			7. Case in point: Asking during a final review of a debit card design, why the card was not branded with the new digital bank assets. (January 2024).  After meeting with CX, I learned that the bank had to print cards 3 times the last time they updated the card.  Perhaps we prevented it this time around by asking some basic questions out loud.
		7. Patient persistence
			8. Example: ~4-month onboarding for UX vendors for the team.
		9. Zooming out and in (reference IDEO HCST)
			9. Big picture oriented
			10. Detail Oriented
5. What am I looking for in a company?
6. What are companies looking for?
7. What are recruiters looking for?

#### projects

- tools
	- figma
		- plugin: stark accessibility tools
	- fig jam
	- jira
	- confluence
	- visual studio code
	- (pen and paper)
	- (keyboard): good writing
- methods
	- heuristic analysis
	- competitive analysis
	- best practices research
		- platform standards and guidelines
		- accessibility / wcag
		- front-end best practices
	- secondary market research
	- user interviews
	- user testing
		- 5-second click test
	- information architecture
		- card sorting
	- wire framing
	- high fidelity 
	- ux strategy (in the small sense)
		- end to end analysis
		- low effort / high value opportunity discovery & prioritization
		- ux debt process
	- ux strategy (in the big sense)
	- user journey mapping (here’s the user’s journey to accomplish x)
	- site mapping (here’s all of the options and flows)
- activities
	- requirements gathering
	- design discovery session (ideas via figjam)
	- kanban triage (ux team meetings)
	- leadership status meetings & syncs
	- collaboration (?) and team building
	- organizing information (?)
- stories
		- A lot of what we do in UX when building products not yet in customer’s hands is preemptive problem solving
			- end to end reviews for horizon: show before and afters
				- screen designed by others
				- feedback provided
				- changed screen
	- solving a team problem
	- solving an organizational problem
	- solving a business problem
	- solving a user problem
	- solving a societal problem
	- solving an interaction design problem
- outcomes
	- jd power, etc.
	- nps, etc.
	- prevention of development iteration (before you even get to “build and test” or “fail fast”)

#### Features

- Highlight visual design
- Scannability
- Virtual Assistant 
	- Traditional NLU
	- LLM Fallbacks
		- Custom database 
		- GPT-4 Fall back?

-->