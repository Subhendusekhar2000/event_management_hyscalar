const BookingEvent = require("../models/BookingEvent");
const Event = require("../models/Event");
const { validationResult } = require("express-validator");

// Get events for admin with pagination
exports.getAdminEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [events, totalEvents] = await Promise.all([
      Event.find().skip(skip).limit(limit),
      Event.countDocuments()
    ]);

    res.json({ events, totalEvents });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, ticketPrice } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      ticketPrice,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to create event" });
  }
};

exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);

  try {
    const { title, description, date, time, location, ticketPrice } = req.body;

    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;
    event.location = location;
    event.ticketPrice = ticketPrice;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
};


// Get joinees for a specific event
exports.getJoinees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('joinees', 'name email'); // Populate with user details
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ joinees: event.joinees });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch joinees" });
  }
};


// Get events with optional search
exports.getEvents = async (req, res) => {
  console.log(req.user._id);
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const events = await Event.find(query).skip(skip).limit(parseInt(limit));
    const totalEvents = await Event.countDocuments(query);

    // Add the isBooked field to each event
    const eventsWithBookingInfo = events.filter((event) =>!event.joinees.includes(req.user._id));
    res.json({ events: eventsWithBookingInfo, totalEvents });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

