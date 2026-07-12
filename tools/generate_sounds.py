#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
アラーム音を自前合成するスクリプト（著作権フリー / 全て数式から生成）
出力: WAV (22050Hz mono 16bit)
使い方: python3 generate_sounds.py <出力ディレクトリ>
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 22050


def write_wav(path: Path, samples: np.ndarray):
    """float(-1..1) 配列を 16bit WAV へ"""
    samples = np.clip(samples, -1.0, 1.0)
    data = (samples * 32767).astype(np.int16)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"wrote {path} ({len(data)/SR:.1f}s)")


def t_axis(dur: float) -> np.ndarray:
    return np.arange(int(SR * dur)) / SR


def env_adsr(n, a=0.01, d=0.05, s=0.7, r=0.1):
    """簡易ADSRエンベロープ"""
    e = np.ones(n) * s
    na, nd, nr = int(SR * a), int(SR * d), int(SR * r)
    na, nd, nr = min(na, n), min(nd, max(n - na, 0)), min(nr, n)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nd:
        e[na:na + nd] = np.linspace(1, s, nd)
    if nr:
        e[-nr:] = e[-nr:] * np.linspace(1, 0, nr)
    return e


def escalate(sig: np.ndarray, start=0.25, end=1.0) -> np.ndarray:
    """徐々に音量が上がるエスカレーション"""
    ramp = np.linspace(start, end, len(sig))
    return sig * ramp


def tone(freq, dur, kind="sine"):
    t = t_axis(dur)
    if kind == "sine":
        s = np.sin(2 * np.pi * freq * t)
    elif kind == "square":
        s = np.sign(np.sin(2 * np.pi * freq * t)) * 0.6
    elif kind == "saw":
        s = (2 * ((freq * t) % 1.0) - 1.0) * 0.6
    elif kind == "triangle":
        s = 2 * np.abs(2 * ((freq * t) % 1.0) - 1.0) - 1.0
    else:
        raise ValueError(kind)
    return s * env_adsr(len(s))


def silence(dur):
    return np.zeros(int(SR * dur))


# ---------- 1. クラシックビープ（ピピピッ） ----------
def classic_beep(total=20.0):
    unit = np.concatenate([
        tone(880, 0.1), silence(0.05),
        tone(880, 0.1), silence(0.05),
        tone(880, 0.1), silence(0.45),
    ])
    reps = int(total / (len(unit) / SR)) + 1
    sig = np.tile(unit, reps)[: int(SR * total)]
    return escalate(sig)


# ---------- 2. チップチューン（8bit風メロディ / オリジナルフレーズ） ----------
def chiptune(total=20.0):
    notes = [523, 659, 784, 1047, 784, 659, 523, 659, 784, 784, 1047, 1319]
    durs = [0.12, 0.12, 0.12, 0.24, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12, 0.24, 0.36]
    phrase = np.concatenate(
        [tone(f, d, "square") for f, d in zip(notes, durs)] + [silence(0.3)]
    )
    reps = int(total / (len(phrase) / SR)) + 1
    sig = np.tile(phrase, reps)[: int(SR * total)]
    return escalate(sig, 0.3)


# ---------- 3. ベル ----------
def bell(total=20.0):
    def strike(f0, dur=1.2):
        t = t_axis(dur)
        partials = [(1.0, 1.0), (2.76, 0.6), (5.4, 0.25), (8.9, 0.1)]
        s = sum(a * np.sin(2 * np.pi * f0 * m * t) for m, a in partials)
        return s * np.exp(-3.5 * t) * 0.5

    unit = np.concatenate([strike(660), strike(660, 0.9), silence(0.4)])
    reps = int(total / (len(unit) / SR)) + 1
    sig = np.tile(unit, reps)[: int(SR * total)]
    return escalate(sig, 0.35)


# ---------- 4. サイレン風 ----------
def siren(total=20.0):
    t = t_axis(total)
    f = 900 + 300 * np.sin(2 * np.pi * t / 2.0)  # 600〜1200Hzスイープ
    phase = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(phase) * 0.8
    return escalate(sig, 0.2)


# ---------- 5. モーニングチャイム（マリンバ風） ----------
def morning_chime(total=20.0):
    def hit(f0, dur=0.5):
        t = t_axis(dur)
        s = np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(2 * np.pi * f0 * 4 * t)
        return s * np.exp(-6 * t) * 0.6

    seq = [523, 659, 784, 659, 880, 784, 1047, 784]
    unit = np.concatenate([hit(f) for f in seq] + [silence(0.5)])
    reps = int(total / (len(unit) / SR)) + 1
    sig = np.tile(unit, reps)[: int(SR * total)]
    return escalate(sig, 0.3)


# ---------- 6. 緊急アラーム（ノコギリ波パルス） ----------
def urgent(total=20.0):
    unit = np.concatenate([
        tone(740, 0.18, "saw"), tone(988, 0.18, "saw"), silence(0.08),
    ])
    reps = int(total / (len(unit) / SR)) + 1
    sig = np.tile(unit, reps)[: int(SR * total)]
    return escalate(sig, 0.25)


SOUNDS = {
    "alarm_classic_beep": classic_beep,
    "alarm_chiptune": chiptune,
    "alarm_bell": bell,
    "alarm_siren": siren,
    "alarm_morning_chime": morning_chime,
    "alarm_urgent": urgent,
}


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "sounds")
    for name, fn in SOUNDS.items():
        write_wav(out / f"{name}.wav", fn())


if __name__ == "__main__":
    main()
