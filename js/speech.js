/**
 * Speech Module
 * Handles voice input (STT) and voice output (TTS).
 */

import { GROQ_CONFIG } from './config.js';

let recognition = null;
let isListening = false;
let currentAudio = null;

/** Initialize speech recognition */
function initRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        return recognitionInstance;
    }

    return null;
}

/**
 * Start listening for voice input
 * @param {Function} onResult - Called with transcribed text
 * @param {Function} onEnd - Called when listening ends
 * @param {Function} onError - Called on error
 */
export function startListening(onResult, onEnd, onError) {
    if (!recognition) {
        recognition = initRecognition();
    }

    if (!recognition) {
        alert("Sorry, your browser doesn't support speech recognition.");
        return;
    }

    if (isListening) return;

    recognition.onstart = () => {
        isListening = true;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (onError) onError(event.error);
    };

    recognition.onend = () => {
        isListening = false;
        if (onEnd) onEnd();
    };

    try {
        recognition.start();
    } catch (e) {
        console.error("Recognition start failed", e);
    }
}

/** Stop speech recognition */
export function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
    }
}

/**
 * Speak text using TTS
 * @param {string} text - Text to speak
 * @param {HTMLElement} voiceBtn - Voice button for visual feedback
 * @param {Function} onEnd - Callback when speaking ends
 */
export async function speakWeather(text, voiceBtn, onEnd) {
    voiceBtn.classList.add('speaking');
    voiceBtn.classList.remove('listening');

    try {
        await speakWithGroq(text, voiceBtn, onEnd);
    } catch (error) {
        console.warn('Groq TTS failed, falling back to Web Speech:', error);
        speakWithWebSpeech(text, voiceBtn, onEnd);
    }
}

/** Use Groq's TTS API */
async function speakWithGroq(text, voiceBtn, onEnd) {
    const url = 'https://api.groq.com/openai/v1/audio/speech';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: GROQ_CONFIG.ttsModel,
            voice: GROQ_CONFIG.ttsVoice,
            response_format: 'wav',
            input: text
        })
    });

    if (!response.ok) {
        throw new Error(`Groq TTS failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    currentAudio = new Audio(audioUrl);

    currentAudio.onended = () => {
        voiceBtn.classList.remove('speaking');
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        if (onEnd) onEnd();
    };

    currentAudio.onerror = () => {
        voiceBtn.classList.remove('speaking');
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        console.error('Audio playback error');
    };

    await currentAudio.play();
}

/** Use browser's built-in TTS as fallback */
function speakWithWebSpeech(text, voiceBtn, onEnd) {
    if (!('speechSynthesis' in window)) {
        console.error("Text-to-speech not supported");
        voiceBtn.classList.remove('speaking');
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
        voiceBtn.classList.remove('speaking');
        if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
        voiceBtn.classList.remove('speaking');
        console.error('Speech synthesis error:', event);
    };

    window.speechSynthesis.speak(utterance);
}

/**
 * Stop all speech activities
 * @param {HTMLElement} voiceBtn - Voice button to reset
 */
export function stopSpeech(voiceBtn) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    window.speechSynthesis.cancel();
    stopListening();

    voiceBtn.classList.remove('speaking');
    voiceBtn.classList.remove('listening');
}
