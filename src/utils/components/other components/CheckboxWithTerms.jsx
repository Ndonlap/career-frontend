// Agree for the terms and conditions in login, ..
import React, { useEffect, useState } from "react";

const CheckboxWithTerms = ({ openModal, agree, setAgree }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTerms = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      openModal();
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className=" flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms-checkbox"
          checked={agree}
          onChange={(e) => setAgree(!agree)}
          className="form-checkbox h-5 w-5 "
        />
        <label htmlFor="terms-checkbox" className="text-gray-700">
          I agree to the{" "}
          <button
            data-popover
            id="popover-default"
            role="tooltip"
            type="button"
            onClick={(e) => {
              setIsOpen((isOpen) => !isOpen);
            }}
            className="text-[#3b9205] underline hover:text-[#78ca45]"
          >
            terms and conditions
          </button>
        </label>
      </div>
    </div>
  );
};

export default CheckboxWithTerms;
