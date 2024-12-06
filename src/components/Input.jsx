import React, { useId, forwardRef } from "react";

const Input = forwardRef(({ label = "", type = "", ...props }, ref) => {
  const id = useId();

  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        ref={ref} // Forward the ref to the input element
        {...props}
        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </>
  );
});

export default Input;
