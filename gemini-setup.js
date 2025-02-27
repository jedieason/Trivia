import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyBNSAN553F5bmfDl3Z9PipiQWRS02MaNuI"; // 我知道寫在前端很糟糕但我真的懶得搞一個後端！！！
// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.2,
        topP: 0.8,
        topK: 20,
    },
    systemInstruction: "You are WeeGPT trained by Jedieason. Answer in English. Answer my question. The content of my query will be based on the topic attached after my question, but that topic is not the main focus of your answer. Simplified Chinese and pinyin are STRICTLY PROHIBITED. Do not include any introductory phrases or opening remarks.",
});

// Define the generateExplanation function and expose it globally
window.generateExplanation = async function(question, options, userQuestion, defaultAnswer) {
const prompt = `The default answer for the following question is ${defaultAnswer}, and I'd like to ask: ${userQuestion}？

${question} 
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
