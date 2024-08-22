const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema(
  {
    eventID: { type: Schema.Types.ObjectId, ref: "Event" },
    placeID: { type: Schema.Types.ObjectId, ref: "Place" },
    fID: String,
    userID: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = Favorite = mongoose.model("Favorite", FavoriteSchema);
