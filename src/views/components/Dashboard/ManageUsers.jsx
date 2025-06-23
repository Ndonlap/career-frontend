import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "User",
  });

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("tonti_token");
      const response = await axios.get(
        "http://localhost:5000/api/user/getAllUsers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.users);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const confirmAction = async (message, onConfirm) => {
    const result = await Swal.fire({
      title: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    });
    if (result.isConfirmed) {
      await onConfirm();
    }
  };

  const toggleUserStatus = async (id) => {
    confirmAction("Are you sure to toggle this user's status?", async () => {
      try {
        const token = localStorage.getItem("tonti_token");
        const res = await axios.put(
          `http://localhost:5000/api/user/${id}/toggle-status`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Done", res.data.message, "success");
        getAllUsers();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Action failed", "error");
      }
    });
  };

  const toggleUserRole = async (id) => {
    confirmAction("Are you sure to change this user's role?", async () => {
      try {
        const token = localStorage.getItem("tonti_token");
        const res = await axios.put(
          `http://localhost:5000/api/user/${id}/toggle-role`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Done", res.data.message, "success");
        getAllUsers();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Action failed", "error");
      }
    });
  };

  // NEW: Reset Password function
  const resetUserPassword = async (id, email) => {
    confirmAction(`Send password reset email to ${email}?`, async () => {
      try {
        const token = localStorage.getItem("tonti_token");
        const res = await axios.post(
          `http://localhost:5000/api/user/reset-password`,
          { email }, // or { id } depending on your backend
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire(
          "Success",
          res.data.message || "Password reset email sent.",
          "success"
        );
        getAllUsers();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to send password reset email.", "error");
      }
    });
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("tonti_token");
      const res = await axios.post(
        "http://localhost:5000/api/user/register",
        newUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Success", res.data.message || "User registered", "success");
      setShowRegisterModal(false);
      setNewUser({ name: "", email: "", password: "", accountType: "User" });
      getAllUsers();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Registration failed", "error");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Users</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowRegisterModal(true)}
        >
          Register New User/Admin
        </button>
      </div>
      <table className="min-w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Balance</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.phone}</td>
              <td className="px-4 py-2 border">{user.balance}</td>
              <td className="px-4 py-2 border space-x-2 flex justify-center items-center">
                <button
                  title={user.isActive ? "Deactivate User" : "Activate User"}
                  className={`px-2 py-1 rounded text-white flex items-center justify-center ${
                    user.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={() => toggleUserStatus(user._id)}
                >
                  {/* Power icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M12 2a10 10 0 1 1-0 20 10 10 0 0 1 0-20z"
                    />
                  </svg>
                </button>

                <button
                  title={
                    user.accountType === "Admin"
                      ? "Demote to User"
                      : "Promote to Admin"
                  }
                  className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white rounded flex items-center justify-center"
                  onClick={() => toggleUserRole(user._id)}
                >
                  {/* User icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A12.083 12.083 0 0112 15c2.485 0 4.843.73 6.879 1.98M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>

                <button
                  title="Reset Password"
                  className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-white rounded flex items-center justify-center"
                  onClick={() => resetUserPassword(user._id, user.email)}
                >
                  {/* Key icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v.01M19.07 4.93a10 10 0 11-14.14 14.14 10 10 0 0114.14-14.14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Register New User</h3>
            <input
              type="text"
              placeholder="Name"
              className="border w-full p-2 mb-2"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border w-full p-2 mb-2"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="border w-full p-2 mb-2"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <select
              className="border w-full p-2 mb-4"
              value={newUser.accountType}
              onChange={(e) =>
                setNewUser({ ...newUser, accountType: e.target.value })
              }
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>

            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleRegister}
              >
                Register
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
