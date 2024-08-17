import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );
      console.log(response);
      if (response.status === 201) {
        // Registration successful
        alert("Registration successful. Please log in.");
        // Redirect to the sign-in page
        window.location.href = "/login";
      }
    } catch (error) {
      // Handle errors (e.g., display alert with error message)
      if (error.response && error.response.data) {
        alert(
          error.response.data.message ||
            "An error occurred during registration."
        );
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-[20px]">
        <div></div>
        <div className="mt-[90px]">
          <div className="text-xl font-bold font-sans text-center py-[35px] underline">
            SIGNUP PAGE
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-[15px]">
              <label className="block mb-2 text-sm font-medium font-sans text-gray-900 dark:text-white">
                Name
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
            </div>

            <div className="mb-[15px]">
              <label className="block mb-2 text-sm font-medium font-sans text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className="mb-[15px]">
              <label className="block mb-2 text-sm font-medium font-sans  text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="text-white mt-[15px] w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Register
            </button>
          </form>
          <div>
            have an account?
            <label className="hover:text-blue-500">
              <Link to="/login">Login</Link>
            </label>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Register;
