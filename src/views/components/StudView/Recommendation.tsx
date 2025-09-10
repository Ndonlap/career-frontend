// import React from "react";
// import { Lightbulb, BookOpen, Target, Compass } from "lucide-react";

// const Recommendation: React.FC = () => {
//   const recommendedCourses = [
//     { name: "Computer Engineering", description: "Design and build computing systems." },
//     { name: "Data Science", description: "Analyze and interpret complex data." },
//     { name: "Actuarial Science", description: "Assess financial risks using math." },
//   ];

//   const skills = [
//     { name: "Learn Python", level: 80 },
//     { name: "Improve Communication", level: 65 },
//     { name: "Critical Thinking", level: 90 },
//   ];

//   return (
//     <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen space-y-8">
//       {/* Title */}
//       <div className="flex items-center gap-3">
//         <Lightbulb className="text-yellow-500 w-8 h-8" />
//         <h2 className="text-3xl font-bold text-blue-800">Your Personalized Recommendations</h2>
//       </div>
//       <p className="text-slate-600 text-lg">
//         Based on your{" "}
//         <span className="font-medium text-blue-700">Performance Snapshot</span> and{" "}
//         <span className="font-medium text-blue-700">Interest Assessment</span>, here’s what we
//         suggest:
//       </p>

//       {/* Highlight Summary */}
//       <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow">
//         <p className="text-slate-700 text-lg">
//           Since you scored high in{" "}
//           <span className="font-semibold text-blue-700">Math</span> &{" "}
//           <span className="font-semibold text-blue-700">Computer Science</span> and rated{" "}
//           <span className="font-semibold text-blue-700">Problem-Solving</span> highly, we recommend:
//         </p>
//         <ul className="list-disc list-inside mt-3 text-slate-600">
//           <li>Computer Engineering</li>
//           <li>Data Science</li>
//           <li>Actuarial Science</li>
//         </ul>
//       </div>

//       {/* Recommended Courses */}
//       <div>
//         <h3 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
//           <BookOpen className="text-red-500" /> Explore Recommended Courses
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {recommendedCourses.map((course) => (
//             <div
//               key={course.name}
//               className="bg-white border rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col"
//             >
//               <p className="text-blue-700 font-semibold text-lg">{course.name}</p>
//               <p className="text-sm text-slate-500 mt-2">{course.description}</p>
//               <button className="mt-auto text-blue-600 font-medium text-sm hover:underline">
//                 Learn More →
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Suggested Skills */}
//       <div>
//         <h3 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
//           <Target className="text-green-600" /> Suggested Skills to Develop
//         </h3>
//         <div className="space-y-4">
//           {skills.map((skill) => (
//             <div key={skill.name}>
//               <div className="flex justify-between mb-1">
//                 <span className="text-slate-700 font-medium">{skill.name}</span>
//                 <span className="text-slate-500 text-sm">{skill.level}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-500 h-2 rounded-full"
//                   style={{ width: `${skill.level}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Call to Action */}
//       <div className="text-center">
//         <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
//           <Compass size={18} />
//           Explore Similar University Programs
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Recommendation;
