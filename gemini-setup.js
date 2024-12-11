// gemini-setup.js
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = "AIzaSyDJ4UcQQzGv7x7fVocx5lOPcSCCsb4dQmQ"; // 請務必替換為您的真實 API 金鑰

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
    const prompt = `請回答以下題目，並請詳細地解釋為什麼，也可適時補充相關生物觀念。\n\n題目：${question}\n選項：\n${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n詳解：`;

    try {
        // 呼叫 generateContent
        const result = await model.generateContent([prompt]);

        // 新增日誌以檢查回應結構
        console.log('AI Response:', result);

        // 根據成功專案的回應結構，使用 result.response.text()
        if (result && result.response) {
            const text = await result.response.text();
            return text.trim();
        } else {
            throw new Error("AI 回應格式不正確。");
        }
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error("生成詳解時出現錯誤。");
    }
};
