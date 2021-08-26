import React from "react";

const InputRating = ({ body, onChange, name }) => {
  return (
    <select
      name={name}
      value={body}
      onChange={onChange}
      className="px-4 py-2 mb-3 border border-gray-300 rounded-lg borer-solid focus:outline-none"
    >
      <option value="">Rating</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  );
};

export default InputRating;
