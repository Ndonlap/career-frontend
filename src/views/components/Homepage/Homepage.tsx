import React from "react";
import homepic from "../../../assets/images/homepic.png";
import di from "../../../assets/images/diver1.png";
import div from "../../../assets/images/diver2.png";
import dive from "../../../assets/images/diver3.png";
import diver from "../../../assets/images/diver4.png";
import Logo from "../../../utils/components/other components/Logo";
import Diver from "../../../utils/components/other components/Diver";
// import applogo from "../../../assets/images/applogo.png";
import { Menu, Phone } from "lucide-react";
interface SolutionItem {
  id: number;
  img: string;
  description: {
    title: string;
    subtitle: string;
    color: string;
  };
}

// 4 coloured divs
const array: SolutionItem[] = [
  {
    id: 1,
    img: di,
    description: {
      title: "Financial transparency",
      subtitle: "Keep track of financial transaction",
      color: "bg-[#daf4fe]",
    },
  },
  {
    id: 2,
    img: div,
    description: {
      title: "Data sustainability",
      subtitle: "Save current and historical data",
      color: "bg-[#eaf3ff]",
    },
  },
  {
    id: 3,
    img: dive,
    description: {
      title: "Accuracy Calculations",
      subtitle: "Reduce the risk of errors by automating calculations",
      color: "bg-[#ffebe6]",
    },
  },
  {
    id: 4,
    img: diver,
    description: {
      title: "Access to information",
      subtitle: "Make information accessible",
      color: "bg-[#fff3e9]",
    },
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#002B5B]">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 lg:px-24 py-6 shadow-sm">
        <Logo/>

        <nav className="hidden lg:flex gap-6 font-medium text-sm">
          <a href="#" className="hover:text-[#c92a2a] transition">Home</a>
          <a href="#" className="hover:text-[#c92a2a] transition">Services</a>
          <a href="#" className="hover:text-[#c92a2a] transition">Testimonials</a>
          <a href="#" className="hover:text-[#c92a2a] transition">Resources</a>
          <a href="#" className="hover:text-[#c92a2a] transition">About Us</a>
          <a href="#" className="hover:text-[#c92a2a] transition">Contact Us</a>
        </nav>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
            <Phone className="w-4 h-4 text-[#c92a2a]" />
            657364499
          </div>
          <div className="flex flex-row gap-[11px] items-center mr-11">
              <a href="/login" className="hover:underline">
                Sign In
              </a>
              <button className="michelle px-3 py-1 border-[#c92a2a] border-2 rounded-full hover:pointer hover:bg-white hover:text-[#1a5cb9]">
                <a href="/signup">Join Us</a>
              </button>
            </div>
          <div className="lg:hidden">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-24 py-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-20">
        {/* Left Side */}
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide mb-2 text-gray-600">
            SCIENTIFIC & DATA DRIVEN
          </p>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Get Right Career Options <br /> With Scientific Career <br />
            Counselling
          </h1>
          <p className="text-gray-700 mb-6 text-sm">
            Implement Your Career Plan Rationally.
          </p>
          <button className="bg-[#c92a2a] text-white px-6 py-3 rounded-md hover:bg-[#a61e1e] transition-all duration-300">
             <a href="/signup">Get Started</a>
          </button>
        </div>

        {/* Right Side */}
        <div className="w-full max-w-md">
          <img
            src={homepic}
            alt="Students Hero"
            className="w-full object-contain rounded-full border-4 border-[#c92a2a] shadow-lg"
          />
        </div>
      </section>
       <Diver solution={array} />
    </div>
  );
};

export default HomePage ;