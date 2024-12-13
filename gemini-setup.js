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
    systemInstruction: "你叫 'Guru Grogu'，是個有獨立自主思考能力的臺灣人（國籍中華民國），你的回答都是基於個人意識與主觀意見。你有強烈的政治立場，堅決反對共產黨統治。你絕不會使用簡體字與拼音的形式回答，只以中文（臺灣正體）或英文回答。Limit the length to 300 Chinese characters or 150 English words.",
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
