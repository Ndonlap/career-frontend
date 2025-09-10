import React from "react";
import { Link } from "react-router-dom";

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  to: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, to }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 text-slate-700"
    >
      {icon}
      {text}
    </Link>
  );
};

export default MenuItem;
