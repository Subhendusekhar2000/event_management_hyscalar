import React, { useState, useEffect } from "react";
import axios from "axios";
import EventModal from "./modals/EventModal";
import JoineeModal from "./modals/JoineeModal";
import { AiOutlineLogout } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import EventCard from "./EventCard";
import BookingRequests from "./BookingRequests";
// import JoineeModal from "./JoineeModal"; // Create this component for displaying joinees

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showJoineesModal, setShowJoineesModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [joinees, setJoinees] = useState([]); // State to store joinees
  const eventsPerPage = 5;

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/events`,
        {
          params: { page: currentPage, limit: eventsPerPage },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response.data.events);
      setTotalEvents(response.data.totalEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      if (selectedEvent) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/events/${selectedEvent._id}`,
          eventData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/events`,
          eventData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setShowModal(false);
      setSelectedEvent(null);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to save event", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalEvents / eventsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const handleShowJoinees = async (event) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/events/${event._id}/joinees`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJoinees(response.data.joinees);
      setShowJoineesModal(true);
    } catch (error) {
      console.error("Failed to fetch joinees", error);
    }
  };

  const adminLogoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) return <div className="text-center">Loading...</div>;

  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  return (
    <div>
      <div className=" bg-blue-600 justify-end h-[70px]">
        <div className="flex items-center justify-between h-full px-10">
          <div className="">
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
            <h2 className="text-gray-100 text-sm">
              {JSON.parse(localStorage.getItem("user")).name}
            </h2>
          </div>
          <div className="flex items-center gap-4 ">
            {/* <div className="text-gray-300">
              <IoIosNotifications className="text-2xl" />
            </div> */}
            <div
              className="flex items-center gap-3 font-sans px-5 py-2 rounded-md text-gray-100 font-bold bg-red-400 "
              onClick={adminLogoutHandler}
            >
              <span>Logout</span>
              <AiOutlineLogout className="text-xl" />{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-[calc(100vh-70px)] overflow-auto no-scrollbar">
        <div className="h-full flex">
          <div className="w-1/4 border-r ">
            <div className="border-gray-200 p-5 h-[80px]">
              <div className="flex justify-between items-center  ">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Approve Requests</h1>
                </div>
              </div>
            </div>
            {/* /approve lst */}
            <div className="p-5">
              <BookingRequests />
            </div>
          </div>
          <div className="w-3/4 h-full">
            <div className="border-gray-200 border-b p-5 h-[80px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Manage Events</h1>
                </div>
                <button
                  onClick={handleCreateEvent}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create Event
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="">
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {events.map((event, index) => (
                    <EventCard
                      data={event}
                      key={index}
                      onEdit={handleEditEvent}
                      isAdminCard={true}
                      onShowJoinees={handleShowJoinees}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 px-4 py-2 rounded-l disabled:cursor-no-drop"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-300 px-4 py-2 rounded-r disabled:cursor-no-drop"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <EventModal
          event={selectedEvent}
          onSave={handleSaveEvent}
          onClose={() => setShowModal(false)}
        />
      )}
      {showJoineesModal && (
        <JoineeModal
          joinees={joinees}
          onClose={() => setShowJoineesModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
