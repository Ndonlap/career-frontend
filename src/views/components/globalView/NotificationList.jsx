import React, { useState, useEffect } from "react";
import { getConnectedUserDetail } from "../../../apis/notification";

const NotificationList = (id) => {
  // search bar
  const [searchTerm, setSearchItem] = useState("");

  const handleInputChange = (e) => {
    setSearchItem(e.target.value);
  };

  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const notificationsData = await getConnectedUserDetail();
      setFilteredNotifications([...notificationsData?.notifications]);
    }

    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);


  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="material-icons-outlined">notifications</span>
          <span className="text-xl font-semibold">List of Notifications</span>
        </div>
        {/* Three-dot dropdown icon */}
        <button
          className="relative"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="material-icons">more_vert</span>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Help
              </button>
              <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 mt-6">
        <p
          className={`px-4 py-2 rounded-full ${
            activeTab === "all"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {filteredNotifications?.length} Notifications
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mt-4">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search here ..."
          id="search-form"
          onChange={handleInputChange}
          className=" w-[80%] py-2 px-4 bg-gray-100 border rounded-full focus:outline-none focus:ring focus:ring-gray-200"
        />
      </div>

      {/* List of Notifications */}
      <div className="mt-8">
        {!searchTerm &&
          filteredNotifications?.map((notification) => (
            <div
              key={notification.id}
              className="flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`material-icons ${
                    notification.status === "new"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {notification.status === "new"
                    ? "fiber_manual_record"
                    : "star_outline"}
                </span>
                <p className="text-gray-700 text-sm">{notification.message}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {new Date(notification.createdDate).toLocaleDateString()}
                </span>
                <button className="text-red-500">
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}

        {searchTerm &&
          filteredNotifications
            .filter((item) => item?.message?.includes(searchTerm))
            ?.map((notification) => (
              <div
                key={notification.id}
                className="flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`material-icons ${
                      notification.status === "new"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {notification.status === "new"
                      ? "fiber_manual_record"
                      : "star_outline"}
                  </span>
                  <p className="text-gray-700 text-sm">
                    {notification.message}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdDate).toLocaleDateString()}
                  </span>
                  {/* {messages.map((message) => (
                    <li key={message.id}>
                      {message.text} */}
                      <button
                        className="text-red-500"
                        
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    {/* </li>
                  ))} */}
                </div>
              </div>
            ))}

        {/* If no notifications are available */}
        {filteredNotifications.length === 0 && (
          <p className="text-gray-600">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
