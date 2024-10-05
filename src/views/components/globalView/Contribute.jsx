import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Button } from "flowbite-react";
// import MakeContribution from './MakeContribution';
// import { FaReact } from 'react-icons/fa'; // React icon from react-icons
import add from '../../../assets/images/add.png'

const Contribute = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [referentialCode, setReferentialCode] = useState('');

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Referential Code: ${referentialCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70%]">
     <Button className=" justify-center align-center  bg-[#3b9205] hover:bg-[#437622] focus:ring-4 focus:outline-none focus:ring-green-300" color="success" pill>
                <a onClick={togglePopup}>CONTRIBUTE NOW!</a>
                </Button>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg relative w-[40%] h-[40%]">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={togglePopup}
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
            
            <h2 className="text-lg font-semibold mb-4">CONTRIBUTION</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter your phone number"
                // value={referentialCode}
                // onChange={(e) => setReferentialCode(e.target.value)}
                className="text-base border border-gray-300 rounded p-2 w-full mb-4"
                required
              />
              <input
                type="text"
                placeholder="Enter the amount"
                // value={referentialCode}
                // onChange={(e) => setReferentialCode(e.target.value)}
                className="text-base border border-gray-300 rounded p-2 w-full mb-4"
                required
              />
              <button
                type="submit"
                className="text-base bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors w-full"
              >
                Confirm payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contribute;
