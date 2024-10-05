// Large green buttons for login
export default function Buttons({ text, type='submit' ,onClick,size, width, hide, style }) {
  return (
    <button 
       disabled={hide && true}
       onClick={onClick}
      type={type}
      className={`cursor-pointer block text-white ${size} ${width} disabled bg-[#3b9205] hover:bg-[#437622] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${style}`}
    >
    {text}
    </button>
  );

}

