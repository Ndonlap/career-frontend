import React, { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

import kid from "../../../assets/images/kid.jpg";
import applogo from "../../../assets/images/applogo.png";
import Button from "../../../utils/components/Buttons/Buttons";
import AuthService from "../../../services/auth";
import FileService from "../../../services/file";

interface FormData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPass: string;
  dob: string;
  phone: string;
  role: "student" | "counselor" | "";
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPass: "",
    dob: "",
    phone: "",
    role: "student",
  });

  const [msg, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [nic, setNIC] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNIC(event.target.files[0]);
    } else {
      setNIC(null);
    }
  };

  const handleSubmit = async () => {
    setMessage("");
    setStatus("");
    setIsLoading(true);

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPass || !formData.phone || !formData.role) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill in all required fields." });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPass) {
      Swal.fire({ icon: "error", title: "Password Mismatch", text: "Passwords do not match." });
      setIsLoading(false);
      return;
    }

    try {
      const userDataToSend = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        dob: formData.dob,
      };

      const response = await AuthService.register(userDataToSend);
      const { user_id, msg: registerMsg } = response.data;
      
      setMessage(registerMsg || "Registration successful.");
      setStatus("OK");

      if (nic && user_id) {
        try {
          await FileService.uploadFile(nic, user_id, "nic_document");
          setMessage(prev => prev + " NIC uploaded successfully.");
        } catch (uploadError: any) {
          console.error("NIC upload failed:", uploadError);
          setMessage(prev => prev + " However, NIC upload failed: " + (uploadError.response?.data?.msg || uploadError.message));
          setStatus("error");
        }
      }

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You can now log in.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/login");
      });

    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.msg || error.message || "Registration failed. Please try again.";
      setMessage(errorMessage);
      setStatus("error");
      Swal.fire({ icon: "error", title: "Registration Failed", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-7/12 xl:w-8/12 p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <img 
                src={applogo} 
                alt="App Logo" 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl"
              />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">MyCareerCoach</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your career journey today</p>
          </div>

          {msg && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              status === "OK" 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {msg}
            </div>
          )}

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                </select>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: "first_name", label: "First Name", type: "text" },
                { name: "last_name", label: "Last Name", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: "email", label: "Email Address", type: "email" },
                { name: "phone", label: "Phone Number", type: "tel" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: "password", label: "Password", type: "password" },
                { name: "confirmPass", label: "Confirm Password", type: "password" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload NIC (National ID Card)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Submit Button */}
            <Button 
              text={isLoading ? "Creating Account..." : "Create Account"}
              size="w-full mt-2"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
            />

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-5/12 xl:w-4/12 hidden lg:block relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${kid})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
                <p className="text-blue-100">Join thousands of students and counselors building successful careers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;