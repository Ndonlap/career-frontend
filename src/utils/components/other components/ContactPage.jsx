// contact page found in homepage

import React from 'react';
import message from '../../../assets/images/message.jpg';
import applog from "../../../assets/images/applog.png";

const ContactPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#f5f5f5]">
      {/* Sidebar with image */}
      <div className="w-[600px] bg-gray-100 relative">
        <img
          src={message}
          alt="Sidebar Image"
          className="object-cover h-full"
        />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-sm text-gray-500">
            Tether supports and empowers growing ventures and innovation as a digital token built on multiple blockchains.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-gray-400">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="w-full flex items-center justify-center bg-[#f5f5f5] p-10">
        <div className="w-[70%] mb-[80px] ">
          <h2 id='Contact' className="text-3xl font-bold mb-[20px] text-[#000080] ">GET IN TOUCH</h2>
          <p className="text-gray-600 mb-[50px] ">24/7 We will answer your questions and problems</p>
          <form className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="First Name"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Describe your issue</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                rows="4"
                placeholder="Describe your issue"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-[#000080] text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
