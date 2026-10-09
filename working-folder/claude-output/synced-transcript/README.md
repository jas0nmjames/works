# Synced Transcript Player

Apple Podcasts–style transcripts: text highlights word-by-word as audio plays,
and you can click any word to jump the audio there. **Fully local — no
third-party services, no API keys, no runtime network calls.**

The pipeline is two pieces:

```
audio file ──► transcribe.py (WhisperX, local) ──► timestamped JSON ──► player.html
```

## What's here

- **`transcribe.py`** — runs WhisperX on your machine to produce word-level
  timestamps as JSON. Whisper does the transcription; a wav2vec2 forced-alignment
  pass tightens each word's start/end time.
- **`player.html`** — zero-dependency web page that loads the JSON + audio and
  does the highlighting, click-to-seek, and auto-scroll. Ships with a built-in
  demo so it works the moment you open it.

## 1. Generate timestamps

One-time setup:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install whisperx
# ffmpeg must be installed:  brew install ffmpeg  (macOS)
```

Run it:

```bash
python transcribe.py episode.mp3
# -> writes episode.json next to the audio
```

Model options (accuracy vs. speed):

| Model         | Speed        | Notes                                   |
|---------------|--------------|-----------------------------------------|
| `tiny`/`base` | very fast    | fine for clean speech, roughest timings |
| `small`       | fast on CPU  | **default** — good balance              |
| `medium`      | slow on CPU  | noticeably better                       |
| `large-v3`    | needs a GPU  | best quality (`--device cuda`)          |

The first run downloads model weights (cached in `~/.cache`); every run after
that is completely offline.

## 2. Play it back

Open `player.html` in a browser. It starts on the built-in demo. To use your
own content:

1. **Transcript JSON** → pick the file `transcribe.py` produced.
2. **Audio** → pick the matching audio file.
3. Press play.

Everything runs in the browser from local files — nothing is uploaded.

## How the sync works (the interesting part)

- **Timing lookup:** words are sorted by start time, so finding the active word
  each frame is a **binary search**, not a linear scan — stays fast on
  hour-long transcripts.
- **Smoothness:** highlighting is driven by a `requestAnimationFrame` loop
  reading `audio.currentTime`, not the HTML `timeupdate` event (which only fires
  ~4×/second and looks laggy).
- **Click-to-seek:** clicking a word sets `audio.currentTime = word.start`.
- **Two-level highlight:** the current word gets a strong highlight; its sentence
  gets a soft background — same as Apple.
- **Follow scroll:** the transcript auto-scrolls to keep the active word in view,
  and pauses that when you scroll manually.

## JSON format

```json
{
  "audio": "episode.mp3",
  "duration": 812.3,
  "words": [
    { "word": "Welcome", "start": 0.00, "end": 0.42 },
    { "word": "to",      "start": 0.42, "end": 0.55 }
  ]
}
```

`player.html` only needs the `words` array. If you swap in a different aligner
(aeneas, Montreal Forced Aligner) just emit this shape and everything else works.

## Notes for the real build

- Alignment quality is very good on clean audio; it degrades with overlapping
  speakers, music beds, and heavy accents. For a portfolio piece, use clean source.
- For long files, consider chunking the transcript in the DOM (render only
  what's near the viewport) — the demo renders everything, which is fine to a few
  thousand words.
- The RSS "Podcast Namespace" has a `<podcast:transcript>` tag if you ever want
  to ship these transcripts in a real feed.

## About the built-in demo

`player.html` opens on a short, hand-written transcript so the effect is visible
with zero setup — no files to load first.

That demo has no bundled audio file. Instead, on load the page generates a few
seconds of **silent audio directly in the browser** (a bare-minimum WAV file:
a 44-byte header plus zeroed PCM samples) and uses that as the `<audio>`
element's source. That gives the transport something real to play and scrub,
which is what actually drives the word-by-word highlighting — the audio itself
is inaudible, but the clock it produces is real. Swap in your own JSON + audio
file to hear (and see) it with real content.

## Attributions

- **Inspiration:** [Apple Podcasts transcripts](https://www.apple.com/newsroom/2024/03/apple-introduces-transcripts-for-apple-podcasts/)
  (Apple newsroom, March 2024) — the karaoke-style highlighting UX this project
  recreates.
- **[WhisperX](https://github.com/m-bain/whisperX)** (Bain et al.) — combines
  Whisper transcription with forced alignment for accurate word-level timestamps.
  Paper: *"WhisperX: Time-Accurate Speech Transcription of Long-Form Audio"*
  (Bain, Huh, Han, Zisserman — INTERSPEECH 2023).
- **[Whisper](https://github.com/openai/whisper)** (OpenAI) — the underlying
  speech-to-text model WhisperX transcribes with.
- **wav2vec 2.0** (Baevski et al., Meta AI Research) — the forced-alignment
  backbone WhisperX uses to snap each word to its precise start/end time.
- **Built by [Claude](https://claude.com)** (Anthropic) — `transcribe.py`'s CLI,
  `player.html`'s playback/highlight logic, and the silent-WAV generator were
  written by Claude in collaboration with Jason James, exploring this idea
  ahead of a full build in Claude Code.
