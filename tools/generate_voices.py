#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
「だれか起こしてください〜！」系ボイスを espeak-ng で生成するスクリプト。
espeak-ng はオープンソース(GPL)のTTSで、生成音声の利用に制限はありません。
より自然な声にしたい場合は README の「ボイスの差し替え」を参照。

使い方: python3 generate_voices.py <出力ディレクトリ> [espeak-ngのパス] [データパス]
"""
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

VOICES = {
    "voice_okoshite": "だれか、おこしてくださーい!",
    "voice_asa_desuyo": "あさですよー。おきてくださーい!",
    "voice_chikoku": "おきないと、ちこくしますよ!",
    "voice_mezamete": "めをさましてください。きょうも、いちにちが、はじまりますよ!",
    "voice_ganbare": "おはようございます。きょうも、がんばりましょう!",
}


def read_wav(path):
    with wave.open(str(path), "rb") as w:
        sr = w.getframerate()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return sr, data.astype(np.float64) / 32768.0


def write_wav(path, sr, samples):
    data = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(data.tobytes())


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "voices")
    espeak = sys.argv[2] if len(sys.argv) > 2 else "espeak-ng"
    datapath = sys.argv[3] if len(sys.argv) > 3 else None
    out.mkdir(parents=True, exist_ok=True)

    tmpdir = Path(tempfile.mkdtemp())
    for name, text in VOICES.items():
        raw = tmpdir / (name + "_raw.wav")
        cmd = [espeak]
        if datapath:
            cmd += ["--path=" + str(datapath)]
        cmd += ["-v", "ja", "-s", "120", "-p", "60", "-a", "180", "-w", str(raw), text]
        subprocess.run(cmd, check=True)

        # 3回繰り返し、だんだん大きく（エスカレーション）
        sr, sig = read_wav(raw)
        gap = np.zeros(int(sr * 0.6))
        combined = np.concatenate([
            sig * 0.55, gap, sig * 0.8, gap, sig * 1.0,
        ])
        outfile = out / (name + ".wav")
        write_wav(outfile, sr, combined)
        raw.unlink()
        print("wrote " + str(outfile))


if __name__ == "__main__":
    main()
