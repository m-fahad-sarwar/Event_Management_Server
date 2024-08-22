const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    review: String,
    star: Number,
    eventID: { type: Schema.Types.ObjectId, ref: "Event" },
    userID: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = Rating = mongoose.model("Rating", ratingSchema);
