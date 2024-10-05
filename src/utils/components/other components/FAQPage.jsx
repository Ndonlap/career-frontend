// FAQ in the homepage
import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: "How to access the application?",
    answer: "TontiTrack can be accessed from a web browser at https://www.tontiTrack. The web platform is supported by a mobile application that can be downloaded from the App Store and from Google Play. The mobile application is dedicated to members and offers a few administrative functions."
  },
  {
    question: "Who can create an association on TontiTrack?",
    answer: "Any registered user can create an association on TontiTrack, provided they meet the platform's guidelines and requirements."
  },
  {
    question: "What activities does TontiTrack manage?",
    answer: "TontiTrack manages a variety of activities including financial transactions, member management, and reporting for associations."
  },
  {
    question: "Who can create an association on TontiTrack?",
    answer: "Any registered user can create an association on TontiTrack, provided they meet the platform's guidelines and requirements."
  },
  {
    question: "How to access the application?",
    answer: "TontiTrack can be accessed from a web browser at https://www.tontiTrack. The web platform is supported by a mobile application that can be downloaded from the App Store and from Google Play. The mobile application is dedicated to members and offers a few administrative functions."
  },
  // Add more FAQ items here
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="h-full w-full ">
      <div className="w-[100%] h-full p-8 rounded-lg shadow-md bg-[#f5f5f5]">
        <h1 id='FAQ' className="text-4xl text-center font-bold mb-6 text-[#000080]">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 mb-8">Here is the answer to some questions that arise for users or future users of TontiTrack.</p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-300 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h2 className={`text-lg font-medium ${activeIndex === index ? 'text-blue-600' : 'text-gray-800'}`}>
                  {faq.question}
                </h2>
                {activeIndex === index ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-blue-600" />
                )}
              </div>
              {activeIndex === index && (
                <p className="mt-4 text-white bg-gray-300 ">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
