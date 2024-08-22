const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    name: String,
    eventStartDate: String,
    eventEndDate: String,
    location: String,
    website: String,
    tagLine: String,
    type: String,
    price: String,
    lat: String,
    long: String,
    description: String,
    limit: { type: Number, default: 5 },
    totalCount: { type: Number, default: 0 },
    featureImage: String,
    galleryImages: Array,
    userID: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = Event = mongoose.model("Event", EventSchema);
