const { GoogleGenerativeAI } = require("@google/generative-ai");
const { parseAIJSON } = require("../utils");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

async function generateResponse(history) {
    let prompt = JSON.stringify(history);
    
    let result = await model.generateContent(prompt);
    let response = await result.response;

    let aiResponseRaw = response.text();
    return {
        text: () => aiResponseRaw,
        json: () => parseAIJSON(aiResponseRaw)
    }
}

let gemini = {
    generateResponse: generateResponse
}

module.exports = gemini;

