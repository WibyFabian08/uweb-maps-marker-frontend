import React from "react";

const InputText = ({ name, value, onChange, placeholder, type }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-2 mb-3 border border-gray-300 rounded-lg borer-solid focus:outline-none"
    />
  );
};

export default InputText;
