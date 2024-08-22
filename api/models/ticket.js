const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    ticketNo: String,
    price: String,
    eventID: { type: Schema.Types.ObjectId, ref: "Event" },
    userID: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = Event = mongoose.model("Ticket", TicketSchema);
