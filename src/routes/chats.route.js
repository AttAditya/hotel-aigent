const express = require("express");
const router = express.Router();
const chatService = require("../services/chats.service");

router.get("/", async (req, res) => {
    let room_id = await chatService.createRoom();
    res.json({
        room_id: room_id
    });
});

router.get("/:room_id", async (req, res) => {
    let room_id = req.params.room_id;
    let history = await chatService.getHistory(room_id);

    log(`chat_${room_id}.json`, history, "json");

    res.json(history);
});

router.post("/:room_id", async (req, res) => {
    let room_id = req.params.room_id;
    let body = req.body;
    
    let message = body.message;
    let messageData = {
        "role": "user",
        "message": message,
        "actions": []
    }

    let response = await chatService.onMessage(room_id, messageData);

    res.send(response);
});

module.exports = router;

