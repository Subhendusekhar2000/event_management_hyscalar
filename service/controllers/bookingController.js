const BookingEvent = require("../models/BookingEvent");
const Event = require("../models/Event");
const { validationResult } = require("express-validator");
const Notification = require("../models/Notification");

// Book an event
exports.bookEvent = async (req, res) => {
  console.log("boooking controller called !");
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.joinees.includes(userId)) {
      return res.status(202).json({ message: "You have already registered !" });
    }
    
    // Create booking
    const booking = new BookingEvent({
      eventId,
      bookedBy: userId,
      transactionStatus: "pending", // Default status
    });
    // event.joinees.push(userId);
    event.save();

    await booking.save();
    res.status(201).json({ message: "Successfully Registered for the Event. Your request will be reviewd by Organiser !", booking });
  } catch (error) {
    console.error("Failed to book event", error);
    res.status(500).json({ message: "Failed to book event" });
  }
};

// Get bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    let bookings = await BookingEvent.find({ bookedBy: userId })
      .populate("eventId", "title description date location")
      .exec();  

    res.json(bookings);

  } catch (error) {
    console.error("Failed to fetch user bookings", error);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

// Update booking status (e.g., after payment)
exports.updateBookingStatus = async (req, res) => {
  console.log("update booking status !")
  const { id } = req.params;
  console.log(id);
  const { bookingStatus="", transactionStatus="" } = req.body; // Expecting booking ID and new status

  try {
    const booking = await BookingEvent.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (transactionStatus) {
      booking.transactionStatus = transactionStatus;
    } 
    if (bookingStatus) {
      booking.bookingStatus = bookingStatus;
    }
    await booking.save();
    const event = await Event.findById(booking.eventId);
    event.joinees.push(booking.bookedBy);
    await event.save()

    const notificationData = {
      recipient: booking.bookedBy,
      sender: req.user.id,
      booking: id,
      event: booking.eventId,
      message: "Approved your event registration",
      type: "booking",
    };
    await Notification.create(notificationData);

    res.status(200).json(booking);
  } catch (error) {
    console.error("Failed to update booking status", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};



exports.getPendingBookings = async (req, res) => {
  const { user } = req;
  try {
    const { page = 1, limit = 5, bookingStatus = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (user.role == "admin") {
      query.bookingStatus = 'pending';
    }
    if (bookingStatus) {
      query.bookingStatus = bookingStatus;
    }

    const bookings = await BookingEvent.find(query)
      .populate("eventId", "title time date location")
      .populate("bookedBy", "name");

    // Add the isBooked field to each event

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};