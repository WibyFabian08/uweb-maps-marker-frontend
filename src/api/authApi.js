import axios from "axios";
import Swal from "sweetalert2";

export const login = (
  data,
  setErrorMessage,
  setActiveUser,
  setShowLogin,
  setLoginBody,
  loginBody
) => {
  axios
    .post("http://localhost:3000/api/users/login", data)
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setErrorMessage(null);
      setActiveUser(res.data.user);
      setShowLogin(false);
      setLoginBody({
        ...loginBody,
        email: "",
        password: "",
      });
    })
    .catch((err) => {
      setErrorMessage(err?.response?.data?.message);
      setLoginBody({
        ...loginBody,
        password: "",
      });
    });
};

export const register = (
  data,
  setShowRegister,
  setErrorMessage,
  setRegisterBody,
  registerBody
) => {
  axios
    .post("http://localhost:3000/api/users/register", data)
    .then((res) => {
      console.log(res.data);
      Swal.fire("Register success, please Login!!");
      setShowRegister(false);
      setErrorMessage(null);
      setRegisterBody({
        ...registerBody,
        username: "",
        email: "",
        password: "",
      });
    })
    .catch((err) => {
      console.log(err?.response?.data?.message);
      setErrorMessage(err?.response?.data?.message);
      setRegisterBody({
        ...registerBody,
        password: "",
      });
    });
};
