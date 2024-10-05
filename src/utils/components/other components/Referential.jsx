import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useParams } from 'react-router';
import { IdentificationIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Referential = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [referentialCode, setReferentialCode] = useState('');

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const { id } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/tontine/generateTontineCode/${id}`, {
      method: 'put',
      headers: {
        'content-type': 'application/json',
        'accept': 'applicaion/json',
        'access-control-origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('tonti_token')}`
      },
    })
      .then(res => res.json())
      .then(async (data) => {
        console.log("data", data)
        if (data.referencialCode) {
          setReferentialCode(data.referencialCode)
        }
      })
      .catch(e => {
        console.log(e)
      })
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LockClosedIcon
      style={{ height: 30, width: 30 }}
       title="Referetial code"
      className="cursor-pointer hover:scale-110 transition-transform"
      alt=""
      onClick={togglePopup}
      />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={togglePopup}
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Generate your referential code</h2>
            {referentialCode && (
              <>
                <h2 className="text-lg font-semibold mb-4">{referentialCode}</h2>
              </>
            )}
            <form onSubmit={handleSubmit}>
              {/* <input
                type="text"
                placeholder="Enter your referential code"
                value={referentialCode}
                onChange={(e) => setReferentialCode(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full mb-4"
                required
              /> */}
              <button
                type="submit"
                className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors w-full"
              >
                Generate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referential;
