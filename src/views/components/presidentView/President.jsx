import React, { useState } from "react";
import applog from "../../../assets/images/applog.png";
import profile from "../../../assets/images/profile.png";
import woman from "../../../assets/images/woman.jpg";
import member from "../../../assets/images/member.jpg";
import moneyweek from "../../../assets/images/moneyweek.jpg";
import moneypool from "../../../assets/images/moneypool.jpg";
import moneyyear from "../../../assets/images/moneyyear.jpg";
import man from "../../../assets/images/man.jpeg";
import man2 from "../../../assets/images/man2.jpg";
import man3 from "../../../assets/images/man3.jpeg";
import wallet from "../../../assets/images/wall.jpg";
import notif from "../../../assets/images/notif.jpg";
// import Threedivs from "../../components/Buttons/Threedivs";
import OutlineButton from "../../../utils/components/Buttons/OutlineButton";
import Users from "../../../utils/components/other components/Users";
import Button from "../../../utils/components/Buttons/Buttons";
import NotificationList from "../../../views/components/globalView/NotificationList";
import Dropdown from "../../../utils/components/other components/Dropdown";
import ModalComponent from "../../../utils/components/other components/Modal";
import Referential from "../../../utils/components/other components/Referential";
import UserLanding from "../../../views/components/globalView/UserLanding";
import MakeContribution from "../globalView/MakeContribution";
import { Bar } from "react-chartjs-2";
import ReportChart from "../../../utils/components/other components/ReportChart";
import Payouts from "../globalView/Payouts";


// list of users
const arrayn = [
  {
    id: 1,
    img: man,
    name: "N Michelle",
    date: "2024-08-24",
    status: "Active",
  },
  {
    id: 2,
    img: woman,
    name: "N Michelle",
    date: "2024-08-24",
    status: "Active",
  },
  {
    id: 3,
    img: man2,
    name: "N Michelle",
    date: "2024-08-24",
    status: "Active",
  },
  {
    id: 4,
    img: man3,
    name: "N Michelle",
    date: "2024-08-24",
    status: "Active",
  },
];

// const AddUserForm = () => {
//   ;

