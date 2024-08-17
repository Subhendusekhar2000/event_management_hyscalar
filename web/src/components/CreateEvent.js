import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    ticketPrice: "",
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/events/create", event, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      alert("Event created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={event.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        name="description"
        value={event.description}
        onChange={handleChange}
        placeholder="Description"
      ></textarea>
      <input
        type="date"
        name="date"
        value={event.date}
        onChange={handleChange}
      />
      <input
        type="time"
        name="time"
        value={event.time}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        value={event.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <input
        type="number"
        name="ticketPrice"
        value={event.ticketPrice}
        onChange={handleChange}
        placeholder="Ticket Price"
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;
