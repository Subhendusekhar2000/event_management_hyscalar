import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLoginSuccess = async(token) => {
    const { credential } = token;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        { googleLogin : credential }
      );
      const { token, data } = res.data;

      // Store token and user details in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect or update UI based on successful login
      window.location.href = "/"; // Redirect to a dashboard or another page
    } catch (err) {
      setError("Invalid email or password");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        { email, password }
      );
      const { token, data } = res.data;

      // Store token and user details in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect or update UI based on successful login
      window.location.href = "/"; // Redirect to a dashboard or another page
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-[20px]">
        <div></div>
        <div className="mt-[160px]">
          <div className="text-xl font-bold font-sans text-center py-[35px] underline">
            LOGIN PAGE
          </div>
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit}>
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
              />
            </div>
            <div className="mb-[15px]">
              <label className="block mb-2 text-sm font-medium font-sans text-gray-900 dark:text-white">
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="text-white mt-[15px] w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Login
            </button>
          </form>
          <div className="flex justify-center">
            <GoogleLogin
              theme="filled_black"
              text="continue_with"
              shape="pill"
              cancel_on_tap_outside
              className="flex items-center justify-center"
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap
              auto_select
            />
          </div>
          <div>
            Don't have an account?
            <label className="hover:text-blue-500">
              <Link to="/register">Signup</Link>
            </label>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Login;
