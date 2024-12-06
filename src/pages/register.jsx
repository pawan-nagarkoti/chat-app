import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components";
import { useState } from "react";
import { registerUser } from "@/api";
import { requestHandler } from "@/utils";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");

  const handleRegisterData = async (e) => {
    e.preventDefault();

    // Create an object to send to the register API
    const registerUserDetail = {
      email,
      username,
      password,
      role: "ADMIN",
    };

    // Use requestHandler to handle the API call
    await requestHandler(
      () => registerUser(registerUserDetail), // API call
      setLoading, // Set loading state
      (data) => {
        console.log("Registration successful:", data);
        alert("Registration successful!"); // Success message
        navigate("/login");
      },
      (error) => {
        console.error("Registration failed:", error);
        alert(error); // Error message
      }
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>
          <form onSubmit={handleRegisterData}>
            {/* Email field */}
            <div className="mb-4">
              <Input label="Email" type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            {/* Username Field */}
            <div className="mb-4">
              <Input label="Username" type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <Input label="Password" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className={`w-full py-2 rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white focus:outline-none focus:ring focus:ring-blue-300`}
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
          <div className="text-center mt-4">
            Already have an account? &nbsp;
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
