import React, { useState } from "react";
import applo from "../../../assets/images/applo.jpg";
// import Modal from "../../components/Modal";
import "../../../assets/css/auth-styles/login.css";
import CheckboxWithTerms from "../../../utils/components/other components/CheckboxWithTerms.jsx";
import Button from "../../../utils/components/Buttons/Buttons.jsx";
import Modal from "react-modal";
import OutlineButton from "../../../utils/components/Buttons/OutlineButton";

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
  const [hide, setHide] = useState(false)
  const [enable, setEnable] = useState('disabled');
  // const [msg, setMessage] = useState('')
  // const [status, setStatus] = useState('')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [msg, setMessage] = useState('')
  const [status, setStatus] = useState('')
  // check if the user agree 
  const [agree, setAgree] = useState(false)
  function openModal() {
    setIsOpen(true);
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => {
      let newData = {
        ...prevData,
        [name]: value
      }
      return newData
    })
  }
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
  }

  const test = () => {
    console.log('test');

  }

  function closeModal() {
    setIsOpen(false);
  }
   // to handle submit of the creation form
   const handleSubmit = async () => {
    if(agree){
  // const handleSubmit = async () => {
    await fetch(`http://localhost:5000/api/user/login`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'accept': 'applicaion/json',
        'access-control-origin': '*'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    })
      .then(res => res.json())
      .then(async (data) => {
        console.log("data", data)
        sessionStorage.setItem('user', JSON.stringify(data));
        if (data.token) {
          setMessage(data.message)
          setStatus("OK")
          await localStorage.setItem('tonti_token', data.token)
         
          
          setTimeout(() => {
            if (data.accountType === "Admin"){
              window.location.href = "/UserLanding" // navigate to admin dashboard
            }else{
              window.location.href = "/UserLanding" // navigate to  userLoading dashboard
            }
          }, 2000)
        } else {
          setMessage(data.error)
          setStatus("error")
        }
      })
      .catch(e => {
        console.log(e)
        setMessage("Verify your internet connection")
        setStatus("error")
      })
    }else{
      setMessage("You must agree the terms and conditions")
      setStatus("error")
    }
  }

  return (
    // Form start
    <div className="flex flex-col justify-center content-center items-center w-screen h-screen bg-cover bg-[#0f172f]">
      <div className=" w-[100vw] h-[100vh] bg-[#ffffff] border-none flex flex-col items-center justify-center ">
        <form
          className="w-[25%] h-[70vh] flex flex-col items-center justify-around shadow-2xl rounded-3xl"
        >
          <div className="flex flex-col items-center content-center justify-center ">
            <img
              src={applo}
              alt=""
              className="h-[100px] w-[100px] rounded-full "
            />
            <div className={`${status === "OK" ? 'text-green-600' : 'text-red-500'} text-[13px]`}>
              <p>{msg}</p>
            </div>
            <h1 className="text-4xl font-times">Welcome back</h1>
            <p className="font-times text-xs">
              Glad to see you again, Login to your account below.
            </p>
          </div>
          <div className="font-times text-14pt p-2 w-[80%]">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email..."
              className=" rounded-lg shadow-lg h-[55px] w-full border-none bg-[#f9fafb] outline-none p-2"
              required
            />
          </div>
          <div className="font-times text-14pt p-2 w-[80%]">
            <label htmlFor="">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password..."
              className="rounded-lg shadow-lg h-[55px] w-full border-none bg-[#f9fafb] outline-none p-2"
              required
            />
          </div>
          {/* Modal*/}
          <CheckboxWithTerms
           agree = {agree}
           setAgree = {setAgree}
           openModal={openModal} check = {true} />
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Terms and Conditions"
          >
            <div
              id="default-modal"
              className=""
            >
              <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Terms and Conditions
                    </h3>
                    <button
                      onClick={() => {
                        closeModal()
                        setHide(true)
                      }}
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="default-modal"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  <div className="p-6 md:p-5 space-y-4 text-justify">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      - By accessing or using this website, you agree to be bound by these terms and conditions.
                      Users are prohibited from using this website for any illegal or unauthorized purposes.You are responsible for maintaining
                      the confidentiality of your account information, including your password.

                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      -Information about who owns the website content, including text, images, logos, code, etc.
                      You may want to reserve all rights to this content unless explicitly stated otherwise.
                      A statement that limits the website owners liability for any issues that may arise from using the site.
                      This includes accuracy of information, downtime, or damages caused by third-party links.
                      You agree to indemnify and hold TontiTrack harmless from any claims arising from your use of this website.
                    </p>
                  </div>

                  <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <Button type="button" text={'I accept'} onClick={() => {
                      setAccepted(true)
                      closeModal()
                      setHide(false)
                    }} />
                    <OutlineButton text={"Decline"} onClick={() => {
                      setAccepted(false)
                      closeModal()
                      setHide(true)
                    }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          {/* Button and signup */}
          <Button text={"Login"} size={'w-[79%] h-[40px]'} type="button" onClick={handleSubmit} />
          <div className="flex flex-row justify-between align-center text-xs color-[black]">
            <p>Don't have and account?</p>
            <div className="ml-[5px] color-[#040681c1] no-underline">
              <h6>
                <a href="/signup" style={{ color: "#3b7417" }}>
                  {" "}
                  Sign up now
                </a>
              </h6>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;

