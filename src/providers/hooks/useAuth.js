import { useState, useEffect } from "react";

import api from "../../services/api";
import history from "../../services/history";

import isEmailValid from "../../utils/isEmailValid";
import isPasswordValid from "../../utils/isPasswordValid";

import { useModal } from "../ModalProvider";

import LoadingGif from "../../components/LoadingGif";

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [expirySession, setExpirySession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonChildren, setButtonChildren] = useState("Login");
  const { handleShowModal } = useModal();
  const [formValues, setFormValues] = useState({});

  const handleLogin = async (e) => {

    e.preventDefault();

    const { email, password } = e.target;

    if (!email.value || !password.value) {
      return handleShowModal("Preencha todos os campos");
    }

    if (!isEmailValid(email.value)) {
      return handleShowModal("Email/Senha Incorreto(s)");
    }

    const { result } = isPasswordValid(password.value);

    if (!result) {
      return handleShowModal("Email/Senha Incorreto(s)");
    }

    setButtonChildren(<LoadingGif />);

    await api
      .post("/user/login", {
        email: email.value,
        password: password.value,
      })
      .then(({ data }) => {
        setFormValues({});
        setButtonChildren("Login");
        localStorage.setItem("token", data.response);
        localStorage.setItem("tokenExpiryTime", new Date().setHours(new Date().getHours() + 2));
        api.defaults.headers = { "Authorization": `Bearer ${data.response}` };
        setAuthenticated(true);
        history.push("/tasks");
      })
      .catch(({ response }) =>
        response
          ? handleShowModal(response.data.response)
          : handleShowModal("Erro no Servidor, tente novamente mais tarde")
      );

      setButtonChildren("Login");
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiryTime");
    api.defaults.headers = { "Authorization": undefined };
    history.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpirytime = localStorage.getItem("tokenExpiryTime");

    if (token) {

      if(Date.now() < tokenExpirytime) {
        setAuthenticated(true);
      }else{
        setExpirySession(false);
        handleLogout();
      }
      
    }
    setLoading(false);
  }, []);

  return { 
    handleLogin, handleLogout, authenticated, loading, expirySession, setExpirySession, buttonChildren, formValues, setFormValues 
  };
};

export default useAuth;
