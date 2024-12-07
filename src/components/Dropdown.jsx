import React, { forwardRef } from "react";

const Dropdown = forwardRef(({ label = "Choose a car:", options = [], ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={props.id || "dropdown"} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        ref={ref}
        id={props.id || "dropdown"}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
        {...props}
      >
        {/* Placeholder option */}
        <option value="" disabled selected>
          Select User
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Dropdown.displayName = "Dropdown";

export default Dropdown;
