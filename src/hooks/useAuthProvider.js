import { useState } from "react";
import { useLocalStorage } from "react-use";

export default function useAuthProvider() {
  const [token, setToken, removeToken] = useLocalStorage("Token", null);
  const [nomeUsuarioHeader, setNomeUsuarioHeader, removeNomeUsuarioHeader] =
    useLocalStorage("nomeUsuarioHeader", null);
  const [
    primeiraInicialHeader,
    setPrimeiraInicialHeader,
    removePrimeiraInicialHeader,
  ] = useLocalStorage("primeiraInicialHeader", null);
  const [
    segundaInicialHeader,
    setSegundaInicialHeader,
    removeSegundaInicialHeader,
  ] = useLocalStorage("segundaInicialHeader", null);
  const [exibirToastLogin, setExibirToastLogin] = useState(false);
  const [tipoMesagemLogin, setTipoMensagemLogin] = useState("");
  const [mensagemToastLogin, setMensagemToastLogin] = useState("");

  async function signIn(email, senha, callback) {
    try {
      const body = {
        email: email,
        senha: senha,
      };

      const response = await fetch(`${process.env.API_URL}/login`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setExibirToastLogin(true);
        setTipoMensagemLogin("erro");
        setMensagemToastLogin(data);
        return;
      }
      setNomeUsuarioHeader(data.usuario.nome_usuario.split(" ")[0]);
      setPrimeiraInicialHeader(data.usuario.nome_usuario.split(" ")[0][0]);
      setSegundaInicialHeader(
        data.usuario.nome_usuario.split(" ").length >= 2
          ? data.usuario.nome_usuario.split(" ")[1][0]
          : ""
      );
      setToken(data.token);
      callback();
    } catch (error) {
      setExibirToastLogin(true);
      setTipoMensagemLogin("erro");
      setMensagemToastLogin(error.message);
      return;
    }
  }

  function logout(callback) {
    setToken(null);
    removeToken();
    removeNomeUsuarioHeader();
    removePrimeiraInicialHeader();
    removeSegundaInicialHeader();
    callback();
  }

  return {
    token,
    setToken,
    signIn,
    logout,
    nomeUsuarioHeader,
    setNomeUsuarioHeader,
    primeiraInicialHeader,
    setPrimeiraInicialHeader,
    segundaInicialHeader,
    setSegundaInicialHeader,
    exibirToastLogin,
    setExibirToastLogin,
    tipoMesagemLogin,
    setTipoMensagemLogin,
    mensagemToastLogin,
    setMensagemToastLogin,
  };
}
