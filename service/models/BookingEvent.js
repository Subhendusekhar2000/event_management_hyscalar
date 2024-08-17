const mongoose = require("mongoose");

const BookingEventSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["pending", "success", "rejected"],
    default: "pending",
  },
  transactionStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookingEvent", BookingEventSchema);
