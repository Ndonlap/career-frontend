import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // assuming you use react-router

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info from localStorage or call API to get user details
    const token = localStorage.getItem("tonti_token");
    // console.log(token)
    if (!token) {
      navigate("/login");
      return;
    }

    // Option 1: Get user info stored locally (e.g. in localStorage)
    // If you store user info in localStorage as JSON string, parse it here
    const storedUser = localStorage.getItem("tonti_user") || null;
    if (storedUser !== null && storedUser !== undefined && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      // Option 2: Fetch user info from backend using token
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/getUserDetail", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("tonti_user", JSON.stringify(data)); // cache it locally
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error(error);
    //   logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("tonti_token");
    localStorage.removeItem("tonti_user");
    navigate("/login");
  };

  return (
    <header className="h-[60px] bg-white shadow px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          Welcome back, <span className="font-medium">{user ? user.name : "Loading..."}</span>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800 font-semibold"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
