import React, { useState } from "react";
import CheckboxWithTerms from "../../../utils/components/other components/CheckboxWithTerms";
import OutlineButton from "../../../utils/components/Buttons/Buttons";
import Button from "../../../utils/components/Buttons/Buttons";
import FileUploadButton from "../../../utils/components/other components/FileUploadButton";
import Modal from "react-modal";
import Save from "../../../assets/images/save.jpg";


// Setups for popup modal
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
Modal.setAppElement("#root");
const Creationform = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [hide, setHide] = useState(false);
  const [enable, setEnable] = useState("disabled");
  const [dataForm, setFormData] = useState({
    name: "",
    desc: "",
    amount: 0,
    schedule: "Sunday"
  })
  const [msg, setMessage] = useState('')
  const [status, setStatus] = useState('')
  // check if the user agree 
  const [agree, setAgree] = useState(false)
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }
  // to handle submit of the creation form
  const handleSubmit = async () => {
    if(agree){
  //  console.log(data.token);
    console.log(dataForm);
    await fetch(`http://localhost:5000/api/tontine/createTontine`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'accept': 'applicaion/json',
        'access-control-origin': '*',
        'authorization': `Bearer ${localStorage.getItem('tonti_token')}`

      },
      body: JSON.stringify({
        name: dataForm.name,
        description: dataForm.desc,
        contributionAmount: dataForm.amount,
        paymentSchedule: dataForm.schedule,
      }),
    })
      .then(res => res.json())
      .then(async (data) => {
        console.log("data", data)
        if (data.message) {
          setMessage(data.message)
          setStatus("OK")
          setTimeout(() => {
            window.location.href = "/TontineGroups" // navigate to admin dashboard
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
    }
    else{
      setMessage("You must agree the terms and conditions")
      setStatus("error")
    }
  };

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="flex flex-col justify-center content-center items-center w-screen h-screen bg-cover bg-[#0f172f]">
        <div className=" w-[100vw] h-[100vh] bg-[#ffffff] border-none flex flex-col items-center justify-center ">
          <form className="w-[28%] h-[85vh] flex flex-col items-center justify-around shadow-2xl rounded-3xl p-2">
            <div className="w-[300px] text-xl text-center font-bold mt-2">
              CREATE A TONTINE GROUP?
            </div>
            <div className={`${status === "OK" ? 'text-green-600' : 'text-red-500'} text-[13px]`}>
              <p>{msg}</p>
            </div>
            {/* Input components */}
            <div className="relative z-0 w-[80%] mb-5">
              <div className="w-full">
                <input
                  type="text"
                  name="name"
                  id="tontine_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={dataForm.name}
                  onChange={(e) => setFormData({ ...dataForm, name: e.target.value })}
                  required
                />
                <label
                  for="tontine_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Tontine Name
                </label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 md:gap-6 w-[80%]">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  name="amount"
                  id="floating_amount"
                  className="block py-2.5 px-0 w-[80%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={dataForm.amount}
                  onChange={(e) => setFormData({ ...dataForm, amount: e.target.value })}
                  required
                />
                <label
                  for="floating_amount"
                  className="mb-5 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Contribution Amount{" "}
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <select
                  // type="text"
                  name="schedule"
                  id="floating_company"
                  className="block py-2.5 px-0 w-[80%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  value={dataForm.schedule}
                  onChange={(e) => setFormData({ ...dataForm, schedule: e.target.value })}

                >
                  <option value="Sunday">Sunday</option>
                  <option value="Sunday">Saturday</option>
                  <option value="Friday">Friday</option>
                  <option value="Wednesday">Thursday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Wednesday">Tuesday</option>
                  <option value="Wednesday">Monday</option>
                </select>
                <label
                  for="floating_company"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  payment schedule
                </label>
              </div>
            </div>
            <div className="relative z-0 w-[80%] mb-5">
              <div className="w-full">
                <textarea
                  type="text"
                  name="desc"
                  id="floating_desc"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={dataForm.desc}
                  onChange={(e) => setFormData({ ...dataForm, desc: e.target.value })}
                  required
                ></textarea>
                <label
                  for="floating_desc"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Tontine Description
                </label>
              </div>
            </div>
            {/* Upload file button */}
            {/* <FileUploadButton/> */}
            {/* referencial code */}

            {/* modal */}
            <CheckboxWithTerms 
            agree = {agree}
            setAgree = {setAgree}
            openModal={openModal} check = {true}/>
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Terms and Conditions"
            >
              <div id="default-modal" className="">
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Terms and Conditions
                      </h3>
                      <button
                        onClick={() => {
                          closeModal();
                          setHide(true);
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

                    <div className="p-4 md:p-5 space-y-4">
                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        - By using the Tontine Management Application, you agree to be bound by these terms and conditions.
                        If you do not agree, you must not use the application.<br />
                        - You are responsible for maintaining the confidentiality of your account information and password.
                        You agree to notify us immediately of any unauthorized use of your account.<br />
                        As a member of a tontine group, you agree to contribute the agreed-upon funds on time as per the groups terms.
                        Failure to meet your obligations may result in penalties, including exclusion from the group.<br />
                        You agree to make timely payments in accordance with your tontine group schedule. Any late payments may result in penalties or removal from the tontine group.
                        Transaction fees may apply for certain payment methods.
                      </p>
                      <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        The European Union's General Data Protection Regulation
                        (G.D.P.R.) goes into effect on May 25 and is meant to
                        ensure a common set of data rights in the European
                        Union. It requires organizations to notify users as soon
                        as possible of high-risk data breaches that could
                        personally affect them.
                      </p>
                    </div>

                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <Button
                        type="button"
                        text={"I accept"}
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
              </div>
            </Modal>
            {/* click on create group */}
            <Button text={"Create"} size={"w-[79%] h-[40px]"} type="button" onClick={handleSubmit} />
          </form>
        </div>
      </div>
    </>
  );
};

export default Creationform;
