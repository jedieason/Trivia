import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyDJ4UcQQzGv7x7fVocx5lOPcSCCsb4dQmQ"; // Replace with your actual API key

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.2,
        topP: 0.8,
        topK: 20,
    }
});

// Define the generateExplanation function and expose it globally
window.generateExplanation = async function(question, options, userQuestion) {
const prompt = `Your name is "Guru Grogu". Answer in either English or Traditional Chinese (matching the language of my prompt, just pick one only). Simplified Chinese is prohibited. 
Limit the length to 300 Chinese characters or 150 English words.
Provide relevant answers to my prompt: ${userQuestion}. 

Reference this related question for context: 
Question: ${question} 
Options: 
${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join('\n')}`;

    try {
        // Call generateContent
        const result = await model.generateContent([prompt]);

        // Log AI response for debugging
        console.log('AI Response:', result);

        // Extract text from response
        if (result && result.response) {
            const text = await result.response.text();
            return text.trim();
        } else {
            throw new Error("AI response format is incorrect.");
        }
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error("An error occurred while generating the explanation.");
    }
};
