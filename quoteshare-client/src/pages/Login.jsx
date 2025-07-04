import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // <-- import toast

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1f1] via-[#f8f3ff] to-[#e7eaf6] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-300">
        {/* Left side: Quote */}
        <div className="hidden md:flex w-1/2 bg-[#f4f4f5] items-center justify-center flex-col p-10">
          <blockquote className="text-xl italic text-gray-600 text-center max-w-sm">
            “Sharing a quote is sharing a moment of thought.”
          </blockquote>
          <p className="mt-4 text-sm text-gray-500">~ QuoteShare</p>
        </div>

        {/* Right side: Login */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Words that Inspire. Thoughts that Echo.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-800 placeholder-gray-500"
            />
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-800 placeholder-gray-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold"
            >
              Login
            </button>
          </form>

          {/* Removed the old message display */}

          <p className="mt-6 text-xs text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline hover:text-gray-800">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
