/**
 * Main Application Entry Point
 * Orchestrates all modules and handles user interactions.
 */

import { getCurrentLocationWeather, getWeatherByCity } from './api.js';
import { updateUI, showLoading, hideLoading, showError } from './ui.js';
import { loadFromStorage, weatherState } from './storage.js';
import { updateChart } from './chart.js';
import { processVoiceQuery } from './assistant.js';
import { startListening, stopListening, speakWeather, stopSpeech } from './speech.js';
import { CACHE_DURATION } from './config.js';
import { initNotifications } from './notifications.js';

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const voiceBtn = document.getElementById('voice-btn');

/** Initialize application */
function initializeApp() {
    const cachedData = loadFromStorage();

    if (cachedData) {
        if (cachedData.data) updateUI(cachedData.data);
        if (cachedData.forecast) updateChart(cachedData.forecast);
    } else {
        getCurrentLocationWeather();
    }
}

/** Handle city search */
function handleSearchClick() {
    const city = cityInput.value.trim();

    if (city) {
        getWeatherByCity(city);
        cityInput.value = '';
    }
}

/** Handle Enter key in search input */
function handleCityInputKeypress(e) {
    if (e.key === 'Enter') {
        handleSearchClick();
    }
}

/** Handle voice assistant toggle */
function handleVoiceClick() {
    if (voiceBtn.classList.contains('speaking') || voiceBtn.classList.contains('listening')) {
        stopSpeech(voiceBtn);
        return;
    }

    voiceBtn.classList.add('listening');

    startListening(
        async (transcript) => {
            voiceBtn.classList.remove('listening');
            voiceBtn.classList.add('speaking');

            let response = await processVoiceQuery(transcript, weatherState.data);

            if (response.location) {
                try {
                    let newData;

                    if (response.location === 'CURRENT_LOCATION') {
                        // Check if fresh GPS data already available
                        if (weatherState.data && weatherState.lastUpdated && weatherState.isCurrentLocation) {
                            const cacheAge = new Date().getTime() - weatherState.lastUpdated;

                            if (cacheAge < CACHE_DURATION) {
                                speakWeather(response.text, voiceBtn);
                                return;
                            }
                        }
                        newData = await getCurrentLocationWeather();
                    } else {
                        // Check if same city already displayed
                        const currentCity = weatherState.data?.name?.toLowerCase();
                        const requestedCity = response.location.toLowerCase();

                        if (currentCity && currentCity === requestedCity) {
                            speakWeather(response.text, voiceBtn);
                            return;
                        }
                        newData = await getWeatherByCity(response.location);
                    }

                    // Re-query AI with new weather context
                    response = await processVoiceQuery(transcript, newData);

                } catch (error) {
                    console.error('Failed to update location:', error);
                    response.text = "I couldn't find weather data for that location.";
                }
            }

            speakWeather(response.text, voiceBtn);
        },
        () => {
            voiceBtn.classList.remove('listening');
        },
        (error) => {
            voiceBtn.classList.remove('listening');
            console.error('Speech error:', error);

            if (error === 'not-allowed') {
                showError('Microphone access denied. Please enable permissions.');
            }
        }
    );
}

/** Setup all event listeners */
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearchClick);
    cityInput.addEventListener('keypress', handleCityInputKeypress);
    locationBtn.addEventListener('click', getCurrentLocationWeather);
    voiceBtn.addEventListener('click', handleVoiceClick);
}

// Application startup
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    initializeApp();
    initNotifications();
});
