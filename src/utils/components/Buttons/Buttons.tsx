// Buttons.tsx
import React from 'react';

// Define the prop types using TypeScript interface
interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  size?: string;
  width?: string;
  hide?: boolean;
  style?: string;
}

const Buttons: React.FC<ButtonProps> = ({
  text,
  type = "submit",
  onClick,
  size = "",
  width = "",
  hide = false,
  style = "",
}) => {
  return (
    <button
      disabled={hide}
      onClick={onClick}
      type={type}
      className={`cursor-pointer block text-white ${size} ${width} disabled bg-[#c92a2a] hover:bg-[#ab2424] focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${style}`}
    >
      {text}
    </button>
  );
};

export default Buttons;

