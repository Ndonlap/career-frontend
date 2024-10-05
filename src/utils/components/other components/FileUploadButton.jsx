import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

const FileUploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <label
        className="px-2 py-2 w-[150px] text-center bg-[#3b9205] border-red-700 hover:bg-[#437622] text-white rounded-3xl cursor-pointer"
        htmlFor="fileInput"
        // FiUpload className="mr-2"
      >
        Upload ID card
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div className="mt-4">
          <p className="text-gray-700">Selected file: {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;