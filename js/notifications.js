/**
 * Browser Push Notifications Module
 * Handles notification permissions and weather alerts.
 */

/**
 * Request notification permission from user
 * @returns {Promise<boolean>} True if permission granted
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications.');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.warn('Notification permission was denied.');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
}

/**
 * Display a browser notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {Object} options - Optional configuration
 * @returns {Notification|null} The notification object or null
 */
export function showWeatherNotification(title, body, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        console.warn('Cannot show notification - permission not granted.');
        return null;
    }

    const notification = new Notification(title, {
        body: body,
        icon: 'https://openweathermap.org/img/wn/11d@2x.png',
        badge: 'https://openweathermap.org/img/wn/11d.png',
        tag: options.tag || 'weather-alert',
        requireInteraction: true,
        ...options
    });

    notification.onclick = function () {
        window.focus();
        notification.close();
    };

    return notification;
}

/**
 * Show browser notifications for weather alerts
 * @param {Array<{event: string, description: string}>} alerts - Alert objects
 */
export function notifyWeatherAlerts(alerts) {
    if (!alerts || alerts.length === 0) return;
    if (Notification.permission !== 'granted') return;

    alerts.forEach((alert, index) => {
        setTimeout(() => {
            showWeatherNotification(
                `⚠️ ${alert.event}`,
                alert.description,
                { tag: `weather-alert-${alert.event.toLowerCase().replace(/\s+/g, '-')}` }
            );
        }, index * 1000);
    });
}

/**
 * Initialize notification system
 * @returns {Promise<boolean>} Whether notifications are available
 */
export async function initNotifications() {
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
        console.log('🔔 Browser notifications enabled.');
    } else {
        console.log('🔕 Browser notifications not available.');
    }

    return hasPermission;
}
