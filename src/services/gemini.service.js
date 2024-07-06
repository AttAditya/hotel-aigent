const { GoogleGenerativeAI } = require("@google/generative-ai");
const historyDB = require("../data/history.db");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

async function chatCreateRoom() {
    let room_id = "";
    let tokenLength = 7;

    for (let i = 0; i < tokenLength; i++) {
        let random = Math.floor(Math.random() * 16);
        let randomChar = random.toString(16);
        room_id += randomChar;
    }

    historyDB.addMessage(room_id, {
        "role": "system",
        "message": fs.readFileSync("./src/data/first_message.txt", "utf8"),
        "actions": []
    });

    historyDB.addMessage(room_id, {
        "role": "ai",
        "message": "Hi! I'm Hotel AIgent, how can I help you today?",
        "actions": []
    });

    return room_id;
}

async function chatOnMessage(room_id, message, role, actions) {
    historyDB.addMessage(room_id, {
        "role": role,
        "message": message,
        "actions": actions
    });

    let history = historyDB.getHistory(room_id);
    let prompt = JSON.stringify(history);

    let result = await model.generateContent(prompt);
    let response = await result.response;
    let aiResponseRaw = response.text();

    if (aiResponseRaw.startsWith("```json")) {
        aiResponseRaw = aiResponseRaw.split("```json");
        aiResponseRaw.shift();
        aiResponseRaw = aiResponseRaw.join("```json");

        aiResponseRaw = aiResponseRaw.split("```");
        aiResponseRaw.pop();
        aiResponseRaw = aiResponseRaw.join("```");
    }
    
    let aiResponse = JSON.parse(aiResponseRaw);

    historyDB.addMessage(room_id, {
        "role": "ai",
        "message": aiResponse.message,
        "actions": aiResponse.actions
    });

    let logsPath = `logs/chat_${room_id}.json`;
    fs.writeFileSync(logsPath, JSON.stringify(history, null, 4), "utf8", () => {});

    let aiMessage = aiResponse.message;
    return aiMessage;
}

let chat = {
    createRoom: chatCreateRoom,
    onMessage: chatOnMessage
}

module.exports = chat;

