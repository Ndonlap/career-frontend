// import React from "react";
// import type { ChartOptions } from "chart.js";
// import { Bar, Line } from "react-chartjs-2";
// import { Download, TrendingUp, Award, AlertCircle } from "lucide-react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";


// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const ViewReport: React.FC = () => {
//   // Bar Chart Data (Subject Performance)
//   const subjectData = {
//     labels: ["Math", "Biology", "Computer", "Economics", "Chemistry", "Physics", "Geography"],
//     datasets: [
//       {
//         label: "Scores",
//         data: [85, 70, 92, 65, 78, 88, 75],
//         backgroundColor: "rgba(10, 83, 173, 0.8)", // Blue
//         borderRadius: 6,
//       },
//     ],
//   };

// //   const subjectsOptions = {
// //     responsive: true,
// //     plugins: {
// //       legend: { display: false },
// //       title: {
// //         display: true,
// //         text: "Subject-wise Performance",
// //         font: { size: 16, weight: "bold" },
// //         color: "#0A53AD",
// //       },
// //     },
// //     scales: {
// //       y: { beginAtZero: true, ticks: { stepSize: 20 } },
// //     },
// //   };

//   // Line Chart Data (Progress Over Time)
//   const progressData = {
//     labels: ["Term 1", "Term 2", "Term 3"],
//     datasets: [
//       {
//         label: "Average Score",
//         data: [75, 80, 85],
//         borderColor: "#0A53AD", // Blue line
//         backgroundColor: "rgba(10,83,173,0.1)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };
//   const subjectOptions: ChartOptions<"bar"> = {
//   responsive: true,
//   plugins: {
//     legend: { display: false },
//     title: {
//       display: true,
//       text: "Subject-wise Performance",
//       font: { size: 16, weight: "bold" },
//       color: "#0A53AD",
//     },
//   },
//   scales: {
//     y: { beginAtZero: true, ticks: { stepSize: 20 } },
//   },
// };

// const progressOptions: ChartOptions<"line"> = {
//   responsive: true,
//   plugins: {
//     legend: { position: "top" as const },
//     title: {
//       display: true,
//       text: "Performance Progress Over Time",
//       font: { size: 16, weight: "bold" },
//       color: "#0A53AD",
//     },
//   },
// };

// //   const progressOptions = {
// //     responsive: true,
// //     plugins: {
// //       legend: { position: "top" as const },
// //       title: {
// //         display: true,
// //         text: "Performance Progress Over Time",
// //         font: { size: 16, weight: "bold" },
// //         color: "#0A53AD",
// //       },
// //     },
// //   };

//   const subjects = [
//     { subject: "Math", score: 85, grade: "A", remark: "Excellent" },
//     { subject: "Biology", score: 70, grade: "B", remark: "Good" },
//     { subject: "Computer", score: 92, grade: "A+", remark: "Outstanding" },
//     { subject: "Economics", score: 65, grade: "C", remark: "Needs Improvement" },
//     { subject: "Chemistry", score: 78, grade: "B", remark: "Good" },
//   ];

//   return (
//     <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold text-blue-800">📊 Your Performance Report</h2>
//         <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
//           <Download size={18} /> Download PDF
//         </button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
//           <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
//             <TrendingUp size={24} />
//           </div>
//           <div>
//             <h4 className="text-slate-500 text-sm">Average Score</h4>
//             <p className="text-3xl font-bold text-blue-700">81%</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
//           <div className="bg-green-100 text-green-600 p-3 rounded-full">
//             <Award size={24} />
//           </div>
//           <div>
//             <h4 className="text-slate-500 text-sm">Top Subject</h4>
//             <p className="text-lg font-bold text-green-600">Computer Science (92)</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition">
//           <div className="bg-red-100 text-red-600 p-3 rounded-full">
//             <AlertCircle size={24} />
//           </div>
//           <div>
//             <h4 className="text-slate-500 text-sm">Lowest Subject</h4>
//             <p className="text-lg font-bold text-red-600">Economics (65)</p>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <Bar data={subjectData} options={subjectOptions} />
//         </div>
//         <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
//           <Line data={progressData} options={progressOptions} />
//         </div>
//       </div>

//       {/* Subject Breakdown Table */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h3 className="text-lg font-semibold text-blue-700 mb-4">Subject Breakdown</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-blue-50 text-blue-700">
//                 <th className="p-3 border">Subject</th>
//                 <th className="p-3 border">Score</th>
//                 <th className="p-3 border">Grade</th>
//                 <th className="p-3 border">Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subjects.map((item, idx) => (
//                 <tr key={idx} className="hover:bg-slate-50">
//                   <td className="p-3 border">{item.subject}</td>
//                   <td className="p-3 border">{item.score}</td>
//                   <td className="p-3 border">{item.grade}</td>
//                   <td className="p-3 border">{item.remark}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewReport;
