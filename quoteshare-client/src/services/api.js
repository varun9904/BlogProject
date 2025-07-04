import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Your Express backend port
  // headers: {
  //   withCredentials: true, // ✅ very important!
  // },
  withCredentials: true,
});
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = async (data) =>
  await axios.post("http://localhost:5000/api/auth/login", data, {
    withCredentials: true, // ✅ Needed to accept cookie
  });
export const createQuote = (data) => API.post("/quotes", data);
export const getQuotes = () => API.get("/quotes");
export const likeQuote = (id) => API.patch(`/quotes/${id}/like`);
export const deleteQuote = (id) => API.delete(`/quotes/${id}`);
export const addComment = (quoteId, commentData) => {
  return API.post(`/quotes/${quoteId}/comments`, commentData);
};
export const deleteComment = (quoteId, commentId) => API.delete(`/quotes/${quoteId}/comments/${commentId}`);

