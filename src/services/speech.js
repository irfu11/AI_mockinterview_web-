/* src/services/speech.js */

// Helper to check speech synthesis support
export const isTTSSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Helper to check speech recognition support
export const isSTTSupported = () => {
  if (typeof window === 'undefined') return false;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return !!SpeechRecognition;
};

/**
 * Find a suitable voice based on gender preference.
 */
export const getVoiceForGender = (gender) => {
  if (!isTTSSupported()) return null;
  
  const voices = window.speechSynthesis.getVoices();
  const lowerGender = (gender || '').toLowerCase();
  
  // Custom heuristics for common browser voices
  if (lowerGender === 'female') {
    // Look for common female voices
    const femaleVoice = voices.find(voice => {
      const name = voice.name.toLowerCase();
      return (
        name.includes('female') ||
        name.includes('zira') ||
        name.includes('samantha') ||
        name.includes('hazel') ||
        name.includes('google us english') ||
        name.includes('natural') && name.includes('sania')
      );
    });
    if (femaleVoice) return femaleVoice;
  } else {
    // Look for common male voices
    const maleVoice = voices.find(voice => {
      const name = voice.name.toLowerCase();
      return (
        name.includes('male') ||
        name.includes('david') ||
        name.includes('george') ||
        name.includes('google uk english male') ||
        name.includes('natural') && name.includes('guy')
      );
    });
    if (maleVoice) return maleVoice;
  }
  
  // Fallbacks: find any English voice, or default
  const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
  return englishVoice || voices[0] || null;
};

// Trigger loading of voices early (crucial for Chrome)
if (isTTSSupported()) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Speak text out loud.
 */
export const speak = (text, gender, onStart, onEnd) => {
  if (!isTTSSupported()) {
    console.warn("Speech Synthesis not supported in this browser.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speaking
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice properties
  const voice = getVoiceForGender(gender);
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = 1.0;  // Normal speaking rate
  utterance.pitch = gender === 'female' ? 1.05 : 0.95; // Heuristic pitches
  
  // Hook events
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  
  utterance.onerror = (e) => {
    console.error("Speech Synthesis Error:", e);
    if (onEnd) onEnd();
  };

  // Speak
  window.speechSynthesis.speak(utterance);
  
  return utterance;
};

/**
 * Stop any active text-to-speech output.
 */
export const stopSpeaking = () => {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Create and manage a Speech Recognition instance.
 */
export class SpeechRecognizer {
  constructor(onResult, onEnd, onError) {
    if (!isSTTSupported()) {
      this.recognition = null;
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    this.isListening = false;
    this.finalTranscript = '';
    
    this.recognition.onstart = () => {
      this.isListening = true;
    };
    
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const fullText = (this.finalTranscript + interimTranscript).trim();
      if (onResult) {
        onResult(fullText, interimTranscript);
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (onError) onError(event.error);
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd(this.finalTranscript.trim());
    };
  }
  
  start() {
    if (!this.recognition || this.isListening) return;
    this.finalTranscript = '';
    try {
      this.recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }
  }
  
  stop() {
    if (!this.recognition || !this.isListening) return;
    try {
      this.recognition.stop();
    } catch (e) {
      console.error("Failed to stop speech recognition:", e);
    }
  }
}
