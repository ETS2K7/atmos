/**
 * UI Module
 * Handles all DOM manipulation and visual updates.
 */

import { generateSmartSummary, generateWeatherAlerts } from './utils.js';
import { notifyWeatherAlerts } from './notifications.js';
import { weatherState } from './storage.js';

// DOM element references
export const elements = {
    weatherContent: document.getElementById('weather-content'),
    loadingIndicator: document.getElementById('loading-indicator'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    cityNameEl: document.getElementById('city-name'),
    dateTimeEl: document.getElementById('date-time'),
    weatherIconEl: document.getElementById('weather-icon'),
    temperatureEl: document.getElementById('temperature'),
    descriptionEl: document.getElementById('weather-description'),
    smartSummaryEl: document.getElementById('smart-summary'),
    summaryTextEl: document.getElementById('summary-text'),
    feelsLikeEl: document.getElementById('feels-like'),
    humidityEl: document.getElementById('humidity'),
    windSpeedEl: document.getElementById('wind-speed'),
    pressureEl: document.getElementById('pressure'),
    alertsSection: document.getElementById('alerts-section'),
    alertsList: document.getElementById('alerts-list')
};

/** Show loading spinner */
export function showLoading() {
    elements.weatherContent.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
    elements.loadingIndicator.classList.remove('hidden');
}

/** Hide loading spinner */
export function hideLoading() {
    elements.loadingIndicator.classList.add('hidden');
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
    hideLoading();
    elements.weatherContent.classList.add('hidden');
    elements.errorMessage.classList.remove('hidden');
    elements.errorText.textContent = message;
}

/**
 * Update all weather UI elements
 * @param {Object} data - Weather data from OpenWeather API
 */
export function updateUI(data) {
    hideLoading();
    elements.errorMessage.classList.add('hidden');
    elements.weatherContent.classList.remove('hidden');

    elements.cityNameEl.textContent = `${data.name}, ${data.sys.country}`;

    // Calculate target location's local time
    const now = new Date();
    const targetTime = new Date(now.getTime() + (data.timezone * 1000));
    elements.dateTimeEl.textContent = targetTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });

    const temp = Math.round(data.main.temp);
    elements.temperatureEl.textContent = `${temp}°`;
    elements.descriptionEl.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    elements.weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    elements.weatherIconEl.alt = data.weather[0].description;
    elements.weatherIconEl.classList.remove('hidden');

    // Smart summary
    const summary = generateSmartSummary(data);
    elements.summaryTextEl.textContent = summary;
    elements.smartSummaryEl.classList.remove('hidden');

    // Weather details
    elements.feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°`;
    elements.humidityEl.textContent = `${data.main.humidity}%`;
    elements.windSpeedEl.textContent = `${data.wind.speed} m/s`;
    elements.pressureEl.textContent = `${data.main.pressure} hPa`;

    // Alerts
    displayCustomAlerts(data);
}

/** Display weather alerts if extreme conditions exist */
function displayCustomAlerts(data) {
    const alerts = generateWeatherAlerts(data);

    if (alerts.length > 0) {
        elements.alertsSection.classList.remove('hidden');

        // Only send push notifications for current location
        if (weatherState.isCurrentLocation) {
            notifyWeatherAlerts(alerts);
        }

        elements.alertsList.innerHTML = alerts.map(alert => `
            <div class="alert-item">
                <strong>${alert.event}</strong>: ${alert.description}
            </div>
        `).join('');
    } else {
        elements.alertsSection.classList.add('hidden');
    }
}
