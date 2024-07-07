const { matchSchema, schemaRequirements } = require("../utils");
let bookingInfo = {};

const bookingInfoSchema = {
    "check_in": "string",
    "check_out": "string",
    "guests": "number",
    "hotel_id": "string",
    "room_type": "string",
    "room_id": "string",
    "country": "string",
    "state": "string",
    "city": "string",
    "email": "string",
    "phone": "string",
    "first_name": "string",
    "last_name": "string"
}

function saveBookingInfo(room_id, info) {
    bookingInfo[room_id] = bookingInfo[room_id] ?? {};
    bookingInfo[room_id] = {
        ...bookingInfo[room_id],
        ...matchSchema(info, bookingInfoSchema)
    }
}

function unfilledBookingInfo(room_id) {
    return schemaRequirements(bookingInfo[room_id], bookingInfoSchema);
}

let bookingInfoDB = {
    saveBookingInfo: saveBookingInfo,
    unfilledBookingInfo: unfilledBookingInfo
}

module.exports = bookingInfoDB;

