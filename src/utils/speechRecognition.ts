/**
 * Speech-to-text utility for the microphone input in Story Creator
 */

export interface SpeechRecognitionResultState {
  isListening: boolean;
  transcript: string;
  error?: string;
}

export const createSpeechRecognition = (
  onTranscript: (text: string) => void,
  onStateChange: (listening: boolean) => void,
  language = 'en-US'
) => {
  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    return {
      supported: false,
      start: () => {},
      stop: () => {},
    };
  }

  const recognition = new SpeechRecognitionClass();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = language;

  recognition.onstart = () => {
    onStateChange(true);
  };

  recognition.onresult = (event: any) => {
    let current = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      current += event.results[i][0].transcript;
    }
    if (current) {
      onTranscript(current);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    onStateChange(false);
  };

  recognition.onend = () => {
    onStateChange(false);
  };

  return {
    supported: true,
    start: () => {
      try {
        recognition.start();
      } catch (err) {
        console.warn('Recognition already started or error', err);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch {}
    },
  };
};
