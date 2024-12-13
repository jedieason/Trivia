import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyDJ4UcQQzGv7x7fVocx5lOPcSCCsb4dQmQ"; // Replace with your actual API key

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
    generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        stopSequences: ["\n"],
    }
});

// Define the generateExplanation function and expose it globally
window.generateExplanation = async function(question, options, userQuestion) {
    const prompt = `Respond in either English or Traditional Chinese (use the same language as my prompt). Simplified Chinese is prohibited.
Note that all of your responses should only be in a single line. 中文生成內容不得超過300字，英文內容則無字數限制。
Detailedly answer my prompt, supplementing with relevant concepts as needed: ${userQuestion}

Also, my prompt is related to the following question.
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
