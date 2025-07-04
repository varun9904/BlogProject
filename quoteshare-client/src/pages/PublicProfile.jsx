import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuotes } from "../services/api";

export default function PublicProfile() {
  const { id } = useParams();
  const [quotes, setQuotes] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchQuotes = async () => {
      const res = await getQuotes();
      const userQuotes = res.data.filter(
        (q) => q.user === id || q.user?._id === id
      );
      if (userQuotes.length > 0) {
        setUserName(userQuotes[0].user?.name || "User");
      }
      setQuotes(userQuotes);
    };

    fetchQuotes();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-8">
        📜 Quotes by {userName}
      </h2>

      {quotes.length === 0 ? (
        <p className="text-center text-gray-500">No quotes by this user.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div
              key={q._id}
              className="p-4 rounded-lg shadow bg-gradient-to-r from-purple-50 to-pink-50 border border-gray-300"
            >
              <p className="italic text-lg text-gray-700">“{q.text}”</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
