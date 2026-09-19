/**
 * Audio playback engine supporting Gemini 24kHz PCM Audio and Web Speech Synthesis
 */

let audioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

export const playGeminiPcmAudio = async (
  base64Audio: string,
  sampleRate = 24000,
  onEnded?: () => void
): Promise<() => void> => {
  stopAllAudio();

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass({ sampleRate });
  }

  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  const binaryString = window.atob(base64Audio);
  const len = binaryString.length;
  // 16-bit PCM little endian
  const numSamples = Math.floor(len / 2);
  const audioBuffer = audioCtx.createBuffer(1, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  const view = new DataView(
    new Uint8Array(
      Array.from(binaryString, (c) => c.charCodeAt(0))
    ).buffer
  );

  for (let i = 0; i < numSamples; i++) {
    const int16 = view.getInt16(i * 2, true);
    channelData[i] = int16 / 32768.0;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);

  currentSourceNode = source;

  source.onended = () => {
    if (currentSourceNode === source) {
      currentSourceNode = null;
    }
    onEnded?.();
  };

  source.start(0);

  return () => {
    try {
      source.stop();
    } catch {}
  };
};

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {}
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const playWebSpeech = (
  text: string,
  language = 'en',
  speed = 1.0,
  volume = 1.0,
  onEnded?: () => void,
  onBoundary?: (charIndex: number) => void
): (() => void) => {
  stopAllAudio();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser');
    onEnded?.();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Rate: clamped between 0.5 (slow/gentle) and 2.0
  utterance.rate = Math.max(0.5, Math.min(2.0, speed));
  // Volume: clamped between 0.0 (silent) and 1.0 (full)
  utterance.volume = Math.max(0.0, Math.min(1.0, volume));
  utterance.pitch = 1.05; // Friendly warm pitch for children

  // Map language codes
  const langMap: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
  };

  const targetLang = langMap[language] || 'en-US';
  utterance.lang = targetLang;

  // Find a pleasant natural voice if available
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const normalizedLang = targetLang.toLowerCase();
  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === normalizedLang ||
      v.lang.toLowerCase().replace('_', '-') === normalizedLang ||
      v.lang.toLowerCase().startsWith(normalizedLang.slice(0, 2))
  ) || voices.find(
    (v) => normalizedLang.startsWith('en') && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('child') || v.name.toLowerCase().includes('samantha'))
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onBoundary) {
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        onBoundary(e.charIndex);
      }
    };
  }

  utterance.onend = () => {
    onEnded?.();
  };

  utterance.onerror = (e) => {
    // Interrupted is normal when user pauses or cancels
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      console.warn('Speech synthesis notice:', e);
    }
    onEnded?.();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
};

export const pauseWebSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
};

export const resumeWebSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
};

export const stopAllAudio = () => {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {}
    currentSourceNode = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
