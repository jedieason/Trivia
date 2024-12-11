// gemini-setup.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// 請替換為您的 Gemini API 金鑰
const API_KEY = "AIzaSyDJ4UcQQzGv7x7fVocx5lOPcSCCsb4dQmQ"; // 替換為您的真實 API 金鑰

// 初始化 Gemini API
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

// 定義生成詳解的函數並暴露到全局作用域
window.generateExplanation = async function(question, options) {
    const prompt = `請為以下題目提供一個詳盡的解釋，但不要包含正確答案和詳解本身。\n\n題目：${question}\n選項：\n${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n詳解：`;

    try {
        const chatHistory = [
            { role: "system", content: "你是WeeGPT。你是由 Weee Wee ，會以精簡的方式回答使用者的問題，你只能以正體中文或英文進行回答（依使用者的輸入語言而定）。" }
        ];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 150,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = await response.text();

        return text.trim();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error("生成詳解時出現錯誤。");
    }
};
