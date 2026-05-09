import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAudioReturn {
  playNarration: (audioKey: string, text: string) => void;
  playEffect: (effectKey: "correct_chime" | "incorrect_tone" | "tap") => void;
  stopAll: () => void;
  isSpeaking: boolean;
}

const EFFECT_PARAMS: Record<
  "correct_chime" | "incorrect_tone" | "tap",
  { frequency: number; duration: number }
> = {
  correct_chime: { frequency: 660, duration: 0.2 },
  incorrect_tone: { frequency: 330, duration: 0.25 },
  tap: { frequency: 880, duration: 0.05 },
};

export function useAudio(): UseAudioReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    if (!synth) {
      console.warn("useAudio: window.speechSynthesis is unavailable on this platform. Narration will be silent.");
      return;
    }

    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
    };

    loadVoices();

    // Voices load asynchronously on some browsers
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel();
      audioContextRef.current?.close();
    };
  }, []);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  const playNarration = useCallback(
    (_audioKey: string, text: string): void => {
      if (!synth) return;

      // Cancel any in-progress speech before starting new
      synth.cancel();
      currentUtteranceRef.current = null;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      // Prefer an English voice if available
      const englishVoice = voicesRef.current.find((v) =>
        v.lang.startsWith("en")
      );
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };

      currentUtteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [synth]
  );

  const playEffect = useCallback(
    (effectKey: "correct_chime" | "incorrect_tone" | "tap"): void => {
      const ctx = getAudioContext();
      if (!ctx) return;

      const { frequency, duration } = EFFECT_PARAMS[effectKey];

      const resume = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();

      resume.then(() => {
        const now = ctx.currentTime;
        const attackTime = 0.01;
        const releaseTime = 0.05;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now);

        // Envelope: ramp up to 0.4 over attack, then ramp down to 0 at end
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + attackTime);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration + releaseTime);
      });
    },
    [getAudioContext]
  );

  const stopAll = useCallback((): void => {
    if (synth) {
      synth.cancel();
    }
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
  }, [synth]);

  return { playNarration, playEffect, stopAll, isSpeaking };
}
