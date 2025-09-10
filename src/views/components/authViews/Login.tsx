import React, { useState } from "react";
import Swal from "sweetalert2";

// Import the app logo and Button component
import applogo from "../../../assets/images/applogo.png";
import Button from "../../../utils/components/Buttons/Buttons";

// Type definition for the form data
interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // if (!agree) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Terms Required",
    //     text: "You must agree to the terms and conditions.",
    //   });
    //   return;
    // }

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

      if (data.token) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: data.message,
          timer: 1500,
          showConfirmButton: false,
        });

        sessionStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("tonti_token", data.token);

        window.location.href = "/verify";
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
        text: "Invalid email or password.",
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
              src={applogo}
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
            <label htmlFor="password" className="block text-sm mb-1 font-medium">
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

          {/* Optional: Terms agreement (checkbox) */}
          {/* Uncomment if you want to show the checkbox */}
          {/* <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-green-600"
            />
            <label>I agree to the Terms and Conditions</label>
          </div> */}

          {/* Login Button */}
          <Button
            text="Login"
            size="w-[80%] h-[40px]"
            type="button"
            onClick={handleSubmit}
            
          />

          {/* Sign Up Link */}
          <div className="text-xs text-center">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-[#c92a2a] underline">
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
