// src/components/BookedEvents.js
import React from "react";

const EventCard = ({ data }) => {
  console.log(data);
  return (
    <div>
      <div
        key={data._id}
        className="bg-white p-4 shadow rounded bg-gradient-to-br from-blue-100 via-gray-200 to-blue-200"
      >
        <h2>
          Id : <strong>{data._id}</strong>
        </h2>
        <h2 className="text-xl font-semibold">{data.title}</h2>
        <p>{data.description}</p>
        <p>Date: {new Date(data.eventId.date).toLocaleDateString()}</p>
        <p>Location: {data.eventId.location}</p>

        {data.bookingStatus === "pending" && (
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
          >
            {data.bookingStatus}
          </button>
        )}
        {data.bookingStatus === "success" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            {data.bookingStatus}
          </button>
        )}
        {data.bookingStatus === "rejected" && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            {data.bookingStatus}
          </button>
        )}
      </div>
    </div>
  );
};

const BookedEvents = ({ loading, bookings }) => {
  if (loading) return <div className="text-center">Loading...</div>;

  return (

      <div className="p-5">
        {bookings.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">
              You have not booked any events. Click to book one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking, index) => (
              <EventCard key={index} data={booking} />
            ))}
          </div>
        )}
      </div>
  );
};

export default BookedEvents;
