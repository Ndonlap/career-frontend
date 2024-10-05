import React, { useState } from "react";
import porte from "../../../assets/images/porte.png";
import applog from "../../../assets/images/applog.png";
import Button from "../../../utils/components/Buttons/Buttons";

const Signup = () => {
  const backgroundImage = {
    backgroundImage: `url(${porte})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroupRepeat: "no-repeat",
    width: "100%",
    height: "100%",
  };

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPass: "",
    dob: "",
  });
  const [msg, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [nic, setNIC] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      let newData = {
        ...prevData,
        [name]: value,
      };
      return newData;
    });
  };

  const handleSubmit = async () => {
    await fetch(`http://localhost:5000/api/user/register`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        accept: "applicaion/json",
        "access-control-origin": "*",
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPass: formData.confirmPass,
        dob: formData.dob,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log("data", data);
        if (data.message) {
          setMessage(data.message);
          let formData = new FormData()
          formData.append("images", nic)
          await fetch(`http://localhost:5000/api/uploadFile/${data.userId}`, {
            method: 'Post',
            headers: {
              'access-control': '*',
            },
            body: formData,
          })
            .then(res => res.json())
            .then(async response => {
              console.log(response);
              setStatus("OK")
              if (response.message) {
                setTimeout(() => {
                  window.location.href = "/login"
                }, 2000)
              }
              setMessage(data.error)
              setStatus("error")
            })
            .catch(async err => {
              console.log(err);
              setMessage(data.error)
              setStatus("error")
            });
        } else {
          setMessage(data.error);
          setStatus("error");
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage("Verify your internet connection");
        setStatus("error");
      });
  };

  return (
    <div className="flex justify-center items-center  h-[100vh] m-0 bg-cover ">
      <div className="flex flex-row  border-none w-[80%] h-[85%] rounded-xl shadow-2xl">
        <div className="flex justify-center items-center bg-[#f0f6e9e3] rounded-l-lg  p-5 w-[85%] ">
          {/* Slide for the form */}
          <form className="rounded-lg h-[100%] w-[90%] ml-90 flex flex-col justify-between p-3">
            <div className="flex items-center justify-between space-x-3">
              <button>
                <img
                  src={applog}
                  alt=""
                  className="w-[80px] h-[80px] rounded-3xl ml-0 "
                />
              </button>
              <div
                className={`${
                  status === "OK" ? "text-green-600" : "text-red-500"
                } text-[13px]`}
              >
                <p>{msg}</p>
              </div>
            </div>
            <h1 className="weight-900">Sign Up</h1>
            <span>Let's start with some facts about you.</span>
            <div className="relative z-0 w-[80%] mt-2">
              <div className="w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Full name
                </label>
              </div>
            </div>
            <div className="relative z-0 w-[80%] mt-2">
              <div className="w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
              </div>
            </div>
            <div className="relative z-0 w-[80%] mt-2">
              <div className="w-full">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone
                </label>
              </div>
            </div>
            <div className="relative z-0 w-[80%] mt-2">
              <div className="w-full">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  id="floating_password"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_password"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
              </div>
            </div>
            <div className="relative z-0 w-[80%] mt-2">
              <div className="w-full">
                <input
                  type="password"
                  name="confirmPass"
                  id="floating_password"
                  onChange={handleInputChange}
                  value={formData.confirmPass}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_password"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Confirm Password
                </label>
              </div>
            </div>
            <div className="relative z-0 w-[80%] mt-5">
              <div className="w-full">
                <input
                  type="Date"
                  name="dob"
                  onChange={handleInputChange}
                  value={formData.dob}
                  id="floating_password"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  for="floating_password"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Date of birth
                </label>
              </div>
              <div className="relative z-0 w-[80%] mt-5">
                <div className="w-full ">
                  <input
                    type="file"
                    className="rounded-xl"
                    id="lastName"
                    name="lastName"
                    placeholder="Select NIC"
                    onChange={(e) => setNIC(e.target.files[0])}
                    required
                  />
                  {/* <label
                    for="floating_password"
                    className=" peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    NIC
                  </label> */}
                </div>
              </div>
            </div>

            {/* </div> */}
            {/* export const Profile = () => {
  const [dragging, setDragging] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0].code);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    // Handle file upload here
  };

  const handleBrowseClick = () => {
    document.getElementById("file-upload").click();
  };
return(<section className="bg-white p-6 shadow-md rounded-lg mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full mr-2">
              Step 3
            </span>
            <h3 className="text-lg font-bold flex items-center">Upload Your CV</h3>
          </div>
          <div
            className={border-2 border-dashed ${dragging ? "border-blue-500" : "border-gray-300"} p-8 rounded-lg text-center}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <img
                src="src/assets/images/file-icon.svg" // Replace with your file icon path
                alt="File Icon"
                className="h-12 mb-2"
              />
              <p className="text-gray-600">Drag and drop your files here</p>
              <p className="text-gray-500">or</p>
              <button
                type="button"
                onClick={handleBrowseClick}
                className="mt-4 rounded-lg bg-[rgba(239,146,115,1)] text-white px-4 py-2 "
              >
                Browse Files
              </button>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
);}; */}

            <Button
              text={"Sign up"}
              size={"w-[80%] mt-9"}
              type="button"
              onClick={handleSubmit}
            />
            <p className="text-s w-[300px] mt-2">
              Already have and account?{" "}
              <a href="/login" className="ml-5 text-[#04811fc1] underline">
                Login
              </a>
            </p>
          </form>
        </div>
        {/* Slide for the image */}
        <div style={backgroundImage} className="rounded-r-lg"></div>
      </div>
    </div>
  );
};

export default Signup;
