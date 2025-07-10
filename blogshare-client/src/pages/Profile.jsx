import React, { useEffect, useState } from "react";
import { getBlogs, deleteBlog, deleteComment } from "../services/api";

const checkHateSpeech = async (text) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_AI_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      credentials: "include",
    });
    const data = await res.json();
    const flagged = data.prediction === "Hate Speech";
    const hatePercent = (data.probabilities?.hate || 0) * 100;
    return { flagged, hatePercent };
  } catch (err) {
    console.error("Error in hate speech detection:", err);
    return { flagged: false, hatePercent: 0 };
  }
};

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [myBlogs, setMyBlogs] = useState([]);
  const [search, setSearch] = useState("");


  const fetchMyBlogs = async () => {
    const res = await getBlogs();
    const userId = user?._id;

    const enhancedBlogs = await Promise.all(
      res.data
        .filter((q) => {
          const blogUserId = typeof q.user === "string" ? q.user : q.user?._id;
          return blogUserId === userId;
        })
        .map(async (blog) => {
          const enhancedComments = await Promise.all(
            blog.comments.map(async (c) => {
              const result = await checkHateSpeech(c.text);
              return {
                ...c,
                flagged: result.flagged,
                hatePercent: result.hatePercent,
              };
            })
          );
          return { ...blog, comments: enhancedComments };
        })
    );

    setMyBlogs(enhancedBlogs);
  };

  const handleDelete = async (id) => {
    await deleteBlog(id);
    fetchMyBlogs();
  };

  const handleDeleteComment = async (blogId, commentId) => {
    await deleteComment(blogId, commentId);
    fetchMyBlogs();
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);


  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);




  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-12 md:py-16 transition-all duration-500">

      <div className="max-w-7xl mx-auto relative">
        {/* Decorative BG Shape (Optional but looks cool) */}
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-orange-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <h2 className="text-3xl sm:text-4xl font-bold text-left text-white mb-8 border-l-4 border-orange-400 pl-4 py-2">
          📝{" "}My Blogs
        </h2>
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search by blog title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 bg-zinc-800 text-white border border-purple-600 rounded-[1vw] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-300"
          />
        </div>


        {myBlogs.some((q) => q.flagged) && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mb-6 text-center font-medium">
            ⚠️ {myBlogs.filter((q) => q.flagged).length} of your blog post(s) flagged as{" "}
            <strong>hate speech</strong>.
          </div>
        )}

        {myBlogs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You haven't posted any blog entries yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myBlogs
              .filter((q) =>
                q.title?.toLowerCase().includes(search.toLowerCase())
              ).map((q, index) => {
                const themes = [
                  // "from-gray-800 via-gray-700 to-gray-900",         // Neutral dark
                  "from-purple-900 via-indigo-800 to-gray-900",     // Rich purple/indigo
                  // "from-slate-800 via-slate-700 to-gray-800",       // Subtle slate dark
                ];
                const bg = themes[index % themes.length];
                const isFlagged = q.flagged;
                const isOwner = q.user === user._id || q.user?._id === user._id;

                return (
                  <div
                    key={q._id}
                    className={`bg-gradient-to-br ${bg} p-6 border transition-all duration-300 hover:shadow-lg ${isFlagged
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                      }`}
                  >
                    {/* ✅ Blog Title */}
                    <h3 className="text-2xl md:text-2xl font-extrabold text-center uppercase tracking-wider text-white mb-6 border-b-4 border-orange-400 inline-block pb-2 px-4 shadow-sm mx-auto">
                      🧾 {q.title || "Untitled Blog"}
                    </h3>

                    {/* ✅ Blog Content */}
                    <p className="text-white text-justify whitespace-pre-wrap leading-loose tracking-wide px-1 md:px-2 font-sans text-[17px]">
                      {q.text}
                    </p>



                    {isFlagged && (
                      <p className="mt-3 text-sm text-red-600 font-medium">
                        ⚠️ This blog was flagged as hate speech by AI.
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-gray-600">
                      {/* ❤️ Like Badge */}
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full shadow-inner text-orange-700 font-semibold tracking-wide">
                        💜 {q.likes.length}
                      </div>

                      {/* 🗑️ Delete Button */}
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-400 text-red-600 font-semibold transition-all duration-200 hover:bg-red-600 hover:text-white shadow-md hover:shadow-lg"
                      >
                        <span className="transition-transform duration-200 group-hover:rotate-12">🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>



                    {/* 💬 Comments Section */}
                    {q.comments?.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {/* ⚠️ Flagged Comments */}
                        {q.comments.some((c) => c.flagged) && (
                          <div className="border-l-4 border-red-400 pl-4 bg-red-50/50 rounded-md py-2">
                            <h4 className="text-base font-semibold text-red-800 mb-2 flex items-center gap-1">
                              ⚠️ Flagged Comments
                            </h4>
                            <div className="space-y-2">
                              {q.comments
                                .filter((c) => c.flagged)
                                .map((c) => (
                                  <div
                                    key={c._id}
                                    className="relative bg-red-100 border border-red-300 px-4 py-2 rounded-md shadow-sm text-sm text-red-800"
                                  >
                                    <p className="leading-relaxed mb-1">{c.text}</p>
                                    <div className="flex justify-between text-xs italic text-red-700">
                                      <span>👤 {c.user?.name || "Anonymous"}</span>
                                      <span>
                                        {new Date(c.createdAt).toLocaleString("en-IN", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-xs mt-1 italic text-red-600">
                                      🔥 Hate Level: {c.hatePercent.toFixed(2)}%
                                    </p>
                                    {isOwner && (
                                      <button
                                        onClick={() => handleDeleteComment(q._id, c._id)}
                                        className="absolute top-2 right-3 text-xs font-semibold text-red-500 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* ✅ Normal Comments */}
                        {q.comments.some((c) => !c.flagged) && (
                          <div className="border-l-4 border-purple-300 pl-4 bg-gray-50 rounded-md py-2">
                            <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-1">
                              💬 Comments
                            </h4>
                            <div className="space-y-2">
                              {q.comments
                                .filter((c) => !c.flagged)
                                .map((c) => (
                                  <div
                                    key={c._id}
                                    className="bg-white border border-gray-200 px-4 py-2 rounded-md shadow-sm text-sm text-gray-800"
                                  >
                                    <p className="leading-relaxed mb-1">{c.text}</p>
                                    <div className="flex justify-between text-xs italic text-gray-500">
                                      <span>👤 {c.user?.name || "Anonymous"}</span>
                                      <span>
                                        {new Date(c.createdAt).toLocaleString("en-IN", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}



                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>

  );



}
