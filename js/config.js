/**
 * Configuration Module
 * Central place for API keys, endpoints, and app settings.
 */

// OpenWeather API Configuration
// Get your free API key at: https://openweathermap.org/api
export const API_KEY = import.meta.env?.VITE_WEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY';
export const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache duration: 5 minutes
export const CACHE_DURATION = 5 * 60 * 1000;

// Groq AI Configuration  
// Get your free API key at: https://console.groq.com
export const GROQ_CONFIG = {
    apiKey: import.meta.env?.VITE_GROQ_API_KEY || 'YOUR_GROQ_API_KEY',
    chatModel: 'llama-3.3-70b-versatile',
    ttsModel: 'playai-tts',
    ttsVoice: 'Adelaide-PlayAI',
    enabled: true
};
