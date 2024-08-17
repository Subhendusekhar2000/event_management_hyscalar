import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateEvent from "./components/CreateEvent";
// import BookEvent from "./components/BookEvent";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import Notification from "./components/Notification";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ldata = localStorage.getItem("user");
      if (ldata) {
        setUser(JSON.parse(ldata));
      } else {
        setUser(false);
      }
    };

    fetchData();
  }, []);

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      {/* <Route path="/notification" element={<Notification />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/notification"
        element={<PrivateRoute component={Notification} />}
      />
      {/* <Route
        path="/events/create"
        element={<PrivateRoute component={CreateEvent} />}
      />
      <Route
        path="/events/book/:id"
        element={<PrivateRoute component={BookEvent} />}
      /> */}
    </Routes>
  );
};

export default App;
