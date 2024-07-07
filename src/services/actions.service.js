const historyDB = require("../data/history.db");
const bookingInfoDB = require("../data/bookingInfo.db");

let actions = {
    "SAVE_BOOKING_INFO": actionSaveBookingInfo,
    "UNMATCHED": actionUnmatched
}

function actionUnmatched(room_id, payload) {
    let availableActions = Object.keys(actions).join(", ");
    let errMsg = `Unknown action detected, available actions: `;
    errMsg += availableActions;

    historyDB.addMessage(room_id, {
        "role": "system",
        "message": errMsg,
        "actions": []
    });
}

function actionSaveBookingInfo(room_id, payload) {
    let info = payload;

    bookingInfoDB.saveBookingInfo(room_id, info);
    let unfilled = bookingInfoDB.unfilledBookingInfo(room_id);

    let message = "Booking information saved!";
    if (unfilled.length) {
        message += " Please provide the following information as well: ";
        message += unfilled.join(", ");
    }

    historyDB.addMessage(room_id, {
        "role": "system",
        "message": message,
        "actions": []
    });
}

module.exports = actions;

