let history = {};

function getHistory(room_id) {
    return history[room_id] ?? [];
}

function addMessage(room_id, message) {
    history[room_id] = history[room_id] ?? [];
    history[room_id].push(message);
}

let historyDB = {
    getHistory: getHistory,
    addMessage: addMessage
}

module.exports = historyDB;

