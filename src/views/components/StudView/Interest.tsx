// import React, { useState } from "react";

// const Interest: React.FC = () => {
//   const [form, setForm] = useState({
//     problemSolving: 5,
//     creativity: 5,
//     people: 5,
//     leadership: 5,
//     research: 5,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: Number(value) }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Submitted Interests:", form);
//     alert("Your interests have been saved ✅");
//   };

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-bold text-blue-800 mb-2">
//         Self-Assessment Form
//       </h2>
//       <p className="text-slate-600 mb-6">
//         Rate your level of interest in the following areas (0 = Not interested,
//         10 = Very interested).
//       </p>

//       {/* Scrollable Form */}
//       <div className="bg-white rounded-xl shadow-md p-6 max-h-[500px] overflow-y-auto">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Numbers & Problem-Solving */}
//           <div>
//             <label className="block font-medium text-slate-700">
//               Maths & Problem-Solving
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="1"
//               name="problemSolving"
//               value={form.problemSolving}
//               onChange={handleChange}
//               className="w-full accent-blue-600"
//             />
//             <span className="text-sm text-slate-500">
//               {form.problemSolving}/10
//             </span>
//           </div>

//           {/* Creativity & Design */}
//           <div>
//             <label className="block font-medium text-slate-700">
//               Creativity & Design
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="1"
//               name="creativity"
//               value={form.creativity}
//               onChange={handleChange}
//               className="w-full accent-red-600"
//             />
//             <span className="text-sm text-slate-500">{form.creativity}/10</span>
//           </div>

//           {/* Working with People */}
//           <div>
//             <label className="block font-medium text-slate-700">
//               Chemistry
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="1"
//               name="people"
//               value={form.people}
//               onChange={handleChange}
//               className="w-full accent-blue-400"
//             />
//             <span className="text-sm text-slate-500">{form.people}/10</span>
//           </div>

//           {/* Leadership & Management */}
//           <div>
//             <label className="block font-medium text-slate-700">
//               Economics & Management
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="1"
//               name="leadership"
//               value={form.leadership}
//               onChange={handleChange}
//               className="w-full accent-purple-600"
//             />
//             <span className="text-sm text-slate-500">{form.leadership}/10</span>
//           </div>

//           {/* Research & Innovation */}
//           <div>
//             <label className="block font-medium text-slate-700">
//               Computer science & Innovation
//             </label>
//             <input
//               type="range"
//               min="0"
//               max="10"
//               step="1"
//               name="research"
//               value={form.research}
//               onChange={handleChange}
//               className="w-full accent-green-600"
//             />
//             <span className="text-sm text-slate-500">{form.research}/10</span>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//           >
//             Save Interests
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Interest;
