/**
 * AI Assistant Module
 * Handles natural language processing using Groq's LLM.
 */

import { GROQ_CONFIG } from './config.js';

/**
 * Process voice query and get AI response
 * @param {string} query - User's question
 * @param {Object} weatherContext - Current weather data for context
 * @returns {Promise<{text: string, location: string|null}>}
 */
export async function processVoiceQuery(query, weatherContext) {
    if (!GROQ_CONFIG.enabled || !GROQ_CONFIG.apiKey) {
        return {
            text: "I'm sorry, I haven't been configured correctly. Please check my API key.",
            location: null
        };
    }

    try {
        const systemPrompt = constructSystemPrompt(weatherContext);
        const response = await callGroqAPI(systemPrompt, query);
        return parseResponse(response);
    } catch (error) {
        console.error('Groq API Error:', error);
        return {
            text: "I'm having trouble connecting to my brain right now. Please try again later.",
            location: null
        };
    }
}

/** Build the system prompt with weather context */
function constructSystemPrompt(weatherContext) {
    let contextStr = "No weather data available yet.";

    if (weatherContext) {
        const { name, main, weather, wind } = weatherContext;
        contextStr = `
        Current Location: ${name}
        Temperature: ${Math.round(main.temp)}°C (Feels like ${Math.round(main.feels_like)}°C)
        Condition: ${weather[0].description}
        Humidity: ${main.humidity}%
        Wind: ${wind.speed} m/s
        `;
    }

    return `You are Atmos, a helpful and friendly weather assistant.
    
Current Weather Context:
${contextStr}

Instructions:
1. Answer the user's question based on the weather context provided.
2. Keep your answer concise (1-2 sentences) and natural.
3. **Location Extraction Rules (Follow Strictly):**
   - **PRIORITY 1 (Specific City):** If the user mentions a specific city (e.g., "Paris", "London", "New York"), output that city name as the Location.
   - **PRIORITY 2 (Current Location):** If the user explicitly asks about "MY weather", "MY location", "HERE", or "CURRENT location", output "CURRENT_LOCATION".
   - **PRIORITY 3 (Contextual):** If the user asks general questions ("Is it raining?", "Should I go out?") WITHOUT mentioning a place, output "None".

Output Format:
Response: [Your natural language response]
Location: [Extracted City Name, "CURRENT_LOCATION", or "None"]`;
}

/** Make API request to Groq */
async function callGroqAPI(systemPrompt, userQuery) {
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: GROQ_CONFIG.chatModel,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userQuery }
            ],
            temperature: 0.7,
            max_tokens: 200
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

/** Extract structured data from AI response */
function parseResponse(rawText) {
    const locationMatch = rawText.match(/Location:\s*(.+)/i);
    const responseMatch = rawText.match(/Response:\s*(.+)/i);

    let text = rawText;
    let location = null;

    if (responseMatch) {
        text = responseMatch[1].trim();
    }

    text = text.replace(/Location:.*/si, '').trim();

    if (locationMatch) {
        const loc = locationMatch[1].trim();
        if (loc.toLowerCase() !== 'none') {
            location = loc;
        }
    }

    return { text, location };
}
