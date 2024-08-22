const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavouriteSchema = new Schema(
  {
    eventID: { type: Schema.Types.ObjectId, ref: "Event" },
    userID: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = Event = mongoose.model("Favourite", FavouriteSchema);
