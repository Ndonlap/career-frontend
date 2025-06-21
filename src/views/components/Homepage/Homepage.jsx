import React from "react";
import applo from "../../../assets/images/applo.jpg";
import applog from "../../../assets/images/applog.png";
import background from "../../../assets/images/home2.jpg";
import pic1 from "../../../assets/images/pic1.1.png";
import pic2 from "../../../assets/images/pic2.jpg";
import di from "../../../assets/images/diver1.png";
import div from "../../../assets/images/diver2.png";
import dive from "../../../assets/images/diver3.png";
import diver from "../../../assets/images/diver4.png";
import price from "../../../assets/images/price.jpg";
import fa from "../../../assets/images/fa.png";
import fac from "../../../assets/images/fac.png";
import you from "../../../assets/images/you.png";
import Diver from "../../../utils/components/other components/Diver";
import OutlineButton from "../../../utils/components/Buttons/OutlineButton";
import FAQPage from "../../../utils/components/other components/FAQPage";
import ContactPage from "../../../utils/components/other components/ContactPage";

// 4 coloured divs
const array = [
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

const Homepage = () => {
  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="w-[100%] h-[100vh] bg-#fff justify-center items-center ">
      {/* First slide */}
      <div
        style={backgroundImageStyle}
        className={`father flex w-full h-[100%]`}
      >
        <div className="w-full flex flex-col">
          {/* nav bar */}
          <nav className="w-full bg-[#000080]  h-[70px] flex justify-between flex-row  items-center px-4">
         <button>
         <a href="/">
            <img
              src={applo}
              style={{ height: 46, width: 46 }}
              className="rounded-full ml-8"
              alt=""
              
            />
            </a>
         </button>
            <ul className="flex flex-row gap-[70px] text-[#f5f5f5]">
              <li>
                <a
                  className="hover:underline  hover:decoration-green-600"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="hover:underline hover:decoration-green-600"
                  href="#Howitworks"
                >
                  How it works?
                </a>
              </li>
              <li>
                <a
                  className="hover:underline hover:decoration-green-600"
                  href="#Prices"
                >
                  Price
                </a>
              </li>
              <li>
                <a
                  className="hover:underline hover:decoration-green-600"
                  href="#FAQ"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  className="hover:underline hover:decoration-green-600"
                  href="#Contact"
                >
                  Contact
                </a>
              </li>
              
            </ul>

            <div className="flex flex-row gap-[16px] items-center mr-11">
              <a href="/login" className=" text-[#f5f5f5] hover:underline">
                Sign In
              </a>
              <button className="michelle text-[#f5f5f5] px-3 py-1 border-[#3b9205] border-2 rounded-full hover:pointer hover:bg-white hover:text-[#1a5cb9]">
                <a href="/signup">Join Us</a>
              </button>
            </div>
          </nav>
          {/* Text inside bg image */}
          <div className="flex flex-1 flex-row items-center ml-[50px] mt-[200px]">
            <div className="flex flex-col w-2/3 text-white gap-[24px] text-justify">
              <h1 className="text-6xl text-white font-semibold">
                Thanks to TontiTrack, we realized our project.
              </h1>
              <p>
                TontiTrack facilitates the management of different activities
              </p>

              <div className="flex flex-row gap-[16px]">
                {/* <Button text={"Go to app"} size={'w-[100px] h-[50px]'} position={"absolute"}/> */}
                <a href="/signup"> <button className="bg-[#3b9205] h-[48px] w-[150px] rounded-[30px] text-white hover:pointer hover:bg-white hover:text-[#1a5cb9]">
                  Go to app
                </button></a>
                <a href= '#Howitworks'><button className="bg-[#000080] h-[48px] w-[150px] rounded-[30px] text-white hover:pointer hover:bg-white hover:text-[#bcdea6]">
                 Learn more
                </button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Second slide */}
      <div className="flex justify-center items-center w-[100%] h-[100%] gap-[290px]  bg-[#f5f5f5]">
        <img src={pic1} alt="" className="w-[40%] h-[80%] " />
        <div className="w-[40%] h-[30%] text-justify  ">
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-400 text-xl">Presentation</li>
          </ul>
          <h1 className="font-bold w-[100%]  mb-4 text-5xl text-[#000080]">
            TontiTrack what is it?
          </h1>
          <p className="w-[90%] text-xl">
            TontiTrack is a self-managed online platform that helps you better
            manage your tontines and associations. <br />
            This platform automates financial calculations, promotes member
            participation in the management of the association and gives them
            real-time access to information concerning them.
          </p>
        </div>
      </div>
      {/* Third slide */}
      <div className="flex flex-row justify-center items-center  w-[100%] h-[100%] gap-[200px]  bg-[#f5f5f5] ">
        {/* Side for text */}
        <div className="w-[80%] h-[65%] text-justify ml-12">
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-400 text-xl">Historical</li>
          </ul>
          <h1 className="font-bold text-5xl text-[#000080] p-2">Why TontiTrack?</h1>
          <p className=" text-xl p-2">
            The tontine is a wonderful institution inherited from our parents
            which aims to contribute to the economic, social and cultural
            development of the communities who practice it. In the age of social
            networks and mobile phones, this notable institution has not adapted
            to the times.{" "}
            <p>
              At the time when we decided to develop TontiTrack, there was no
              comprehensive, simple and affordable tontine association
              management tool on the market. We have decided to change the
              situation.
            </p>
            <p>
              TontiTrack provides an answer to the challenges mentioned opposite
            </p>
          </p>
          {/* how it works button */}
          <a href="#Howitworks"><button
            // id="Howitworks"
            type="button"
            className=" text-white bg-[#000080] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm mt-10 px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-2xl h-12"
          >
            
            Procedures
            <svg
              class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button></a>
        </div>
        {/* 4 coloured divs */}
        <Diver solution={array} />
      </div>
      {/* Fourth slide */}
      <div className="flex flex-col items-center w-full h-[100%]  bg-[#f5f5f5] ">
        {/* Paragraph*/}
        <div className="justify-center text-center mt-8">
          <h1 id="Howitworks" className=" w-[1200px] font-bold size-20 text-center text-6xl ml-[70px] text-[#000080] ">
            How it works?
          </h1>
          <p className="w-[1400px] font-medium text-justify mt-5">
            There are two ways to access the TontiTrack platform.Either on the
            browser(by clicking on the Signup/JoinUs button on this page), or
            from a smart phone, by oppening the app which will re-direct <p className="text-center">you to
            a web browser to acces your tontine group. The web interface offers
            all functionalities, including administrative functions.</p>
          </p>
        </div>
        {/* Part down plus the image */}
        <div className="flex justify-center items-center w-[86%] h-[100%] gap-[350px]  bg-[#f5f5f5]">
          <div className="w-[40%] h-[65%] text-justify ">
            <ul className="list-disc pl-5 space-y-2 ">
              <li className="text-gray-400 text-xl">User/Admin interface </li>
            </ul>
            <h1 className="font-bold w-[100%]  mb-4 text-3xl text-black">
              The web client for members and association managers
            </h1>
            <div className=" flex flex-col justify-center w-[100%] text-xl  ">
              <div className="flex flex-row w-[100%] gap-12 ">
                <div className="w-[300px] text-justify mt-5 ">
                  <h1>Information</h1>
                  <p className="text-gray-400 text-sm mt-5">
                    {" "}
                    Access your financial situation in real time and recieve
                    important notification
                  </p>
                </div>
                <div className="w-[300px] text-justify mt-5">
                  <h1>Planning</h1>
                  <p className="text-gray-400 text-sm mt-5">
                    {" "}
                    View historical or future contributions and disbursements.
                    Declare your payments.
                  </p>
                </div>
              </div>
              <div className="flex flex-row w-[100%] gap-12 mt-10">
                <div className="w-[300px] text-justify ">
                  <h1>Organization</h1>
                  <p className="text-gray-400 text-sm mt-5">
                    {" "}
                    Access the association's calendar so as not to miss an
                    important event.
                  </p>
                </div>
                <div className="w-[300px] text-justify ">
                  <h1>Communication</h1>
                  <p className="text-gray-400 text-sm mt-5">
                    Communicate with other members and share family news.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <img
            src={pic2}
            alt=""
            className="w-[30%] h-[75%] rounded-full mt-2"
          />
        </div>
      </div>
      {/* Fifth slide */}
      <div className="flex flex-col items-center w-full h-[100%]  bg-[#f5f5f5] ">
        {/* paragraph */}
        <div className="h-full justify-center text-center mt-10">
          <h1 id="Prices" className="w-[1200px] font-bold size-20 items-center text-6xl ml-12 text-[#000080] ">
            Our Prices
          </h1>
          <p  className="w-[1400px] font-medium text-justify mt-5">
            Registration on TontiTrack is completely free for users. We offer
            simple billing which gives access to all the features of the
            application. The association receives a single invoice per cycle,
            the amount  <p className="text-center">of which depends on the number of members and the number
            of periods in the cycle.</p>
          </p>
        </div>
        {/* Photo and price box */}
        <div className=" p-3 grid grid-row-1 md:grid-row-1 gap-5 w-[100%]  ">
          <img
            src={price}
            alt=""
            className="w-[50%] h-[70%] rounded-[9px] shadow-blue-300 shadow-2xl  row-start-2 row-end-7 col-start-3 col-end-9"
          />
          <div className="bg-white rounded-xl shadow-md row-start-2 row-end-6 col-start-10 col-end-12 w-[510px] h-[350px] text-justify">
            <p className=" mb-10 mt-8 p-2 font-bold text-xl">
              The prices are constant and permanent
            </p>
            <h3 className="text-6xl font-semibold text-blue-300 text-center">99.98 CFA</h3>
            <div className="mt-8 ml-12 flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                for="default-checkbox"
                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                These are the prices per member and per session
              </label>
            </div>
            <div className="mt-2 ml-12 flex items-center mb-4">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                for="default-checkbox"
                className=" text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                The minimum amount of members is unlimitted
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Sixth slide */}
      <FAQPage />
      {/* Seventh slide */}
      <ContactPage />
      {/* Footer */}
      <div className="bg-[#000080] text-white p-8 min-h-screen flex flex-col md:flex-row w-full">
        <div className="flex-1 w-[20%] flex flex-col justify-center mb-[200px]">
          <div className="flex items-center mb-4 ">
            <img
              src={applo} // Replace with your logo path
              alt="TontiTrackLogo"
              className="w-12 h-12 rounded-full mr-2"
            />
            <h1 className="text-3xl font-bold">TontiTrack</h1>
          </div>
          <p className="w-[450px] mb-6">
            TontiTrack is designed to automate and simplify the management of
            your tontine associations. It brings more transparency in the
            management of the association and promotes cohesion between the
            members thanks to modern tools.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-200 hover:text-blue-100">
            <img
              src={fa}
              alt="TontiTrackLogo"
              className="w-8 h-8 rounded-full mr-2"
            />
            </a>
            <a href="#" className="text-blue-200 hover:text-blue-100">
            <img
              src={fac} 
              alt="TontiTrackLogo"
              className="w-12 h-8 rounded-full mr-2"
            />
            </a>
            <a href="#" className="text-blue-200 hover:text-blue-100">
            <img
              src={you} 
              alt="TontiTrackLogo"
              className="w-8 h-8 rounded-full mr-2"
            />
            </a>
          </div>
        </div>
        {/* links */}
        <div className="flex-1 md:mt-0 md:ml-8 flex flex-row p-5 gap-8 ">
          <div className="w-[400px] mt-[100px]">
            <h2 className="text-xl font-semibold mb-4  ">Quick access</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Registration / Login
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Quick Start Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Download for Android
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Download for iOS
                </a>
              </li>
            </ul>
          </div>
          {/* contact */}
          <div className="mt-[71px]">
            <h2 className="text-xl font-semibold mt-8 mb-4">Contacts</h2>
            <p className="mb-2">
              TontiTrack is developed and marketed by Intekor inc
            </p>
            <p className="mb-2">
              Based in Cameroon with offices in Yaoundé, Cameroon.
            </p>
            <p className="mb-2">
              Email:{" "}
              <a href="mailto:info@tontine.plus" className="hover:underline">
                info@tontiTrack
              </a>
            </p>
            <p className="mb-2">Tel int: +1 (581) 681-0651</p>
            <p className="mb-2">Tel cmr: +237 222-316-797</p>
          </div>
            {/* Subscribe to our newsletter and buttons */}
          <div className="mt-[70px]">
            <h2 className="text-xl font-semibold mt-8 mb-4">Newsletter</h2>
            <p className="mb-2">
            </p>
            <form className="flex flex-col">
              <input
                type="email"
                placeholder="Your Email *"
                className="w-[200px] p-2 rounded-xl mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
    </div>
  );
};
export default Homepage;
