import React from "react";

const EventCard = ({
  data,
  onClick,
  isAdminCard = false,
  onEdit,
  onShowJoinees,
}) => {
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
        <p>Date: {new Date(data.date).toLocaleDateString()}</p>
        <p>Location: {data.location}</p>

        {isAdminCard ? (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEdit(data)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Manage
            </button>
            <button
              onClick={() => onShowJoinees(data)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Show Joinees ({data.joinees?.length || 0})
            </button>
          </div>
        ) : data.isBooked ? (
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">
            {data.bookingStatus}
          </button>
        ) : (
          <button
            onClick={() => onClick(data)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Book Event
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
