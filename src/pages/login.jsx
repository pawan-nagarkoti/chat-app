import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components";

export default function LoginPage() {
  const navigate = useNavigate();
  const handleLoginFormSubmit = (e) => {
    e.preventDefault();
    navigate("/chat");
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
          <form onSubmit={handleLoginFormSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <Input label="Username" type="text" placeholder="Enter your username" />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <Input label="Password" type="password" placeholder="Enter your password" />
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
              Login
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
