// // views/components/StudView/UploadReportCard.tsx
// import React, { useState } from "react";

// const UploadReportCard: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <h3 className="text-lg font-semibold text-slate-700 mb-4">
//         Upload Report Card
//       </h3>
      
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//         className="mb-4 block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4
//                    file:rounded-full file:border-0 file:text-sm file:font-semibold
//                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//       />

//       {selectedFile && (
//         <p className="text-sm text-green-600 mb-4">
//           ✅ Selected: {selectedFile.name}
//         </p>
//       )}

//       <button className="mt-2 inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
//         Upload
//       </button>

//       <div className="mt-6">
//         <button className="w-full rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
//           Take Aptitude Test
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadReportCard;
