import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { checkHateSpeech } from "../utils/hateCheck";
import Swal from "sweetalert2";

import {
  createQuote,
  getQuotes,
  likeQuote,
  deleteQuote,
  addComment,
  deleteComment,
} from "../services/api";


const user = JSON.parse(localStorage.getItem("user"));


export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [quote, setQuote] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [commentText, setCommentText] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});


  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await getQuotes();
      const uniqueUserMap = new Map();

      res.data.forEach((quote) => {
        const userId = quote.user?._id || quote.user;
        if (!uniqueUserMap.has(userId)) {
          uniqueUserMap.set(userId, quote);
        }
      });

      setQuotes(Array.from(uniqueUserMap.values()));
    } catch (err) {
      toast.error("Failed to fetch quotes");
      console.error(err);
    }
  };

  const filteredQuotes = quotes.filter((q) =>
    q.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote) return toast.error("Please write a quote!");

    const result = await checkHateSpeech(quote);
    if (!result) return toast.error("AI check failed. Try again.");

    if (result.prediction === "Hate Speech") {
      toast.error("Quote contains hate speech!");

      await Swal.fire({
        icon: "warning",
        title: "\u26A0\uFE0F Hate Speech Detected!",
        text: "This quote was flagged by our AI model. Do you still want to post it to your profile (marked as flagged)?",
        showCancelButton: true,
        confirmButtonText: "Yes, post anyway",
        cancelButtonText: "No, cancel",
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            await createQuote({ text: quote, flagged: true });
            toast.success("Quote posted (flagged)");
            setQuote("");
            fetchQuotes();
          } catch (err) {
            toast.error("Failed to post quote.");
            console.error(err);
          }
        }
      });

      return;
    }

    try {
      await createQuote({ text: quote });
      setQuote("");
      fetchQuotes();
      toast.success("Quote posted successfully!");
    } catch (err) {
      toast.error("Failed to post quote.");
      console.error(err);
    }
  };

  const handleLike = async (id) => {
    try {
      await likeQuote(id);
      fetchQuotes();
    } catch (err) {
      toast.error("Could not like the quote. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuote(id);
      fetchQuotes();
      toast.success("Quote deleted 🗑️");
    } catch (err) {
      toast.error("Failed to delete quote.");
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e, quoteId) => {
    e.preventDefault();
    const text = commentText[quoteId];
    if (!text) return;

    const result = await checkHateSpeech(text);
    const flagged = result?.prediction === "Hate Speech";
    console.log("Sending comment:", { text, flagged });


    try {
      await addComment(quoteId, { text, flagged });
      toast.success("Comment added!");
      setCommentText({ ...commentText, [quoteId]: "" });
      fetchQuotes();
    } catch (err) {
      console.error("Comment API error:", err.response?.data || err.message);
      toast.error("Failed to add comment");
    }
  };



  const toggleCommentInput = (quoteId) => {
    setShowCommentInput((prev) => ({
      ...prev,
      [quoteId]: !prev[quoteId],
    }));
  };
  

  const handleDeleteComment = async (quoteId, commentId) => {
    try {
      await deleteComment(quoteId, commentId);
      toast.success("Comment deleted!");
      fetchQuotes();
    } catch (err) {
      toast.error("Error deleting comment");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-10 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-purple-800">
            🌸 Welcome, {user?.name}
          </h1>
          <button
            onClick={logout}
            className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full shadow-md transition-all hover:scale-105 text-sm"
          >
            🚪 Logout
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white shadow-lg border border-gray-300 rounded-3xl p-6 hover:shadow-xl transition"
        >
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Share a beautiful thought with the world..."
            rows={4}
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-800 placeholder-gray-500 resize-none mb-4"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full shadow hover:scale-105 transition-transform font-semibold text-sm"
          >
            ✨ Post Quote
          </button>
        </form>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder=" Filter by author name"
            className="w-full px-5 py-3 pl-12 bg-white/60 backdrop-blur-md border border-purple-200 rounded-full shadow-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-lg">🔍</span>
        </div>

        {filteredQuotes.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No quotes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredQuotes.map((q, index) => {
              const themes = [
                "from-pink-100 via-pink-50 to-white",
                "from-purple-100 via-violet-50 to-white",
                "from-yellow-100 via-amber-50 to-white",
                "from-sky-100 via-cyan-50 to-white",
              ];
              const bgClass = themes[index % themes.length];

              return (
                <div
                  key={q._id}
                  className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${bgClass} border border-gray-200`}
                >
                  <div className="relative pl-4 text-gray-700 font-medium italic text-lg leading-relaxed">
                    <span className="text-4xl font-serif text-purple-400 absolute -left-4 top-0">“</span>
                    {q.text}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-right text-gray-500 italic">
                      — {q.user?.name}
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLike(q._id)}
                        className="px-3 py-1 text-pink-600 border border-pink-300 rounded-full hover:bg-pink-100 hover:scale-105 transition flex items-center gap-1 text-sm"
                      >
                        ❤️ {q.likes.length}
                      </button>

                      {(q.user === user._id || q.user?._id === user._id) && (
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="px-3 py-1 border border-red-400 text-red-500 rounded-full hover:bg-red-100 hover:scale-105 transition text-sm"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

{/* Comments */}
<div className="mt-4 space-y-2">
  {q.comments?.map((c) => (
    <div key={c._id} className="ml-2 bg-white px-3 py-2 rounded shadow text-sm">
      <p className="text-gray-800">💬 {c.text}</p>
      {c.flagged && (
        <p className="text-xs text-red-600">⚠️ Flagged as hate</p>
      )}
      {(q.user === user._id || q.user?._id === user._id) && c.flagged && (
        <button
          onClick={() => handleDeleteComment(q._id, c._id)}
          className="text-xs text-red-500 underline mt-1"
        >
          Delete Comment
        </button>
      )}
    </div>
  ))}

  {/* 🔘 Toggle Comment Input Button */}
  <button
    onClick={() => toggleCommentInput(q._id)}
    className="text-purple-600 text-sm underline mt-3"
  >
    💬 {showCommentInput[q._id] ? "Cancel" : "Comment"}
  </button>

  {/* 📝 Comment Input Field */}
  {showCommentInput[q._id] && (
    <form
      onSubmit={(e) => handleCommentSubmit(e, q._id)}
      className="flex gap-2 mt-2"
    >
      <input
        type="text"
        value={commentText[q._id] || ""}
        onChange={(e) =>
          setCommentText({ ...commentText, [q._id]: e.target.value })
        }
        placeholder="Write your comment..."
        className="flex-1 px-3 py-1 border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 rounded hover:bg-purple-600 transition text-sm"
      >
        Post
      </button>
    </form>
  )}
</div>



                </div>
              );
            })}
          </div>
        )}

        <Link
          to="/profile"
          className="block text-center mt-10 text-purple-700 underline hover:text-purple-900 font-medium"
        >
          🧾 View Your Profile →
        </Link>
      </div>
    </div>
  );
}
