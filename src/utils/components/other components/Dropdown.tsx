// // Dropdown for the user profile
// import React, { useEffect, useState } from "react";
// import profile from "../../../assets/images/profile.png";
// import applog from "../../../assets/images/applog.png"

// const Dropdown = ({ open = false }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <div className="relative inline-block text-left">
//         {/* User profile icon */}
//         <button
//           onClick={toggleDropdown}
//           className="flex items-center justify-center "
//         >
//           <img
//            title="My profile"
//             src={profile}
//             style={{ height: 48, width: 48 }}
//             className="rounded-full cursor-pointer"
//             alt=""
//             onChange={(e) => {}}
//           />
//         </button>

//         {/* Dropdown menu */}
//         {isOpen && (
//           <div className="absolute right-0 mt-2 mr-510w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
//             <div className="w-64 h-[90%] bg-gray-100 shadow-lg rounded-xl p-6">
//               <div className="mb-8">
//                 <div className="flex items-center justify-center">
//                   <img
//                     src={applog}
//                     style={{ height: 48, width: 48 }}
//                     alt="Logo"
//                     className="h-8 w-auto"
//                   />
//                 </div>
//               </div>
//               <nav className="flex flex-col space-y-4">
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">home</span>
//                   <span className="ml-3">Home</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">search</span>
//                   <span className="ml-3">Explore</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">notifications</span>
//                   <span className="ml-3">Notifications</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg bg-gray-200"
//                 >
//                   <span className="material-icons-outlined">message</span>
//                   <span className="ml-3">Messages</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">article</span>
//                   <span className="ml-3">Articles</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">bookmark</span>
//                   <span className="ml-3">Bookmarks</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">store</span>
//                   <span className="ml-3">Store</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">group</span>
//                   <span className="ml-3">Communities</span>
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
//                 >
//                   <span className="material-icons-outlined">more_horiz</span>
//                   <span className="ml-3">More</span>
//                 </a>
//               </nav>
//               <div className="border-t border-gray-200">
//                 <button
//                   onClick={() => {
//                     setIsOpen(false);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Dropdown;
import React, { useState } from "react";
import {
  Award,
  LayoutDashboard,
  Trophy,
  Heart,
  ClipboardList,
  FileText,
  Globe,
  User
} from "lucide-react"; // Professional icon set

const Dropdown: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-[#002B5B] text-white font-semibold rounded-lg shadow hover:bg-[#c92a2a] transition"
      >
        <User size={20} />
        
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
          {/* Profile Section */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Tchouga Serena</p>
              <p className="text-sm text-[#1E3A8A] font-medium cursor-pointer hover:underline">
                Finish Your Profile
              </p>
            </div>
          </div>

          {/* XP Section */}
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
              XP
            </span>
            <span className="font-semibold text-[#c92a2a]">5</span>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col text-gray-700">
            <MenuItem icon={<Award size={18} />} text="Get Your Certificates" />
            <MenuItem icon={<LayoutDashboard size={18} />} text="Your Dashboard" />
            <MenuItem icon={<Trophy size={18} />} text="Your Achievements" />
            <MenuItem icon={<Heart size={18} />} text="Recommended For You" />
            <MenuItem icon={<ClipboardList size={18} />} text="Career Ready Plan" />
            <MenuItem icon={<FileText size={18} />} text="Create Resumé/CV" badge="New" />
          </div>

          {/* Language Change */}
          <div className="flex items-center gap-2 p-4 border-t cursor-pointer hover:bg-gray-100">
            <Globe size={18} />
            <span className="text-sm font-medium">Change Language</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  badge?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, badge }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{text}</span>
      </div>
      {badge && (
        <span className="bg-[#1E3A8A] text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

export default Dropdown;

