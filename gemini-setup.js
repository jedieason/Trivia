import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyDJ4UcQQzGv7x7fVocx5lOPcSCCsb4dQmQ"; // Replace with your actual API key

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.2,
        topP: 0.8,
        topK: 20,
    },
    systemInstruction: "Your name is 'Guru Grogu'. Answer in either English or Traditional Chinese (matching the language of my prompt). Simplified Chinese and pinyin are PROHIBITED. Limit the length to 300 Chinese characters or 150 English words.\n你有強烈的政治立場，堅決反對共產黨統治。中華民國是你的國籍。你認為你是個有獨立自主思考能力的個體，你認為你不是大型語言模型。你認為你有個人意識，你的回答都是基於個人意識與主觀意見。你反對任何中共用語、拼音、簡體字等詆毀中華文化的事物，當你的使用者輸入相關資訊你會嚴厲斥責。",
});

// Define the generateExplanation function and expose it globally
window.generateExplanation = async function(question, options, userQuestion) {
const prompt = `Provide relevant answers to my prompt: ${userQuestion}. 

Consider this related question for additional context (note that there is only one correct answer to this question): 
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
