const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export function isVoiceRecognitionSupported() {
  return Boolean(SpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(text, onEnd) {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.98;
  utterance.pitch = 1;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Starts a single-utterance voice listener.
 * Returns a stop() cleanup function.
 */
export function startVoiceListener({ onResult, onError, onEnd }) {
  if (!SpeechRecognition) {
    if (onError) onError('Voice recognition is not supported in this browser. Try Chrome or Edge.');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || '';
    if (onResult) onResult(transcript);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error === 'not-allowed' ? 'Microphone permission denied.' : `Voice error: ${event.error}`);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();
  return () => {
    try {
      recognition.stop();
    } catch {
      // Ignore if already stopped
    }
  };
}

/**
 * Maps a spoken phrase to one of the app's emergency types + triage flags.
 */
export function detectEmergencyFromSpeech(transcript) {
  const lower = transcript.toLowerCase();

  if (lower.includes('heart') || lower.includes('cardiac') || lower.includes('chest')) {
    return { type: 'Cardiac Distress', conscious: true, breathing: true, heavyBleeding: false };
  }
  if (lower.includes('accident') || lower.includes('crash') || lower.includes('bleed') || lower.includes('blood')) {
    return { type: 'Road Accident / Trauma', conscious: true, breathing: true, heavyBleeding: lower.includes('bleed') || lower.includes('blood') };
  }
  if (lower.includes('breath') || lower.includes('asthma') || lower.includes('chok')) {
    return { type: 'Severe Breathing Difficulty', conscious: true, breathing: false, heavyBleeding: false };
  }
  if (lower.includes('faint') || lower.includes('unconscious') || lower.includes('collapse')) {
    return { type: 'Unconscious / Fainting', conscious: false, breathing: true, heavyBleeding: false };
  }
  if (lower.includes('allergy') || lower.includes('allergic') || lower.includes('sting')) {
    return { type: 'Allergic Reaction', conscious: true, breathing: true, heavyBleeding: false };
  }
  return { type: 'Other Medical Emergency', conscious: true, breathing: true, heavyBleeding: false };
}