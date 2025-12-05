/**
 * Chart Module
 * Creates and manages the forecast chart using Chart.js.
 */

let weatherChart = null;

/**
 * Update the forecast chart with new data
 * @param {Object} data - Forecast data from OpenWeather API
 */
export function updateChart(data) {
    const chartCanvas = document.getElementById('forecast-chart');
    const list = data.list.slice(0, 24); // 3 days of data

    // Generate labels (time strings)
    const labels = list.map(item => {
        const date = new Date(item.dt * 1000);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', weekday: 'short' });
    });

    // Extract temperatures
    const temps = list.map(item => item.main.temp);

    // Destroy existing chart if any
    if (weatherChart) {
        weatherChart.destroy();
    }

    // Chart.js defaults
    Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

    // Create new chart
    weatherChart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#4facfe',
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8
                    }
                }
            }
        }
    });
}
