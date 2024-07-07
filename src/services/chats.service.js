const agents = require("./agent.service");
const historyDB = require("../data/history.db");
const actionService = require("./actions.service");
const fs = require("fs");

const model = agents.gemini;

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

async function chatOnMessage(room_id, messageData) {
    historyDB.addMessage(room_id, messageData);

    let history = historyDB.getHistory(room_id);
    let aiResponseRaw = await model.generateResponse(history)
    let aiResponse = aiResponseRaw.json();

    historyDB.addMessage(room_id, {
        "role": "ai",
        "message": aiResponse.message,
        "actions": aiResponse.actions
    });

    if (aiResponse.actions.length) {
        for (let actionData of aiResponse.actions) {
            console.log(actionData);
        }
    }

    let aiMessage = aiResponse.message;
    return aiMessage;
}

async function chatOnAction(room_id, actionData) {
    switch (actionData.type) {}
}

let chat = {
    createRoom: chatCreateRoom,
    onMessage: chatOnMessage
}

module.exports = chat;

