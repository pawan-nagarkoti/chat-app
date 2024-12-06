import React from "react";

export default function Input({ label = "", type = "", placeholder = "" }) {
  return (
    <>
      <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        id="username"
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </>
  );
}
