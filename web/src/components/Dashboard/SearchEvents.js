// src/components/SearchEvents.js
import React from "react";
import EventCard from "./EventCard";

const SearchEvents = ({ onBookEvent, events, searchTerm, onChange, loading }) => {

  // if (loading) return <div className="text-center">Loading...</div>;
  return (
    <div className="w-full overflow-y-auto">
      <div className="flex justify-center">
        <h2 className="text-lg font-bold text-blue-500 py-5">
          Upcomming Events
        </h2>
      </div>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search for upcomming events..."
          value={searchTerm}
          onChange={onChange}
          className="w-full p-2 border rounded-full px-5 mb-4 max-w-xl "
        />
      </div>

      <div className="">
        <div className="">
          {events.length === 0 ? (
            <p className="text-center mt-10 text-gray-600">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {events.map((event, index) => (
                <EventCard key={index} data={event} onClick={onBookEvent  } />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchEvents;
