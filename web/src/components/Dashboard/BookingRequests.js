import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestCard = ({ data, onApprove, onDecline }) => {
  return (
    <div className="bg-gray-100 p-2 rounded">
      <div className="">
        <h2 className="text-xs font-semibold text-blue-400">
          ID : <span>{data._id}</span>
        </h2>
        <p className="mt-2">
          <strong>{data.bookedBy.name}</strong> wants to register for event{" "}
          <strong>{data.eventId.title}</strong>
        </p>
      </div>
      <div className="mt-2 flex gap-2 items-center justify-end">
        <button
          onClick={() => onApprove(data)}
          className="bg-green-500 px-2 py-1 rounded text-white"
        >
          Accept
        </button>
        <button
          onClick={() => onDecline(data)}
          className="bg-red-500 px-2 py-1 rounded text-white"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

const BookingRequests = ({ data }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/events/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id, bookingStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/bookings/${id}`,
          { bookingStatus },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {          
          setBookings((prev) => {
            return prev.filter((booking) => booking._id !== id);
          });

        });
    } catch (err) {
      console.log(err);
    }
  };

  const approveHandler = (booking) => {
    updateBookingStatus(booking._id, "success");
  };

  const onDeclineHandler = (booking) => {
    updateBookingStatus(booking._id, "rejected");
  };


  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center text-gray-500">No data found</div>;
  }

  return (
    <div className="space-y-2">
      {bookings.map((data, index) => (
        <RequestCard
          onApprove={approveHandler}
          onDecline={onDeclineHandler}
          data={data}
          key={index}
        />
      ))}
    </div>
  );
};

export default BookingRequests;
