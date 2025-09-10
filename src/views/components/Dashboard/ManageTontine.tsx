// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FaUsers, FaPowerOff, FaPlus } from "react-icons/fa";

// interface Tontine {
//   _id: string;
//   name: string;
//   description: string;
//   contributionAmount: number;
//   paymentSchedule: string;
//   balance?: number;
//   payoutIndex?: number;
//   isActive: boolean;
// }

// interface Member {
//   _id: string;
//   name: string;
//   email?: string;
// }

// const ManageTontines: React.FC = () => {
//   const [tontines, setTontines] = useState<Tontine[]>([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [membersModal, setMembersModal] = useState<{
//     isOpen: boolean;
//     members: Member[];
//     tontineName: string;
//   }>({ isOpen: false, members: [], tontineName: "" });

//   const [newTontine, setNewTontine] = useState({
//     name: "",
//     description: "",
//     contributionAmount: "",
//     paymentSchedule: "",
//   });

//   const token = localStorage.getItem("tonti_token");

//   const getAllTontines = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/tontine/getAll", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTontines(response.data.tontines || []);
//     } catch (err) {
//       console.error("Failed to load tontines", err);
//       Swal.fire("Error", "Failed to load tontines", "error");
//     }
//   };

//   useEffect(() => {
//     getAllTontines();
//   }, []);

//   const confirmAction = async (message: string, onConfirm: () => Promise<void>) => {
//     const result = await Swal.fire({
//       title: message,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, proceed!",
//     });
//     if (result.isConfirmed) {
//       await onConfirm();
//     }
//   };

//   const toggleTontineStatus = async (id: string) => {
//     confirmAction("Are you sure to toggle this tontine's status?", async () => {
//       try {
//         const res = await axios.put(
//           `http://localhost:5000/api/tontine/${id}/toggle-status`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         Swal.fire("Done", res.data.message, "success");
//         getAllTontines();
//       } catch (err) {
//         console.error(err);
//         Swal.fire("Error", "Action failed", "error");
//       }
//     });
//   };

//   const viewMembers = async (id: string, name: string) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/tontine/${id}/members`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMembersModal({ isOpen: true, members: res.data.members || [], tontineName: name });
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to load members", "error");
//     }
//   };

//   const handleCreateTontine = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/tontine/createTontine",
//         newTontine,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       Swal.fire("Success", res.data.message || "Tontine created", "success");
//       setShowCreateModal(false);
//       setNewTontine({ name: "", description: "", contributionAmount: "", paymentSchedule: "" });
//       getAllTontines();
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Creation failed", "error");
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">All Tontines</h2>
//         <button
//           className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
//           onClick={() => setShowCreateModal(true)}
//         >
//           <FaPlus /> Create New Tontine
//         </button>
//       </div>

//       {/* Tontines Table */}
//       <table className="min-w-full table-auto border border-collapse border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="px-4 py-2 border">Name</th>
//             <th className="px-4 py-2 border">Description</th>
//             <th className="px-4 py-2 border">Contribution</th>
//             <th className="px-4 py-2 border">Schedule</th>
//             <th className="px-4 py-2 border">Balance</th>
//             <th className="px-4 py-2 border">Payout Index</th>
//             <th className="px-4 py-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tontines.length === 0 ? (
//             <tr>
//               <td colSpan={7} className="text-center py-4">
//                 No tontines found.
//               </td>
//             </tr>
//           ) : (
//             tontines.map((tontine) => (
//               <tr key={tontine._id} className="text-center">
//                 <td className="px-4 py-2 border">{tontine.name}</td>
//                 <td className="px-4 py-2 border">{tontine.description}</td>
//                 <td className="px-4 py-2 border">{tontine.contributionAmount}</td>
//                 <td className="px-4 py-2 border">{tontine.paymentSchedule}</td>
//                 <td className="px-4 py-2 border">{tontine.balance ?? "-"}</td>
//                 <td className="px-4 py-2 border">{tontine.payoutIndex ?? "-"}</td>
//                 <td className="px-4 py-2 border flex gap-2 justify-center items-center">
//                   {/* Toggle button */}
//                   <button
//                     title={tontine.isActive ? "Deactivate Tontine" : "Activate Tontine"}
//                     className={`p-2 rounded text-white flex items-center justify-center ${
//                       tontine.isActive
//                         ? "bg-red-500 hover:bg-red-600"
//                         : "bg-green-500 hover:bg-green-600"
//                     }`}
//                     onClick={() => toggleTontineStatus(tontine._id)}
//                   >
//                     <FaPowerOff />
//                   </button>

//                   {/* View Members */}
//                   <button
//                     title="View Members"
//                     className="bg-blue-500 hover:bg-blue-600 p-2 text-white rounded flex items-center justify-center"
//                     onClick={() => viewMembers(tontine._id, tontine.name)}
//                   >
//                     <FaUsers />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Create Tontine Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded w-96 max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-bold mb-4">Create New Tontine</h3>
//             <input
//               type="text"
//               placeholder="Name"
//               className="border w-full p-2 mb-2"
//               value={newTontine.name}
//               onChange={(e) => setNewTontine({ ...newTontine, name: e.target.value })}
//             />
//             <textarea
//               placeholder="Description"
//               className="border w-full p-2 mb-2"
//               rows={3}
//               value={newTontine.description}
//               onChange={(e) => setNewTontine({ ...newTontine, description: e.target.value })}
//             />
//             <input
//               type="number"
//               placeholder="Contribution Amount"
//               className="border w-full p-2 mb-2"
//               value={newTontine.contributionAmount}
//               onChange={(e) => setNewTontine({ ...newTontine, contributionAmount: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Payment Schedule"
//               className="border w-full p-2 mb-4"
//               value={newTontine.paymentSchedule}
//               onChange={(e) => setNewTontine({ ...newTontine, paymentSchedule: e.target.value })}
//             />

//             <div className="flex justify-between">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//                 onClick={handleCreateTontine}
//               >
//                 Create
//               </button>
//               <button
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//                 onClick={() => setShowCreateModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Members Modal */}
//       {membersModal.isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded w-96 max-h-[80vh] overflow-y-auto">
//             <h3 className="text-lg font-bold mb-4">Members of {membersModal.tontineName}</h3>
//             <ul className="list-disc list-inside max-h-64 overflow-y-auto">
//               {membersModal.members.length === 0 ? (
//                 <p>No members found.</p>
//               ) : (
//                 membersModal.members.map((member) => (
//                   <li key={member._id} className="mb-1">
//                     {member.name} ({member.email || "No email"})
//                   </li>
//                 ))
//               )}
//             </ul>
//             <button
//               className="bg-gray-400 text-white px-4 py-2 rounded mt-4 block mx-auto"
//               onClick={() => setMembersModal({ isOpen: false, members: [], tontineName: "" })}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageTontines;