const President = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to manage form data
  const [formeData, setFormeData] = useState({
    username: "",
    email: "",
    role: "",
  });

  // Function to handle form submission
  const handleeSubmit = (e) => {
    e.preventDefault();
    console.log("User data:", formeData);
    // You can handle the submission (like sending data to an API) here

    // Reset form data after submission
    setFormeData({
      username: "",
      email: "",
      role: "",
    });

    // Close modal
    setIsModalOpen(false);
  };

  // Function to handle form input changes for user creation
  const handleInputChange = (e) => {
    setFormeData({
      ...formeData,
      [e.target.name]: e.target.value,
    });
  };

  // State to manage which page is active
  const [activePage, setActivePage] = useState("President"); // Default page is 'president page'

  // Function to render content based on the active page
  const renderPageContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <President />;
      case "Contribution":
        return <MakeContribution />;
      case "Payout":
        return <Payouts />;
      case "referentialcode":
        return <Referential />;
      case "userLanding":
        return <UserLanding />;
      case "notif":
        return <NotificationList />;
      default:
        return <President />;
    }
  };

  // suggestion icon
  let subtitle;
  const [dropIsOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [suggestionModal, setSuggestionModal] = useState(false);

  function openDrop() {
    setIsOpen(true);
  }

  function closeDrop() {
    setIsOpen(false);
  }

  const [formData, setFormData] = useState({
    firstName: "",
    // lastName: "",
    // email: "",
    // phone: "",
    message: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlesSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('User Data:', userData);
    // Add the logic to save the user (e.g., API call)
    // Reset form after submission
    setUserData({
      fullName: "",
      phoneNumber: "",
      email: "",
      contribution: "",
      frequency: "Monthly",
      role: "Participant",
    });
  };

  return (
    <>
      <div className="w-full h-[100%]  flex flex-col  bg-[#f5f5f5] ">
        {/* nav */}
        <nav className="w-[100%] h-[70px] flex justify-between flex-row items-center px-4 bg-white">
          {/* logo */}
          <img
            src={applog}
            style={{ height: 52, width: 52 }}
            className="rounded-full"
            alt=""
          />
          {/* text */}
          <ul className="flex flex-row gap-[70px] text-[#6c6a6a] w-[1000px]">
            <li>
              <a
                className={`${activeTab == "dashboard" ? "border-green-600 cursor-pointer border-b-2 p-4": ""}`}
                onClick={() => activeTab != 'dashboard' ? setActiveTab("dashboard") : console.log("clicked")}
              >
                Dashboard
              </a>
            </li>
            <li>
             <button>
             <a
                className={`${activeTab == "make-contributions" ? "border-green-600 cursor-pointer border-b-2 p-4": ""}`}
                onClick={() => activeTab != 'make-contributions' ? setActiveTab("make-contributions") : console.log("clicked")}
              >
                Contributions
              </a>
             </button>
            </li>
            <li>
             <button>
             <a
                className={`${activeTab == "payouts" ? "border-green-600 cursor-pointer border-b-2 p-4": ""}`}
                onClick={() => activeTab != 'payouts' ? setActiveTab("payouts") : console.log("clicked")}
              >
                Payouts
              </a>
             </button>
            </li>
          </ul>
          {/* Reference */}
          <Referential />
          {/* Page where every users land after creating or joining a group */}
          <button type="button">
            <a 
            onClick={() => activeTab != 'userlanding' ? setActiveTab("userlanding") : console.log("clicked")}>
              <img
                title="View tontine history"
                src={wallet}
                style={{ height: 28, width: 28 }}
                className="rounded-full"
                alt=""
              />
            </a>
          </button>
          {/* notif button */}
          <button type="button">
            <a 
            onClick={() => activeTab != 'notification' ? setActiveTab("notification") : console.log("clicked")}>
            {" "}
              <img
                title="Notifications"
                src={notif}
                style={{ height: 30, width: 30 }}
                className="rounded-full"
                alt=""
              />
            </a>
          </button>
          {/* President will recieve suggestions in the form of notifications */}

          <Dropdown />
        </nav>
        {/* Page Content */}
        { activeTab == "dashboard" && <>
          <div className="w-full h-[250px]">
          <div className="text-4xl font-medium size-5 w-[50%] h-[70px] p-3 mt-5">
            Enfant Lonako
          </div>
          {/* 4 coloured divs */}

          <div className="w-full p-3 grid grid-cols-1 md:grid-cols-4 gap-[64px]">
            <div className="bg-[#daf4fe] rounded-md flex flex-col md:flex-row p-3 items-center shadow-lg">
              <img
                src={member}
                style={{ height: 43, width: 43 }}
                className="rounded-full "
                alt=""
              />
              <div className="flex flex-col gap-2 ml-5">
                <span>Members</span>
                <span className="text-xl font-bold">20</span>
              </div>
            </div>

            <div className="bg-[#ffebe6] rounded-md flex flex-col md:flex-row p-3 items-center shadow-lg ">
              <img
                src={moneyweek}
                style={{ height: 43, width: 43 }}
                className="rounded-full "
                alt=""
              />
              <div className="flex flex-col gap-2 ml-5">
                <span>Amount/wk</span>
                <span className="text-xl font-bold">5,000Fcfa</span>
              </div>
            </div>

            <div className="bg-[#eaf3ff] rounded-md flex flex-col md:flex-row p-3 items-center shadow-lg ">
              <img
                src={moneypool}
                style={{ height: 43, width: 43 }}
                className="rounded-full "
                alt=""
              />
              <div className="flex flex-col gap-2 ml-5">
                <span>Amount/pool</span>
                <span className="text-xl font-bold">100,000Fcfa</span>
              </div>
            </div>
            <div className="bg-[#fff3e9] rounded-md flex flex-col md:flex-row p-3 items-center shadow-lg ">
              <img
                src={moneyyear}
                style={{ height: 43, width: 43 }}
                className="rounded-full "
                alt=""
              />
              <div className="flex flex-col gap-2 ml-5">
                <span>Amount/pool</span>
                <span className="text-xl font-bold">100,000Fcfa</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between w-[50%] p-3 my-5">
           <h3 className="text-2xl font-bold ">User List</h3>
          {/* add user but */}
          <div className="">
          <Button 
            style={"p-3 bg-[#3b9205] hover:bg-[#437622] focus:ring-4 focus:outline-none focus:ring-green-300"}
            text={"+ Add"}
            onClick={() => setIsModalOpen(true)}
            size={'w-[145px] h-[39px]'}
          />
            </div>
            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                  <h2 className="text-xl font-bold mb-4">Create New User</h2>
                  <form onSubmit={handleeSubmit}>
                    {/* Username Field */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formeData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formeData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    {/* Role Field */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formeData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* user list */}
        <div className="w-full p-3 flex flex-row gap-5 ">
          <Users users={arrayn} />
          
          {/* chart */}
          <ReportChart />
          </div>
        </>}
        {activeTab == "make-contributions" && <MakeContribution />}
        {activeTab == "payouts" && <Payouts />}
        {activeTab == "userlanding" && <UserLanding />}
        {activeTab == "notification" && <NotificationList />}
        {/* <div className="p-8">
        {renderPageContent()}
      </div> */}
      </div>
    </>
  );
};
export default President;
