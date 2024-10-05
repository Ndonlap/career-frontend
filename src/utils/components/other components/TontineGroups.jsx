import React, { useState, useEffect } from "react";
import applog from "../../../assets/images/applog.png";
import notif from "../../../assets/images/notif.jpg";
import { useNavigate } from "react-router";
import { getTontineByMember } from "../../../apis/tontine";


const cardsStyle = [
  {
    bgColor: "bg-amber-50",
    arrowColor: "text-amber-400",
  },
  {
    bgColor: "bg-green-50",
    arrowColor: "text-green-400",
  },
  {
    bgColor: "bg-blue-50",
    arrowColor: "text-blue-400",
  },
  {
    bgColor: "bg-teal-50",
    arrowColor: "text-teal-400",
  },
  {
    bgColor: "bg-amber-50",
    arrowColor: "text-amber-400",
  },
];

const TontineGroups = () => {
  
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  useEffect(()=>{
    async function fetchData(){
      const tontineGroupsData = await getTontineByMember();
      setCards(tontineGroupsData?.tontine);
    }

    fetchData();
  },[])
  return (
    <div className="flex flex-col">
      <nav className="w-[100%] h-[70px] flex justify-between flex-row items-center px-5  bg-white ">
        {/* logo */}
        <img
          src={applog}
          style={{ height: 48, width: 48 }}
          className="rounded-full"
          alt=""
        />
        {/* text */}
        <ul className="flex flex-row gap-[90px] text-[#6c6a6a] w-[1000px] ">
          <li>
            <a
              className="hover:underline  hover:decoration-green-500"
              href="/UserLanding"
            >
              Dashboard
            </a>
          </li>
        </ul>
        {/* notif button */}
        <div className="  flex flex-row items-center justify-between  ">
          <button type="button">
            {" "}
            <a href="/NotificationList">
              <img
                title="Notifications"
                src={notif}
                style={{ height: 30, width: 30 }}
                className="rounded-full"
                alt=""
              />
            </a>
          </button>
        </div>
        <button className="michelle text-[#f5f5f5] px-3 py-1 bg-blue-900 border-[#3b9205] border-2 rounded-full hover:pointer hover:bg-white hover:text-[#1a5cb9]">
          <a href="/Userdecision">Make a choice</a>
        </button>
      </nav>
      <div className="h-[20%] bg-gray-100 p-6 flex flex-row gap-6">
        {cards?.map((card, index) => (
          <div
            key={index}
            // Attach the onClick only if the card is "Tontine Groups"
            // Add navigation only to Tontine Groups card
            className={`hover:cursor-pointer sm:w-1/2 lg:w-1/4 p-4 rounded-lg shadow-md flex flex-col justify-between ${cardsStyle[index % 5]?.bgColor}`}
            onClick={()=>{
              navigate(`/Member/${card?._id}`)
            }}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{card?.name}</h2>
              <div
              // className={`flex items-center justify-center w-6 h-8 rounded-full bg-white ${card.arrowColor}`}
              ></div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl font-bold">{card?.paymentSchedule}</h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className={`font-semibold ${cardsStyle[index % 5]?.arrowColor}`}>
                  {card?.contributionAmount}
                </span>{" "}
                {card?.changeText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default TontineGroups;
