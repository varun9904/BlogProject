import React, { useEffect, useState } from "react";
import { getQuotes, deleteQuote } from "../services/api";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [myQuotes, setMyQuotes] = useState([]);

  // Fetch and filter user's own quotes
  const fetchMyQuotes = async () => {
    const res = await getQuotes();
    const userId = JSON.parse(localStorage.getItem("user"))?._id;

    const filtered = res.data.filter(
      (q) => q.user === userId || q.user?._id === userId
    );

    setMyQuotes(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuote(id); // Axios interceptor adds token
      fetchMyQuotes();       // Refresh after delete
    } catch (err) {
      console.error("Error deleting quote:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMyQuotes();
  }, []);

  // return (
  //   <div className="p-6 max-w-2xl mx-auto">
  //     <h2 className="text-xl font-bold mb-4">Your Quotes</h2>
  //     {myQuotes.length === 0 ? (
  //       <p>You haven't posted any quotes yet.</p>
  //     ) : (
  //       myQuotes.map((q) => (
  //         <div key={q._id} className="border p-4 mb-3 rounded shadow">
  //           <p className="text-lg">{q.text}</p>
  //           <p className="text-sm text-gray-500">❤️ {q.likes.length} Likes</p>
        
  //           {q.user === user._id || q.user?._id === user._id ? (
  //             <button
  //               onClick={() => handleDelete(q._id)}
  //               className="mt-2 px-2 py-1 text-red-600 border border-red-600 rounded text-sm"
  //             >
  //               Delete
  //             </button>
  //           ) : null}
  //         </div>
  //       ))
  //     )}
  //   </div>
  // );

  
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-10 transition-all duration-300">
  //     <div className="max-w-3xl mx-auto">
  //       <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">
  //         🌟 {user?.name}'s Quotes
  //       </h2>

  //       {myQuotes.length === 0 ? (
  //         <p className="text-center text-gray-600 text-lg">
  //           You haven't posted any quotes yet.
  //         </p>
  //       ) : (
  //         <div className="space-y-6">
  //           {myQuotes.map((q, index) => {
  //             const themes = [
  //               "from-rose-100 via-pink-50 to-white",
  //               "from-violet-100 via-indigo-50 to-white",
  //               "from-amber-100 via-yellow-50 to-white",
  //             ];
  //             const bg = themes[index % themes.length];

  //             return (
  //               <div
  //                 key={q._id}
  //                 className={`rounded-xl p-6 border border-gray-300 shadow-md bg-gradient-to-br ${bg} transform hover:scale-[1.02] hover:shadow-lg transition-all`}
  //               >
  //                 <p className="relative text-gray-800 italic text-lg leading-relaxed pl-6">
  //                   <span className="text-4xl text-purple-400 absolute left-0 -top-2 font-serif">“</span>
  //                   {q.text}
  //                 </p>

  //                 <div className="mt-4 flex items-center justify-between">
  //                   <span className="text-sm text-gray-500">
  //                     ❤️ {q.likes.length} {q.likes.length === 1 ? "like" : "likes"}
  //                   </span>

  //                   <button
  //                     onClick={() => handleDelete(q._id)}
  //                     className="px-4 py-1 text-sm text-red-600 border border-red-400 rounded-full hover:bg-red-100 hover:scale-105 transition-all"
  //                   >
  //                     🗑️ Delete
  //                   </button>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-10 transition-all duration-300">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">
          🌟 {user?.name}'s Quotes
        </h2>
  
        {/* Summary if flagged quotes exist */}
        {myQuotes.some(q => q.flagged) && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6 text-center font-medium">
            ⚠️ You have {myQuotes.filter(q => q.flagged).length} quote(s) flagged as <strong>hate speech</strong>. Kindly review and avoid posting harmful content.
          </div>
        )}
  
        {myQuotes.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You haven't posted any quotes yet.
          </p>
        ) : (
          <div className="space-y-6">
            {myQuotes.map((q, index) => {
              const themes = [
                "from-rose-100 via-pink-50 to-white",
                "from-violet-100 via-indigo-50 to-white",
                "from-amber-100 via-yellow-50 to-white",
              ];
              const bg = themes[index % themes.length];
              const isFlagged = q.flagged;
  
              return (
                <div
                  key={q._id}
                  className={`rounded-xl p-6 border shadow-md transform hover:scale-[1.02] transition-all
                    bg-gradient-to-br ${bg}
                    ${isFlagged ? "border-red-400 bg-red-50 shadow-red-200" : "border-gray-300 shadow-gray-200"}
                  `}
                >
                  <p className="relative text-gray-800 italic text-lg leading-relaxed pl-6">
                    <span className="text-4xl text-purple-400 absolute left-0 -top-2 font-serif">“</span>
                    {q.text}
                  </p>
  
                  {isFlagged && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      ⚠️ This quote was flagged as hate speech by AI.
                    </p>
                  )}
  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      ❤️ {q.likes.length} {q.likes.length === 1 ? "like" : "likes"}
                    </span>
  
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="px-4 py-1 text-sm text-red-600 border border-red-400 rounded-full hover:bg-red-100 hover:scale-105 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
  



}
