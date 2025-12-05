/**
 * Utility Functions Module
 * Pure functions for weather summaries and alerts.
 */

/**
 * Generate a context-aware weather summary
 * @param {Object} data - Weather data from OpenWeather API
 * @returns {string} Friendly weather summary with emoji
 */
export function generateSmartSummary(data) {
    const temp = data.main.temp;
    const condition = data.weather[0].main.toLowerCase();
    const wind = data.wind.speed;
    const humidity = data.main.humidity;

    // Priority-based conditions
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
        return "Don't forget your umbrella, it's wet outside! ☔";
    }

    if (condition.includes('snow')) {
        return "Bundle up! It's snowing. ❄️";
    }

    if (temp > 35) {
        return "Extreme heat! Stay indoors and keep hydrated. 🔥";
    }

    if (temp < 0) {
        return "Freezing conditions! Dress in layers and stay warm. 🥶";
    }

    if (temp < 10) {
        return "It's quite chilly. Wear a warm jacket! 🧥";
    }

    if (wind > 15) {
        return "Very windy today! Secure loose items. 💨";
    }

    if (wind > 10) {
        return "Hold onto your hat, it's windy! 💨";
    }

    if (condition.includes('clear') && temp > 25) {
        return "It's a beautiful sunny day! Stay hydrated. ☀️";
    }

    if (condition.includes('clouds') && temp > 20) {
        return "Perfect weather for a walk, though a bit cloudy. ☁️";
    }

    if (humidity > 85) {
        return "It feels quite humid today. 💧";
    }

    return "Enjoy your day! 😊";
}

/**
 * Generate weather alerts for extreme conditions
 * @param {Object} data - Weather data from OpenWeather API
 * @returns {Array<{event: string, description: string}>} Array of alert objects
 */
export function generateWeatherAlerts(data) {
    const alerts = [];
    const temp = data.main.temp;
    const wind = data.wind.speed;
    const condition = data.weather[0].main.toLowerCase();

    if (temp > 35) {
        alerts.push({
            event: 'Extreme Heat',
            description: 'Temperature exceeds 35°C. Stay hydrated and avoid prolonged sun exposure.'
        });
    } else if (temp < 0) {
        alerts.push({
            event: 'Freezing Conditions',
            description: 'Temperature below 0°C. Be cautious of ice and dress warmly.'
        });
    }

    if (wind > 15) {
        alerts.push({
            event: 'High Winds',
            description: `Wind speed is ${wind} m/s. Secure loose objects and be cautious outdoors.`
        });
    }

    if (condition.includes('thunderstorm')) {
        alerts.push({
            event: 'Thunderstorm Warning',
            description: 'Thunderstorms detected. Seek shelter and avoid outdoor activities.'
        });
    }

    return alerts;
}
