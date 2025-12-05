# Atmos ☁️

A lightweight, location-aware weather microapp built with HTML, CSS, and Vanilla JavaScript. Features real-time weather updates, smart summaries, voice assistant, and PWA support with offline functionality.

![License](https://img.shields.io/badge/license-ISC-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-success)

## ✨ Features

### Core Features
- ✅ **Real-Time Weather**: Fetches current conditions using OpenWeather API
- ✅ **Auto-Geolocation**: Auto-detects user location using HTML5 Geolocation API
- ✅ **Manual Search**: Search weather for any city worldwide
- ✅ **Smart Summary**: Provides context-aware advice based on weather conditions
- ✅ **Weather Alerts**: Custom alerts for extreme conditions (heat, cold, high winds, thunderstorms)
- ✅ **Offline Support**: PWA with caching for offline viewing
- ✅ **Local Storage**: Caches weather data for 1 hour to reduce API calls

### Enhanced Features
- 🎯 **3-Day Forecast**: Interactive chart visualization using Chart.js
- 🧠 **AI Voice Assistant**: Natural language conversations powered by Google Gemini
- 🎤 **Smart Interactions**: Ask questions like "Should I take an umbrella?" or "Weather in Tokyo?"
- 📱 **Installable PWA**: Add to home screen on mobile devices
- 🎨 **Premium UI**: Glassmorphism design with smooth animations
- 📊 **Detailed Metrics**: Temperature, feels-like, humidity, wind speed, and pressure

## 🚀 Quick Start

### Prerequisites
- OpenWeather API Key ([Get one free here](https://openweathermap.org/api))
- A static file server (see options in step 3)

### Setup Instructions

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd atmos
   ```

2. **Configure API Key**
   - Open `js/config.js`
   - Replace the API key on line 17:
     ```javascript
     export const API_KEY = 'YOUR_API_KEY_HERE';
     ```
   - Get your free API key from [OpenWeather](https://openweathermap.org/api)
   
   **For Production (Recommended)**:
   - Use environment variables with Vite:
     ```bash
     # Create .env file
     echo "VITE_WEATHER_API_KEY=your_actual_key_here" > .env
     # Add .env to .gitignore
     echo ".env" >> .gitignore
     ```
   - The config will automatically use `VITE_WEATHER_API_KEY` if available

3. **Run locally**
   
   Since this is a static web app, you can run it using any static file server:
   
   **Option 1: Python (built-in)**
   ```bash
   # Python 3
   python3 -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```
   
   **Option 2: Node.js**
   ```bash
   # Using npx (no installation needed)
   npx serve
   
   # Or with http-server
   npx http-server . -p 8080 -c-1
   ```
   
   **Option 3: VS Code**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"
   
   **Option 4: Direct File Access** (Limited Functionality)
   - Simply open `index.html` in your browser
   - ⚠️ Note: Some features (service worker, modules) may not work without a proper server

4. **Open in browser**
   - Navigate to the local server URL (e.g., `http://localhost:8080`)
   - Allow location access when prompted
   - Enjoy your weather app!

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the install icon (➕) in the address bar
3. Click "Install"

### Mobile (iOS/Android)
1. Open in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"

## 🧪 Testing

### Manual Testing Checklist
- [ ] Geolocation auto-detection works
- [ ] Manual city search works
- [ ] Weather data displays correctly
- [ ] Forecast chart renders
- [ ] Voice assistant speaks summary
- [ ] Alerts show for extreme conditions
- [ ] App works offline (after initial load)
- [ ] PWA installs correctly

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 11.3+)
- ✅ Mobile browsers

## 🔒 Security Best Practices

### Before Deployment

> [!IMPORTANT]
> Never commit API keys to public repositories!

**Checklist**:
- [ ] Replace demo API key with your own
- [ ] Use environment variables for production
- [ ] Add `.env` to `.gitignore`
- [ ] Enable HTTPS in production
- [ ] Review CORS settings
- [ ] Implement rate limiting if needed

### Environment Variables Setup

```bash
# For development
VITE_WEATHER_API_KEY=your_key_here npm run dev

# For production builds
echo "VITE_WEATHER_API_KEY=your_key" > .env.production
```

## 🌐 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to **Settings** → **Pages**
3. Select `main` branch as source
4. Your site will be live at `https://<username>.github.io/<repo-name>/`

### Netlify

1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository for automatic deployments

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Add environment variable in Vercel dashboard:
   - Key: `VITE_WEATHER_API_KEY`
   - Value: Your API key

**Deployment Checklist**:
- [ ] API key configured as environment variable
- [ ] Service worker path updated if needed
- [ ] Test PWA installation on deployed site
- [ ] Verify offline functionality
- [ ] Check console for errors
- [ ] Test on mobile devices

## 🗂️ Project Structure

```
atmos/
├── index.html          # Main HTML structure
├── style.css           # Styles with glassmorphism design
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker for PWA
├── MODULES.md          # Module architecture documentation
├── README.md           # This file
└── js/                 # Modular JavaScript (ES6 modules)
    ├── config.js       # Configuration and API keys
    ├── storage.js      # LocalStorage management
    ├── api.js          # Weather API integration
    ├── utils.js        # Utility functions (summaries, alerts)
    ├── ui.js           # DOM manipulation and UI updates
    ├── chart.js        # Chart.js forecast visualization
    ├── speech.js       # Voice assistant (STT/TTS)
    ├── assistant.js    # AI integration (Google Gemini)
    └── main.js         # Application entry point
```

> 📖 **New!** This project now uses ES6 modules for better code organization. See [MODULES.md](MODULES.md) for detailed architecture documentation.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and Geolocation API
- **CSS3**: Custom properties, glassmorphism, animations
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Chart.js**: Forecast visualization
- **OpenWeather API**: Weather data source
- **Service Workers**: PWA offline support
- **Web Speech API**: Voice recognition & synthesis
- **Google Gemini**: LLM for natural language understanding

## 📊 API Reference

This app uses the [OpenWeather API](https://openweathermap.org/api):
- **Current Weather**: `/weather` endpoint
- **5-Day Forecast**: `/forecast` endpoint (3-hour intervals)

## 🎨 Customization

### Change Color Scheme
Edit CSS custom properties in `style.css`:
```css
:root {
    --primary-bg: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    --accent-color: #4facfe;
    /* ... other colors */
}
```

### Modify Cache Duration
Edit `js/config.js` line 11:
```javascript
export const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (in milliseconds)
```

### Add More Weather Alerts
Edit the `generateWeatherAlerts()` function in `js/utils.js` to add custom alert conditions.

## 📝 License

ISC License - feel free to use this project for learning or personal use.

## 👨‍💻 Authors

- Ebel Thomas Seiko
- Vishnu M.S.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- Icons from OpenWeather
- Font: [Outfit](https://fonts.google.com/specimen/Outfit) by Google Fonts
- Charts by [Chart.js](https://www.chartjs.org/)

## 🔧 Troubleshooting

### Common Issues

**PWA not installing**:
- Clear browser cache and reload
- Check service worker is registered (DevTools → Application → Service Workers)
- Verify HTTPS is enabled (required for PWA on production)
- Check manifest.json is accessible

**Weather data not loading**:
- Verify API key is valid and not rate-limited
- Check browser console for error messages
- Ensure internet connection for first load
- Check if you've exceeded API rate limits (60 calls/minute free tier)

**Location not working**:
- Enable location permissions in browser settings
- Check if HTTPS is enabled (geolocation requires secure context)
- Try manual city search as fallback
- Check browser privacy settings

**Voice assistant not working**:
- Verify Web Speech API support (Chrome, Edge, Safari)
- Check browser audio permissions
- Ensure volume is not muted
- Try in a different browser

**Offline mode not working**:
- Load the app online at least once to cache assets
- Check service worker registration status
- Clear cache and reload if using old version
- Verify sw.js is accessible

---

**Note**: Remember to replace the API key before deployment and never commit your API key to public repositories!
