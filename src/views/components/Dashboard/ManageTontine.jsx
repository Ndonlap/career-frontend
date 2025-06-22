import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageTontines = () => {
  const [tontines, setTontines] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [membersModal, setMembersModal] = useState({ isOpen: false, members: [], tontineName: "" });
  const [newTontine, setNewTontine] = useState({
    name: "",
    description: "",
    contributionAmount: "",
    paymentSchedule: "",
  });

  const getAllTontines = async () => {
    try {
      const token = localStorage.getItem("tonti_token");
      const response = await axios.get("http://localhost:5000/api/tontine/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTontines(response.data.tontines);
    } catch (err) {
      console.error("Failed to load tontines", err);
      Swal.fire("Error", "Failed to load tontines", "error");
    }
  };

  useEffect(() => {
    getAllTontines();
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

  const toggleTontineStatus = async (id) => {
    confirmAction("Are you sure to toggle this tontine's status?", async () => {
      try {
        const token = localStorage.getItem("tonti_token");
        const res = await axios.put(
          `http://localhost:5000/api/tontine/${id}/toggle-status`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Done", res.data.message, "success");
        getAllTontines();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Action failed", "error");
      }
    });
  };

  const viewMembers = async (id, name) => {
    try {
      const token = localStorage.getItem("tonti_token");
      const res = await axios.get(`http://localhost:5000/api/tontine/${id}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembersModal({ isOpen: true, members: res.data.members, tontineName: name });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load members", "error");
    }
  };

  const handleCreateTontine = async () => {
    try {
      const token = localStorage.getItem("tonti_token");
      const res = await axios.post(
        "http://localhost:5000/api/tontine/createTontine",
        newTontine,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", res.data.message || "Tontine created", "success");
      setShowCreateModal(false);
      setNewTontine({ name: "", description: "", contributionAmount: "", paymentSchedule: "" });
      getAllTontines();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Creation failed", "error");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Tontines</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Tontine
        </button>
      </div>

      <table className="min-w-full table-auto border border-collapse border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Contribution</th>
            <th className="px-4 py-2 border">Schedule</th>
            <th className="px-4 py-2 border">Balance</th>
            <th className="px-4 py-2 border">Payout Index</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tontines?.map((tontine) => (
            <tr key={tontine._id} className="text-center">
              <td className="px-4 py-2 border">{tontine.name}</td>
              <td className="px-4 py-2 border">{tontine.description}</td>
              <td className="px-4 py-2 border">{tontine.contributionAmount}</td>
              <td className="px-4 py-2 border">{tontine.paymentSchedule}</td>
              <td className="px-4 py-2 border">{tontine.balance}</td>
              <td className="px-4 py-2 border">{tontine.payoutIndex}</td>
              <td className="px-4 py-2 border space-x-2 flex justify-center items-center">
                <button
                  title={tontine.isActive ? "Deactivate Tontine" : "Activate Tontine"}
                  className={`px-2 py-1 rounded text-white flex items-center justify-center ${
                    tontine.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={() => toggleTontineStatus(tontine._id)}
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
                  title="View Members"
                  className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white rounded flex items-center justify-center"
                  onClick={() => viewMembers(tontine._id, tontine.name)}
                >
                  {/* Users icon */}
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
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-5a4 4 0 11-8 0 4 4 0 018 0zM7 8a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Tontine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Create New Tontine</h3>
            <input
              type="text"
              placeholder="Name"
              className="border w-full p-2 mb-2"
              value={newTontine.name}
              onChange={(e) => setNewTontine({ ...newTontine, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="border w-full p-2 mb-2"
              rows={3}
              value={newTontine.description}
              onChange={(e) => setNewTontine({ ...newTontine, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Contribution Amount"
              className="border w-full p-2 mb-2"
              value={newTontine.contributionAmount}
              onChange={(e) => setNewTontine({ ...newTontine, contributionAmount: e.target.value })}
            />
            <input
              type="text"
              placeholder="Payment Schedule"
              className="border w-full p-2 mb-4"
              value={newTontine.paymentSchedule}
              onChange={(e) => setNewTontine({ ...newTontine, paymentSchedule: e.target.value })}
            />

            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleCreateTontine}
              >
                Create
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {membersModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Members of {membersModal.tontineName}</h3>
            <ul className="list-disc list-inside max-h-64 overflow-y-auto">
              {membersModal.members.length === 0 ? (
                <p>No members found.</p>
              ) : (
                membersModal.members.map((member) => (
                  <li key={member?._id?._id} className="mb-1">
                    {member?._id?.name} ({member?._id?.email || "No email"})
                  </li>
                ))
              )}
            </ul>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded mt-4 block mx-auto"
              onClick={() => setMembersModal({ isOpen: false, members: [], tontineName: "" })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTontines;
