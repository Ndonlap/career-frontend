import React, { useState, ChangeEvent } from "react";
import kid from "../../../assets/images/kid.jpg";
import applogo from "../../../assets/images/applogo.png";
import Button from "../../../utils/components/Buttons/Buttons";

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPass: string;
  dob: string;
  phone: string;
}

const Signup: React.FC = () => {
  const backgroundImage = {
    backgroundImage: `url(${kid})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
  } as React.CSSProperties;

  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    confirmPass: "",
    dob: "",
    phone: "",
  });

  const [msg, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [nic, setNIC] = useState<File | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("data", data);

      if (data.message) {
        setMessage(data.message);

        if (nic) {
          const nicFormData = new FormData();
          nicFormData.append("images", nic);

          try {
            const uploadResponse = await fetch(`http://localhost:5000/api/uploadFile/${data.userId}`, {
              method: "POST",
              body: nicFormData,
            });

            const uploadResult = await uploadResponse.json();
            console.log(uploadResult);
            setStatus("OK");

            if (uploadResult.message) {
              setTimeout(() => {
                window.location.href = "/login";
              }, 2000);
            }
          } catch (err) {
            console.error(err);
            setMessage("File upload failed");
            setStatus("error");
          }
        }
      } else {
        setMessage(data.error);
        setStatus("error");
      }
    } catch (e) {
      console.error(e);
      setMessage("Verify your internet connection");
      setStatus("error");
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-cover">
      <div className="flex flex-row border-none w-[80%] h-[85%] rounded-xl shadow-2xl">
        <div className="flex justify-center items-center bg-[#f6e9e9e3] rounded-l-lg p-5 w-[85%]">
          <form className="rounded-lg h-full w-[90%] flex flex-col justify-between p-3">
            <div className="flex items-center justify-between space-x-3">
              <button>
                <img src={applogo} alt="App Logo" className="w-[80px] h-[80px] rounded-3xl ml-0" />
              </button>
              <div className={`text-[13px] ${status === "OK" ? "text-green-600" : "text-red-500"}`}>
                <p>{msg}</p>
              </div>
            </div>
            <h1 className="font-bold">Sign Up</h1>
            <span>Let's start with some facts about you.</span>

            {[
              { name: "name", label: "Full name", type: "text" },
              { name: "email", label: "Email address", type: "email" },
              { name: "phone", label: "Phone", type: "text" },
              { name: "password", label: "Password", type: "password" },
              { name: "confirmPass", label: "Confirm Password", type: "password" },
              { name: "dob", label: "Date of birth", type: "date" },
            ].map((field) => (
              <div key={field.name} className="relative z-0 w-[80%] mt-2">
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleInputChange}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  {field.label}
                </label>
              </div>
            ))}

            <div className="relative z-0 w-[30%] mt-1">
              <input
                type="file"
                onChange={(e) => setNIC(e.target.files?.[0] || null)}
              />
              <label className="absolute text-sm text-gray-500 top-3 -z-10">NIC</label>
            </div>

            <Button text="Sign up" size="w-[80%] mt-9" type="button" onClick={handleSubmit} />
            <p className="text-sm w-[300px] mt-2">
              Already have an account? <a href="/login" className="ml-5 text-[#c92a2a] underline">Login</a>
            </p>
          </form>
        </div>
        <div style={backgroundImage} className="rounded-r-lg"></div>
      </div>
    </div>
  );
};

export default Signup;
