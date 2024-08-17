import React, { useState, useEffect } from "react";
import BookedEvents from "./BookedEvents";
import SearchEvents from "./SearchEvents";
import BookingModal from "./modals/BookingModal";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // search
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchloading, setSearchLoading] = useState(true);

  const handleBookEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const onClose = () => {
    handleCloseModal();
    fetchBookings();
    setSearchTerm("");
    setEvents([]);
  };

  const onCancel = () => {
    handleCloseModal();
  };
  // logout handler
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // search section -----------------------

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/events/search`,
        {
          params: { search: searchTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setSearchLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, [searchTerm]);

  // booking------------------------------------------------------
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/events/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setBookingLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-blue-200 via-gray-300 to-bg-blue-300">
      <div className="flex justify-between items-center w-full bg-blue-600 px-10 h-[80px]">
        <div className="h-full flex items-center">
          <span className="text-2xl font-bold font-sans mb-6 text-white">
            User Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/notification">
            <div className="py-[20px] pr-[20px] text-gray-300">
              <IoIosNotifications className="text-2xl" />
            </div>
          </Link>
          <div
            className="flex items-center gap-3 font-sans px-5 py-2 rounded-md text-gray-100 font-bold bg-red-400"
            onClick={logoutHandler}
          >
            <span>Logout</span>
            <AiOutlineLogout className="text-xl" />{" "}
          </div>
          <div className=" py-[20px] text-gray-300  "></div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-80px)] ">
        <div className="w-full h-full">
          <div className="flex gap-2 h-full">
            {/* left content */}
            <div className="w-1/3 p-2 full">
              <div className="h-full bg-gray-600 bg-opacity-20 p-2 rounded-xl">
                <div className="flex justify-center mt-5">
                  <h2 className="text-lg font-bold mb-5 text-white">
                    Booked Events
                  </h2>
                </div>
                {bookings.length > 0 && (
                  <BookedEvents loading={bookingLoading} bookings={bookings} />
                )}

                {bookings.length === 0 &&
                  !bookingLoading && (
                    <div className="text-center">
                      <p className="text-gray-600">No booking found</p>
                    </div>
                  )}
              </div>
            </div>

            {/* right content */}
            <div className="w-2/3">
              <SearchEvents
                events={events}
                loading={searchloading}
                onBookEvent={handleBookEvent}
                onChange={(e) => setSearchTerm(e.target.value)}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {selectedEvent && (
            <BookingModal
              event={selectedEvent}
              onSuccess={onClose}
              onCancel={onCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
