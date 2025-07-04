import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import toast from "react-hot-toast"; // <-- import toast

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1f1] via-[#f8f3ff] to-[#e7eaf6] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-300">
        {/* Left side: Quote */}
        <div className="hidden md:flex w-1/2 bg-[#f4f4f5] items-center justify-center flex-col p-10">
          <blockquote className="text-xl italic text-gray-600 text-center max-w-sm">
            “Create your identity. Share your voice.”
          </blockquote>
          <p className="mt-4 text-sm text-gray-500">~ QuoteShare</p>
        </div>

        {/* Right side: Registration */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Join QuoteShare
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Share your quotes with the world. Start now!
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-800 placeholder-gray-500"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-800 placeholder-gray-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-800 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-xs text-center text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="underline hover:text-gray-800">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
