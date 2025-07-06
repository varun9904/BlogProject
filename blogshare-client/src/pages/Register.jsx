import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-zinc-900 text-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-700">

        {/* Left: Blog Block */}
        <div className="hidden md:flex w-1/2 bg-zinc-800 items-center justify-center flex-col p-10 border-r border-zinc-700">
          <blockblog className="text-xl italic text-purple-300 text-center max-w-sm">
          Your insights matter - document them, share them, inspire others.
          </blockblog>
          <p className="mt-4 text-sm text-zinc-400">~ BlogShare</p>
        </div>

        {/* Right: Registration Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-200 text-center mb-6">
            blogshare
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-zinc-700 bg-black text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 transition-colors text-white font-semibold shadow-md hover:shadow-fuchsia-800"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-zinc-500">
            Already have an account?{" "}
            <a href="/login" className="underline text-purple-400 hover:text-purple-300">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );

};

export default Register;
