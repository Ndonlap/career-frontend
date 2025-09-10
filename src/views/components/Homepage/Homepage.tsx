import React from "react";
// import homepic from "../../../assets/images/homepic.png";
import hommm from "../../../assets/images/hommmm.png";
import di from "../../../assets/images/diver1.png";
import div from "../../../assets/images/diver2.png";
import dive from "../../../assets/images/diver3.png";
import diver from "../../../assets/images/diver4.png";
import Logo from "../../../utils/components/other components/Logo";
import Diver from "../../../utils/components/other components/Diver";
// import applogo from "../../../assets/images/applogo.png";
import { Menu, Phone } from "lucide-react";
import Services from "./Services";
import ResourcesPage from "./Resources";
import FAQPage from "../../../utils/components/other components/FAQPage";
import Footer from "../../../utils/components/other components/Footer";
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
      <header className="flex justify-between items-center px-4 lg:px-20 py-4 bg-red-50 shadow-2xl ">
        <Logo/>

        <nav className="hidden lg:flex gap-6 font-medium text-sm">
          <a href="/" className="hover:text-[#c92a2a] transition">Home</a>
          <a href="#Services" className="hover:text-[#c92a2a] transition">Services</a>
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
<section
  className="relative h-[90vh] flex items-center justify-center text-center text-white"
  style={{
    backgroundImage: `url(${hommm})`,
    backgroundSize: "cover",
    // backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }}
>
  {/* Gradient Overlay */}
  {/* <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 via-red-600/60 to-orange-500/60"></div> */}

  {/* Content */}
  <div className="relative z-10 max-w-3xl px-6">
    <p className="text-sm font-medium tracking-wide mb-4 uppercase">
      SCIENTIFIC & DATA DRIVEN
    </p>
    <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
     Turning Academic Decisions into <br /> Career Success.
    </h1>
    <p className="text-gray-100 mb-8 text-base lg:text-lg">
      From selecting the right course to achieving your goals, 
      our platform supports you at every step of your journey.
    </p>
    <button className="bg-[#c92a2a] text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-red-100 transition-all duration-300">
      <a href="/signup">Start Your Journey →</a>
    </button>
  </div>
</section>
<Services />
<ResourcesPage/>
<FAQPage/>
<Footer />
       {/* <Diver solution={array} /> */}
    </div>
  );
};

export default HomePage ;