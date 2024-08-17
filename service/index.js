const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { register, login } = require("./controllers/authController");
const {
  createEvent,
  getAdminEvents,
  updateEvent,
  getJoinees,
  getEvents,
} = require("./controllers/eventController");
const { isAuthenticated, isAdmin } = require("./middleware/authMiddleware");
const {
  bookEvent,
  getUserBookings,
  getPendingBookings,
  updateBookingStatus,
} = require("./controllers/bookingController");
const { getNotifications } = require("./controllers/notificationController");

const app = express();

app.use(bodyParser.json());
app.use(cors());

console.log(process.env.JWT_SECRET);

mongoose
  .connect(
    "mongodb+srv://sekharsubhendu352000:Sanusubhe%40%23123@cluster0.3xwjeky.mongodb.net/eventmanagement?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Basic Route
app.get("/", (req, res) => {
  res.send("Event Management System API");
});

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

app
  .get("/api/events", isAuthenticated, isAdmin, getAdminEvents)
  .post("/api/events", isAuthenticated, isAdmin, createEvent);
app.put("/api/events/:id", isAuthenticated, isAdmin, updateEvent);
app.get("/api/events/:id/joinees", isAuthenticated, isAdmin, getJoinees);
app.get("/api/events/approve", isAuthenticated, isAdmin, getUserBookings);
app.post("/api/bookings/:id", isAuthenticated, isAdmin, updateBookingStatus);
app.get("/api/events/bookings", isAuthenticated, getPendingBookings);

// user
app.get("/api/events/search", isAuthenticated, getEvents);
app.post("/api/events/book", isAuthenticated, bookEvent);
// Start Server

//notification

app.get("/api/notifications", isAuthenticated, getNotifications);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
