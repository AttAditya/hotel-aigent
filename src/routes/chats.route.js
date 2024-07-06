const express = require("express");
const router = express.Router();
const geminiService = require("../services/gemini.service");

router.get("/", async (req, res) => {
    let room_id = await geminiService.createRoom();
    res.json({
        room_id: room_id
    });
});

router.post("/:room_id", async (req, res) => {
    let room_id = req.params.room_id;
    let body = req.body;
    
    let message = body.message;
    let response = await geminiService.onMessage(room_id, message, "user", []);

    res.send(response);
});

module.exports = router;

