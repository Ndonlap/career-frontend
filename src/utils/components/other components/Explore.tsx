// src/components/Explore.tsx
import React, { useState } from "react";
import { FaLaptopCode, FaHeartbeat, FaLanguage, FaBriefcase, FaUsers, FaCertificate, FaGraduationCap } from "react-icons/fa";

interface CourseCategory {
  id: number;
  icon: JSX.Element;
  title: string;
  count: number;
}

const Explore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories: CourseCategory[] = [
    { id: 1, icon: <FaLaptopCode className="text-blue-500 text-xl" />, title: "IT", count: 1259 },
    { id: 2, icon: <FaHeartbeat className="text-red-500 text-xl" />, title: "Health", count: 1024 },
    { id: 3, icon: <FaLanguage className="text-blue-400 text-xl" />, title: "Language", count: 314 },
    { id: 4, icon: <FaBriefcase className="text-red-400 text-xl" />, title: "Business", count: 1719 },
    { id: 5, icon: <FaUsers className="text-blue-600 text-xl" />, title: "Management", count: 1045 },
  ];

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-black rounded-md transition"
      >
        Explore Courses
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          {/* Goals Section */}
          <div className="px-4 py-3 border-b">
            <h4 className="text-gray-500 font-semibold text-sm">GOALS</h4>
            <div className="flex items-center gap-2 mt-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <FaCertificate className="text-blue-500" /> 
              <span>Earn a Certificate</span>
            </div>
            <div className="flex items-center gap-2 mt-1 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <FaGraduationCap className="text-red-500" /> 
              <span>Earn a Diploma</span>
            </div>
          </div>

          {/* Course Categories */}
          <div className="px-4 py-3">
            <div className="flex justify-between items-center">
              <h4 className="text-gray-500 font-semibold text-sm">COURSE CATEGORIES</h4>
              <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="mt-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {cat.icon}
                    <span>{cat.title}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({cat.count} Courses)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
