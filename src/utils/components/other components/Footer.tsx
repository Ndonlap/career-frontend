import React from "react";
import applo from "../../../assets/images/applogo.png"; // replace with your logo
import fbIcon from "../../../assets/images/fa.png";
import xIcon from "../../../assets/images/fac.png";
import ytIcon from "../../../assets/images/you.png";

const Footer: React.FC = () => {
  return (
    <div className="bg-[#000080] text-white p-8 min-h-screen flex flex-col md:flex-row w-full">
      {/* Brand & Description */}
      <div className="flex-1 w-[20%] flex flex-col justify-center mb-[200px]">
        <div className="flex items-center mb-4">
          <img
            src={applo}
            alt="MyCareerCoach Logo"
            className="w-12 h-12 rounded-full mr-2"
          />
          <h1 className="text-3xl font-bold">MyCareerCoach</h1>
        </div>
        <p className="w-[450px] mb-6">
          MyCareerCoach is designed to guide students transitioning from high
          school to university. It simplifies academic and career decisions
          through course recommendations, aptitude tests, and expert counseling
          sessions — empowering students to build a successful future.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-200 hover:text-blue-100">
            <img src={fbIcon} alt="Facebook" className="w-8 h-8 rounded-full" />
          </a>
          <a href="#" className="text-blue-200 hover:text-blue-100">
            <img src={xIcon} alt="Twitter" className="w-10 h-8 rounded-full" />
          </a>
          <a href="#" className="text-blue-200 hover:text-blue-100">
            <img src={ytIcon} alt="YouTube" className="w-8 h-8 rounded-full" />
          </a>
        </div>
      </div>

      {/* Links & Contact */}
      <div className="flex-1 md:mt-0 md:ml-8 flex flex-row p-5 gap-8">
        {/* Quick Access */}
        <div className="w-[400px] mt-[100px]">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <ul className="space-y-2">
            <li>
              <a href="/login" className="hover:underline">
                Registration / Login
              </a>
            </li>
            <li>
              <a href="/support" className="hover:underline">
                Support
              </a>
            </li>
            <li>
              <a href="/resources" className="hover:underline">
                Resources
              </a>
            </li>
            <li>
              <a href="/guides" className="hover:underline">
                Quick Start Guide
              </a>
            </li>
            <li>
              <a href="/docs" className="hover:underline">
                Documentation
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-[71px]">
          <h2 className="text-xl font-semibold mt-8 mb-4">Contacts</h2>
          <p className="mb-2">MyCareerCoach is developed by EduTech Labs.</p>
          <p className="mb-2">
            Based in Cameroon with offices in Yaoundé, Cameroon.
          </p>
          <p className="mb-2">
            Email:{" "}
            <a href="mailto:info@mycareercoach.com" className="hover:underline">
              info@mycareercoach.com
            </a>
          </p>
          <p className="mb-2">Tel: +237 690 123 456</p>
          <p className="mb-2">Support: +1 (581) 681-0651</p>
        </div>

        {/* Newsletter */}
        <div className="mt-[70px]">
          <h2 className="text-xl font-semibold mt-8 mb-4">Newsletter</h2>
          <p className="mb-2">
            Stay updated with the latest tips, resources, and opportunities.
          </p>
          <form className="flex flex-col">
            <input
              type="email"
              placeholder="Your Email *"
              className="w-[200px] p-2 rounded-xl mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
              required
            />
            <button
              type="submit"
              className="w-[200px] bg-[#3b9205] hover:bg-green-400 text-white py-2 rounded-xl transition-all"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Footer;
