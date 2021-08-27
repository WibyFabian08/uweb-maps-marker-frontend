import React from "react";
import InputText from "../elements/InputText";

const LoginForm = ({ onClick, value, onChange, handleLogin, errorMessage }) => {
  return (
    <div className="relative p-5 bg-white rounded-lg" style={{ width: 300 }}>
      <h2
        className="absolute px-3 py-1 text-white bg-black rounded-full -top-1 -right-1 opacity-70"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        x
      </h2>
      <div className="flex flex-col justify-center mt-5">
        <h2 className="mb-5 text-xl text-center">Login</h2>
        <InputText
          name="email"
          placeholder="Email"
          type="text"
          value={value.email}
          onChange={onChange}
        ></InputText>
        <InputText
          name="password"
          placeholder="Password"
          type="password"
          value={value.password}
          onChange={onChange}
        ></InputText>
        {
          errorMessage && <p className="mb-2 text-sm text-red-400">{errorMessage}</p>
        }
        <button
          className="py-2 text-white transition-all duration-300 bg-indigo-700 rounded-lg hover:bg-indigo-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
