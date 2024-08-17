import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";

const NotificationCard = ({ notification }) => {
  return (
    <div className="border-none border-2 bg-gray-100 rounded w-full p-[20px] mt-[10px] shadow-md">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-blue-600">
            {notification.message}
          </h3>
          <p className="text-gray-600">
            Event: <strong>{notification.event.title}</strong>
          </p>
          <p className="text-gray-600">
            Booking Status:{" "}
            <strong>{notification.booking.bookingStatus}</strong>
          </p>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        From: <strong>{notification.sender.name}</strong>
      </div>
    </div>
  );
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-gray-500">No notifications found</div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-blue-200 via-gray-300 to-bg-blue-300">
      <div className="flex justify-between items-center w-full bg-blue-600 px-10 h-[80px]">
        <div className="h-full flex items-center">
          <span className="text-2xl font-bold font-sans mb-6 text-white">
            User Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="py-[20px] pr-[20px] text-gray-300">
            <IoIosNotifications className="text-2xl" />
          </div>
          <div
            className="flex items-center gap-3 font-sans px-5 py-2 rounded-md text-gray-100 font-bold bg-red-400 cursor-pointer"
            onClick={logoutHandler}
          >
            <span>Logout</span>
            <AiOutlineLogout className="text-xl" />{" "}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 px-[20px]">
        {notifications.map((notification) => (
          <NotificationCard
            notification={notification}
            key={notification._id}
          />
        ))}
      </div>
    </div>
  );
};

export default Notification;
