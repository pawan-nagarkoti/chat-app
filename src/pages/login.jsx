import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components";
import { useState } from "react";
import { requestHandler } from "@/utils";
import { loginUser } from "@/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();

    // Use requestHandler to handle the API call
    await requestHandler(
      () => loginUser({ username, password }),
      setLoading, // Set loading state
      (data) => {
        localStorage.setItem("token", data?.data?.accessToken);
        localStorage.setItem("loginUserId", data?.data?.user?._id);
        alert("Login successful!");
        navigate("/chat");
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
          <form onSubmit={handleLoginFormSubmit}>
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
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
          <div className="text-center mt-4">
            Don't have an account? &nbsp;
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
