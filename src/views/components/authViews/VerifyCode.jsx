import React, { useState } from "react";
import Swal from "sweetalert2";
import applo from "../../../assets/images/applo.jpg";
import "../../../assets/css/auth-styles/login.css";
import Button from "../../../utils/components/Buttons/Buttons.jsx";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!code || code.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid Code",
        text: "Please enter a valid 6-digit code.",
      });
      return;
    }

    const token = localStorage.getItem("tonti_token");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/user/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("OK");
        setMessage(data.message);

        Swal.fire({
          icon: "success",
          title: "Verification Successful",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          if (data.accountType === "Admin") {
            window.location.href = "/dashboard"; // or any admin page
          } else if (data.accountType === "User") {
            window.location.href = "/UserLanding";
          } else {
            window.location.href = "/"; // fallback or default page
          }
        }, 1600);
      } else {
        setStatus("error");
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: data.error || "Verification failed.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Server error or network problem.",
      });
    } finally {
      setLoading(false);
    }
  };

  // New resend code function
  const handleResendCode = async () => {
    const token = localStorage.getItem("tonti_token");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/user/resend-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Code Sent",
          text: data.message || "Verification code resent to your email.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to resend",
          text: data.error || "Could not resend verification code.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Server error or network problem.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center content-center items-center w-screen h-screen bg-cover bg-[#0f172f]">
      <div className="w-[100vw] h-[100vh] bg-[#ffffff] border-none flex flex-col items-center justify-center">
        <form className="w-[25%] h-[65vh] flex flex-col items-center justify-around shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center justify-center">
            <img
              src={applo}
              alt="App Logo"
              className="h-[100px] w-[100px] rounded-full"
            />
            {msg && (
              <div
                className={`${
                  status === "OK" ? "text-green-600" : "text-red-500"
                } text-[13px]`}
              >
                <p>{msg}</p>
              </div>
            )}
            <h1 className="text-4xl font-times">Verify Account</h1>
            <p className="font-times text-xs text-center px-4">
              Enter the 6-digit code sent to your email to verify and complete
              login.
            </p>
          </div>
          <div className="font-times text-14pt p-2 w-[80%]">
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code..."
              className="rounded-lg shadow-lg h-[55px] w-full border-none bg-[#f9fafb] outline-none p-2 text-center tracking-widest font-mono"
              maxLength={6}
            />
          </div>
          <Button
            text={loading ? "Verifying..." : "Verify"}
            size={"w-[79%] h-[40px]"}
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          />
          <p className="text-xs mt-2">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-600 underline"
              disabled={loading}
            >
              Resend
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
