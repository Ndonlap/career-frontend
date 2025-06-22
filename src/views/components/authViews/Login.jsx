import React, { useState } from "react";
import applo from "../../../assets/images/applo.jpg";
// import Modal from "../../components/Modal";
import "../../../assets/css/auth-styles/login.css";
import CheckboxWithTerms from "../../../utils/components/other components/CheckboxWithTerms.jsx";
import Button from "../../../utils/components/Buttons/Buttons.jsx";
import Modal from "react-modal";
import OutlineButton from "../../../utils/components/Buttons/OutlineButton";
import Swal from "sweetalert2";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
// Setups for popover modal
Modal.setAppElement("#root");

const Login = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [hide, setHide] = useState(false);
  const [enable, setEnable] = useState("disabled");
  // const [msg, setMessage] = useState('')
  // const [status, setStatus] = useState('')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [msg, setMessage] = useState("");
  const [status, setStatus] = useState("");
  // check if the user agree
  const [agree, setAgree] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
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
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  const test = () => {
    console.log("test");
  };

  function closeModal() {
    setIsOpen(false);
  }
  // to handle submit of the creation form
  const handleSubmit = async () => {
    if (!agree) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "You must agree to the terms and conditions.",
      });
      return;
    }

    const { email, password } = formData;

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("data", data);

      if (data.token) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        // Save user and token
        sessionStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("tonti_token", data.token);

        // Check if user is verified
        window.location.href = "/verify"; // Redirect to verify code
        // if (data.accountType === "Admin" || data.isLogin === true) {
        //   setTimeout(() => {
        //     window.location.href = "/verify"; // Go to dashboard
        //   }, 1500);
        // } else {
        //   setTimeout(() => {
        //     window.location.href = "/verify"; // Redirect to verify code
        //   }, 1500);
        // }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.error || "Invalid email or password.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: data.error || "Invalid email or password.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#0f172f]">
      <div className="w-full h-full bg-white flex items-center justify-center">
        <form className="w-[90%] md:w-[30%] h-auto py-8 px-6 shadow-2xl rounded-3xl flex flex-col items-center gap-6">
          {/* Logo and Greeting */}
          <div className="flex flex-col items-center">
            <img
              src={applo}
              alt="App Logo"
              className="h-[100px] w-[100px] rounded-full"
            />
            <h1 className="text-3xl font-bold font-times mt-4">Welcome Back</h1>
            <p className="text-xs font-times text-center">
              Glad to see you again. Login to your account below.
            </p>
          </div>

          {/* Email Input */}
          <div className="w-full px-2">
            <label htmlFor="email" className="block text-sm mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="rounded-lg shadow-lg h-[45px] w-full bg-[#f9fafb] outline-none px-3"
              required
            />
          </div>

          {/* Password Input */}
          <div className="w-full px-2">
            <label
              htmlFor="password"
              className="block text-sm mb-1 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="rounded-lg shadow-lg h-[45px] w-full bg-[#f9fafb] outline-none px-3"
              required
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <CheckboxWithTerms
            agree={agree}
            setAgree={setAgree}
            openModal={openModal}
            check={true}
          />

          {/* Modal for Terms */}
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Terms and Conditions"
          >
            <div className="p-4 max-w-2xl max-h-full">
              <div className="bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Terms and Conditions
                  </h3>
                  <button
                    onClick={() => {
                      closeModal();
                      setHide(true);
                    }}
                    type="button"
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-4 text-justify text-gray-500 dark:text-gray-400">
                  <p>
                    - By accessing or using this website, you agree to be bound
                    by these terms and conditions. Users are prohibited from
                    using this website for any illegal or unauthorized purposes.
                    You are responsible for maintaining the confidentiality of
                    your account information, including your password.
                  </p>
                  <p>
                    - Information about who owns the website content, including
                    text, images, logos, code, etc. You may want to reserve all
                    rights to this content unless explicitly stated otherwise.
                    This includes limiting liability for issues like accuracy of
                    information, downtime, or third-party damages. You agree to
                    indemnify and hold TontiTrack harmless from any claims.
                  </p>
                </div>

                <div className="flex justify-end p-4 border-t dark:border-gray-600 gap-2">
                  <Button
                    type="button"
                    text={"I Accept"}
                    onClick={() => {
                      setAccepted(true);
                      closeModal();
                      setHide(false);
                    }}
                  />
                  <OutlineButton
                    text={"Decline"}
                    onClick={() => {
                      setAccepted(false);
                      closeModal();
                      setHide(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>

          {/* Login Button */}
          <Button
            text={"Login"}
            size={"w-[80%] h-[40px]"}
            type="button"
            onClick={handleSubmit}
          />

          {/* Sign Up Link */}
          <div className="text-xs text-center">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-[#3b7417] underline">
                Sign up now
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
