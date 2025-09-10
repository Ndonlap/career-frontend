import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// Define FAQ type
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How to access the application?",
    answer:
      "MyCareerCoach can be accessed from a web browser. The platform is also supported by a mobile application available on the App Store and Google Play.",
  },
  {
    question: "Who can use MyCareerCoach?",
    answer:
      "Any high school student preparing for university, as well as counselors, can use the application to manage guidance and academic decisions.",
  },
  {
    question: "What services does MyCareerCoach provide?",
    answer:
      "The system provides course recommendations, interest assessments, counseling session booking, and access to career resources.",
  },
  {
    question: "Is my data safe on MyCareerCoach?",
    answer:
      "Yes. The platform uses secure authentication and data protection practices to ensure student and counselor information remains private.",
  },
];

const FAQPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="h-full w-full">
      <div id="Testimonial" className="w-full h-full p-8 shadow-md bg-slate-50">
        <h1
          id="FAQ"
          className="text-4xl text-center font-bold mb-6 text-[#000080]"
        >
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Here are answers to some common questions that arise for users or
          future users of MyCareerCoach.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-300 p-6 rounded-lg shadow-lg cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h2
                  className={`text-lg font-medium ${
                    activeIndex === index ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {faq.question}
                </h2>
                {activeIndex === index ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-blue-600" />
                )}
              </div>
              {activeIndex === index && (
                <p className="mt-4 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
