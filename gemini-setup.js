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
    const prompt = `請回答以下題目，病提供一個詳盡的解釋。\n\n題目：${question}\n選項：\n${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n詳解：`;

    try {
        // 直接以用戶訊息開始對話
        const result = await model.generateContent([prompt]);

        // 假設 generateContent 返回的結果包含完整的回應
        const text = result.choices[0].text.trim();

        return text;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error("生成詳解時出現錯誤。");
    }
};

