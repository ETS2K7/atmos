/**
 * API Communication Module
 * Handles all OpenWeather API requests and geolocation.
 */

import { API_KEY, BASE_URL } from './config.js';
import { saveToStorage, weatherState } from './storage.js';
import { updateUI, showError, hideLoading, showLoading } from './ui.js';
import { updateChart } from './chart.js';

/**
 * Fetch weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export function fetchWeather(lat, lon) {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data.');
            }
            return response.json();
        })
        .then(data => {
            updateUI(data);
            saveToStorage(data, 'current');
            weatherState.isCurrentLocation = true;
            return data;
        })
        .catch(error => {
            showError('Failed to fetch weather data. Please check your connection.');
            throw error;
        });
}

/**
 * Fetch weather data by city name
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
export function getWeatherByCity(city) {
    if (!city || city.trim() === '') {
        showError('Please enter a city name.');
        return Promise.reject('Empty city name');
    }

    showLoading();

    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your configuration.');
                } else {
                    throw new Error('Failed to fetch weather data. Please try again.');
                }
            }
            return response.json();
        })
        .then(data => {
            updateUI(data);
            saveToStorage(data, 'current');
            weatherState.isCurrentLocation = false;
            fetchForecast(data.coord.lat, data.coord.lon);
            return data;
        })
        .catch(error => {
            showError(error.message);
            throw error;
        });
}

/**
 * Fetch 3-day forecast data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export function fetchForecast(lat, lon) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast data not found');
            }
            return response.json();
        })
        .then(data => {
            updateChart(data);
            saveToStorage(data, 'forecast');
        })
        .catch(error => {
            console.warn('Unable to load forecast:', error);
        });
}

/**
 * Get weather for user's current location
 * @returns {Promise<Object>} Weather data
 */
export function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return Promise.reject('Geolocation not supported');
    }

    showLoading();

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                fetchWeather(latitude, longitude)
                    .then(data => {
                        fetchForecast(latitude, longitude);
                        resolve(data);
                    })
                    .catch(error => reject(error));
            },
            (error) => {
                let errorMsg = 'Unable to retrieve your location.';

                if (error.code === error.PERMISSION_DENIED) {
                    errorMsg = 'Location access denied. Please enable location services or search manually.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMsg = 'Location information unavailable. Please search manually.';
                } else if (error.code === error.TIMEOUT) {
                    errorMsg = 'Location request timed out. Please try again or search manually.';
                }

                showError(errorMsg);
                reject(errorMsg);
            }
        );
    });
}
