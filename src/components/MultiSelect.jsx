import React, { forwardRef } from "react";
import Select from "react-select";

const MultiSelect = forwardRef(({ options, onChange, placeholder }, ref) => {
  return (
    <Select
      ref={ref}
      isMulti
      options={options}
      onChange={onChange}
      placeholder={placeholder || "Select options"}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
});

export default MultiSelect;
