// Modification of any modal with the use of a child
import Modal from "react-modal";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
// import { FaReact } from 'react-icons/fa'; // React icon from react-icons

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement("#root");

export default function ModalComponent({
  modalIsOpen,
  setIsOpen,
  title,
  children,
}) {
  function afterOpenModal() {}

  const handleSubmit = () => {};

  function closeModal() {
    setIsOpen(false);
  }

  return (
    // <Modal
    //   isOpen={modalIsOpen}
    //   onAfterOpen={afterOpenModal}
    //   onRequestClose={closeModal}
    //   style={customStyles}
    //   contentLabel="Modal"
    // >
    //   <div id="default-modal" className="">
    //     <div className="relative p-4 w-full max-w-2xl max-h-full">
    //       <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
    //         <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
    //           <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
    //             {title}
    //           </h3>
    //           <button
    //             onClick={() => {
    //               closeModal();
    //             }}
    //             type="button"
    //             className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
    //             data-modal-hide="default-modal"
    //           >
    //             <svg
    //               className="w-3 h-3"
    //               aria-hidden="true"
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 14 14"
    //             >
    //               <path
    //                 stroke="currentColor"
    //                 stroke-linecap="round"
    //                 stroke-linejoin="round"
    //                 stroke-width="2"
    //                 d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
    //               />
    //             </svg>
    //             <span className="sr-only">Close modal</span>
    //           </button>
    //         </div>

    //         {children}
    //       </div>
    //     </div>
    //   </div>
    // </Modal>     
       <>
          { modalIsOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={closeModal}
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold ">
          Suggestions
        </h1>
        <p className="mb-5">We will love to here from you</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            // value={referentialCode}
            onChange={(e) => setReferentialCode(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
            required
          />
           <input
            type="text"
            placeholder="Message"
            // value={referentialCode}
            onChange={(e) => setReferentialCode(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>}
       </>
    
  );
}
