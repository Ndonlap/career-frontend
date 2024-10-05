import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import mtn from "../../../assets/images/mtn.png";
import orange from "../../../assets/images/orange2.png";
// import { FaReact } from 'react-icons/fa'; // React icon from react-icons
import add from "../../../assets/images/add.png";

const OnlineaccountCon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [referentialCode, setReferentialCode] = useState("");
  const [isMtn, setIsMtn] = useState(false);
  const [isOrange, setIsOrange] = useState(false);
  const [data, setData] = useState({
    phone: "",
    amount: 100,
  });
  const [success, setSuccess] = useState("");
  const [respond, setRespond] = useState("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");

  const getTel = (number) => {
    const orangeRegex = /^6(5[5-9]|9[0-9]|8[5-9])[0-9]{6}$/;
    const mtnRegex = /^6(5[0-4]|[7-8]|[0-4])[0-9]{6}$/;
    if (orangeRegex.test(number)) {
      return "orange";
    } else if (mtnRegex.test(number)) {
      return "mtn";
    } else {
      return "";
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setRespond("");
    setWarning("");
    if (data.phone === "") {
      setRespond("Enter a phone number for payment");
      return;
    } else {
      try {
        await fetch(`http://localhost:5000/api/payment`, {
          method: "post",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            accept: "application/json",
            "access-control-origin": "*",
            Authorization: `Bearer ${localStorage.getItem("tonti_token")}`,
          },
          body: JSON.stringify({
            phone: data.phone,
            amount: data.amount,
          }),
        })
          .then((res) => res.json())
          .then((respond) => {
            // console.log(respond)
            if (respond.statusError) {
              setRespond(respond.message);
            } else if (respond.error_code) {
              setRespond(respond.message);
            } else if (respond.status) {
              if (respond.status === "PENDING") {
                setWarning("valid transaction on your phone");
                checkResponse(respond.reference);
              } else {
                setRespond("Transaction failed please start back");
              }
            } else {
              setWarning(
                "operator " +
                  respond.operator +
                  " Press " +
                  respond.ussd_code +
                  " on your phone and valid transaction"
              );
              checkResponse(respond.reference);
            }
          })
          .catch((err) => {
            setError("internet problem");
          });
      } catch (e) {
        setError("Verify your internet connection");
      }
    }
  };
  function checkResponse(id) {
    const attemptPayment = async (transID) => {
      // console.log(transID);
      try {
        let resp = await fetch(`http://localhost:5000/api/verify/${transID}`, {
          method: "put",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            "access-control-origin": "*",
            Authorization: `Bearer ${localStorage.getItem("tonti_token")}`,
          },
          body: JSON.stringify({
            phone: data.phone,
            amount: data.amount,
          }),
        })
          .then((res) => res.json())
          .then((respond) => {
            return respond;
          })
          .catch((err) => {
            return false;
          });
        return resp;
      } catch (e) {
        setError("Verify your internet connection");
        return false;
      }
    };
    let attempts = 0; // Initialize attempts counter outside the interval
    let maxAttempts = 7; // Set maximum attempts
    const intervalId = setInterval(async () => {
      let payResponse = await attemptPayment(id);
      if (payResponse) {
        let status = payResponse.status;
        if (status === "FAILED") {
          clearInterval(intervalId);
          setError("");
          setSuccess("");
          setRespond("");
          setWarning("");
          setRespond(payResponse.reason);
          return {
            message: payResponse.reason,
          };
        }
        if (status === "SUCCESSFUL") {
          clearInterval(intervalId);
          setError("");
          setSuccess("");
          setRespond("");
          setWarning("");
          setSuccess("Your contribution has being accepted");
          setTimeout(() => {
            togglePopup();
            window.location.reload()
            navigate("/UserLanding", { replace: true });
          }, 2000);
          return {
            message: "accept successful",
          };
        }
      }
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(intervalId);
        setError("");
        setSuccess("");
        setRespond("");
        setWarning("");
        setError("timeout");
        return {
          message: "Transaction Failed",
        };
      }
    }, 20000);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log("name: ", value);

    if (name == "phone") {
      const oper = getTel(value);
      if (oper == "orange") {
        setIsMtn(false);
        setIsOrange(true);
      }
      if (oper == "mtn") {
        setIsOrange(false);
        setIsMtn(true);
      }
    }
    setData((prevData) => {
      let newData = {
        ...prevData,
        [name]: value,
      };
      return newData;
    });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        title="Add in your online account"
        src={add}
        style={{ height: 30, width: 30 }}
        className="cursor-pointer hover:scale-110 transition-transform"
        alt=""
        onClick={togglePopup}
      />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={togglePopup}
            >
              <AiOutlineClose className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              Add money in your online account
            </h2>
            <form onSubmit={handleSubmit}>
              {error ? (
                <center style={{ color: "darkred" }}>
                  {error} &nbsp;
                  <i
                    className="fas fa-wifi"
                    style={{ textDecoration: "line-through", color: "darkred" }}
                  ></i>
                </center>
              ) : (
                ""
              )}
              <center>
                {respond !== "" ? (
                  <span style={{ color: "darkred" }}>{respond}</span>
                ) : (
                  ""
                )}
                {warning !== "" ? (
                  <span style={{ color: "goldenrod" }}>{warning}</span>
                ) : (
                  ""
                )}
                {success !== "" ? (
                  <span style={{ color: "green" }}>{success}</span>
                ) : (
                  ""
                )}
              </center>
              <div className="flex flex-row justify-between items-center border border-gray-300 rounded p-2 w-full mb-4 h-12">
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={data.phone}
                  // value={referentialCode}
                  // onChange={(e) => setReferentialCode(e.target.value)}
                  className="w-[90%]  "
                  onChange={handleInputChange}
                  required
                />
                {isOrange && (
                  <img
                    src={orange}
                    alt=""
                    className="h-[40px] w-[50px] rounded-xl "
                  />
                )}
                {isMtn && (
                  <img
                    src={mtn}
                    alt=""
                    className="h-[40px] w-[50px] rounded-xl "
                  />
                )}
              </div>
              <input
                type="number"
                placeholder="Enter the amount"
                min={10}
                onChange={handleInputChange}
                name="amount"
                value={data.amount}
                className="border border-gray-300 rounded p-2 w-full mb-4"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition-colors w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineaccountCon;
