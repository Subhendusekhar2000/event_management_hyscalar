const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const { user } = req;

  try {
    // Fetch notifications for the logged-in user
    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 }) // Optional: Sort by most recent first
      .populate("sender", "name") // Optional: Populate sender field with user name
      .populate("event", "title") // Optional: Populate event field with event title
      .populate("booking", "bookingStatus"); // Optional: Populate booking field with booking status

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};
