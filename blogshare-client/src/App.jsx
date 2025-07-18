import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import { getCurrentUser } from "./services/api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (err) {
        setUser(null); // not logged in
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);


  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/pubprofile/:authorId/:blogId"
          element={<PublicProfile />}
        />
      </Routes>
    </>
  );
}

export default App;
