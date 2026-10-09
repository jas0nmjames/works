#!/usr/bin/env python3
"""
transcribe.py — Local, offline audio -> word-level timestamped JSON.

Runs entirely on your machine using WhisperX (Whisper for transcription +
wav2vec2 forced alignment for tight word timings). No API keys, no network
calls at runtime once models are cached.

Output JSON shape (consumed by player.html):

{
  "audio": "episode.mp3",
  "duration": 812.3,
  "words": [
    { "word": "Welcome", "start": 0.00, "end": 0.42 },
    { "word": "to",      "start": 0.42, "end": 0.55 },
    ...
  ]
}

--------------------------------------------------------------------------
SETUP (one time)
--------------------------------------------------------------------------
    python3 -m venv .venv
    source .venv/bin/activate           # Windows: .venv\\Scripts\\activate
    pip install whisperx

    # ffmpeg must be on your PATH:
    #   macOS:   brew install ffmpeg
    #   Ubuntu:  sudo apt install ffmpeg
    #   Windows: https://ffmpeg.org/download.html

--------------------------------------------------------------------------
USAGE
--------------------------------------------------------------------------
    python transcribe.py episode.mp3
    python transcribe.py episode.mp3 --model small --output episode.json
    python transcribe.py episode.mp3 --model large-v3 --device cuda

Model choices (accuracy vs. speed):
    tiny / base / small   -> fast, fine on CPU, good for clear speech
    medium                -> better, slower on CPU
    large-v3              -> best quality; realistically wants a GPU (--device cuda)

The first run downloads model weights (cached in ~/.cache). Every run after
that is fully offline.
"""

import argparse
import json
import os
import sys


def main():
    parser = argparse.ArgumentParser(
        description="Local WhisperX -> word-level timestamped JSON."
    )
    parser.add_argument("audio", help="Path to the input audio file (mp3, wav, m4a, ...).")
    parser.add_argument(
        "--model",
        default="small",
        help="Whisper model size: tiny, base, small, medium, large-v3 (default: small).",
    )
    parser.add_argument(
        "--device",
        default="cpu",
        choices=["cpu", "cuda"],
        help="Compute device. Use 'cuda' if you have an NVIDIA GPU (default: cpu).",
    )
    parser.add_argument(
        "--language",
        default=None,
        help="Force a language code (e.g. 'en'). Default: auto-detect.",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Output JSON path. Default: <audio-name>.json next to the audio.",
    )
    parser.add_argument(
        "--compute-type",
        default=None,
        help="WhisperX compute type. Default: int8 on CPU, float16 on CUDA.",
    )
    args = parser.parse_args()

    if not os.path.isfile(args.audio):
        sys.exit(f"Audio file not found: {args.audio}")

    # Import here so --help works even before whisperx is installed.
    try:
        import whisperx
    except ImportError:
        sys.exit(
            "whisperx is not installed. Run:\n"
            "    pip install whisperx\n"
            "(inside your virtualenv)"
        )

    compute_type = args.compute_type or ("float16" if args.device == "cuda" else "int8")
    out_path = args.output or (os.path.splitext(args.audio)[0] + ".json")

    print(f"[1/4] Loading audio: {args.audio}")
    audio = whisperx.load_audio(args.audio)
    duration = len(audio) / 16000.0  # WhisperX resamples to 16 kHz mono

    print(f"[2/4] Transcribing with model '{args.model}' on {args.device} ...")
    model = whisperx.load_model(
        args.model, device=args.device, compute_type=compute_type, language=args.language
    )
    result = model.transcribe(audio, batch_size=16)
    detected_language = result["language"]
    print(f"      Language: {detected_language}")

    print("[3/4] Forced alignment for word-level timestamps ...")
    align_model, metadata = whisperx.load_align_model(
        language_code=detected_language, device=args.device
    )
    aligned = whisperx.align(
        result["segments"],
        align_model,
        metadata,
        audio,
        args.device,
        return_char_alignments=False,
    )

    # Flatten aligned segments into a single ordered word list.
    words = []
    for segment in aligned["segments"]:
        for w in segment.get("words", []):
            # Some tokens (rare) can miss a start/end (e.g. pure punctuation);
            # skip those so playback sync never hits a null.
            if w.get("start") is None or w.get("end") is None:
                continue
            words.append(
                {
                    "word": w["word"],
                    "start": round(float(w["start"]), 3),
                    "end": round(float(w["end"]), 3),
                }
            )

    payload = {
        "audio": os.path.basename(args.audio),
        "language": detected_language,
        "duration": round(duration, 3),
        "words": words,
    }

    print(f"[4/4] Writing {len(words)} words -> {out_path}")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print("Done. Open player.html and load this JSON + your audio file.")


if __name__ == "__main__":
    main()
