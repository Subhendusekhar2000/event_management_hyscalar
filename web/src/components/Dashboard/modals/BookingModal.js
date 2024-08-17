// src/components/BookingModal.js
import React, { useState } from "react";
import axios from "axios";

const BookingModal = ({ event, onSuccess , onCancel}) => {
  const [loading, setLoading] = useState(false);

  const handleBookEvent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/events/book`,
          { eventId: event._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(alert(err.message));
        })
        .finally(() => {
          setLoading(false);
          onSuccess();
        });
    } catch (error) {
      alert(error.message);
      console.error("Failed to book event", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Book Event</h2>
        <p className="mb-4">{event.title}</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleBookEvent}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
