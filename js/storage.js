/**
 * Storage & State Management Module
 * Handles localStorage caching and application state.
 */

import { CACHE_DURATION } from './config.js';

// Application state
export const weatherState = {
    data: null,
    forecast: null,
    lastUpdated: null,
    isCurrentLocation: false
};

/**
 * Save weather data to localStorage
 * @param {Object} data - Weather data from API
 * @param {'current'|'forecast'} type - Type of data being saved
 */
export function saveToStorage(data, type) {
    if (type === 'current') {
        weatherState.data = data;
    } else if (type === 'forecast') {
        weatherState.forecast = data;
    }

    weatherState.lastUpdated = new Date().getTime();

    try {
        localStorage.setItem('atmos_weather_state', JSON.stringify(weatherState));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
}

/**
 * Load cached weather data from localStorage
 * @returns {Object|null} Cached data if valid and fresh, null otherwise
 */
export function loadFromStorage() {
    try {
        const stored = localStorage.getItem('atmos_weather_state');
        if (!stored) return null;

        const parsed = JSON.parse(stored);

        if (new Date().getTime() - parsed.lastUpdated < CACHE_DURATION) {
            weatherState.data = parsed.data;
            weatherState.forecast = parsed.forecast;
            weatherState.lastUpdated = parsed.lastUpdated;
            return parsed;
        }

        return null;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return null;
    }
}
