import { Link } from "react-router-dom";
import { Input } from "../components";

export default function RegisterPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>
          <form>
            {/* Email field */}
            <div className="mb-4">
              <Input label="email" type="email" placeholder="Enter your email" />
            </div>
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
