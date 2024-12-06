import { Link } from "react-router-dom";
import { Input } from "../components";
import { useState } from "react";
import { registerUser } from "@/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterData = (e) => {
    e.preventDefault();
    // create a object and send to the register payload api
    const registerUserDetail = {
      email,
      username,
      password,
      role: "ADMIN",
    };
    registerUser(registerUserDetail);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>
          <form onSubmit={handleRegisterData}>
            {/* Email field */}
            <div className="mb-4">
              <Input label="email" type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
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
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Login
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
