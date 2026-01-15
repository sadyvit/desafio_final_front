import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import barraBranca from "../../../assets/barraBranca.svg";
import barraVerde from "../../../assets/barraVerde.svg";
import cadastrese from "../../../assets/cadastre-se.svg";
import cadastroRealizado from "../../../assets/cadastroRealizado.svg";
import escolhaSenha from "../../../assets/escolhaSenha.svg";
import useGlobal from "../../../hooks/useGlobal";
import ToastAlerta from "../../ToastAlerta";
import CadastroRealizado from "../CadastroRealizado/cadastroRealizado";
import Senha from "../Senha/senha";
import "./style.css";

function Cadastro() {
  const [etapaSenha, setEtapaSenha] = useState("primeira");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const { exibirToast, setExibirToast, tipoMensagem, mensagemToast } =
    useGlobal();

  const validateEmail = (email) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  };

  function handleClick() {
    if (!nome || nome.split("").every((letra) => letra === " ")) {
      setErroNome("Este campo deve ser preenchido");
      return;
    }
    if (!email) {
      setErroEmail("Este campo deve ser preenchido");
      return;
    }
    if (!validateEmail(email)) {
      setErroEmail("E-mail deve ser um e-mail valido");
      return;
    }

    setEtapaSenha("segunda");
  }

  useEffect(() => {
    let interval;
    if (exibirToast) {
      interval = setInterval(() => {
        setExibirToast(true);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [exibirToast, setExibirToast]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExibirToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [exibirToast, setExibirToast]);

  function handleChangeNome(e) {
    setNome(e.target.value);
    setErroNome("");
  }
  function handleChangeRepitaEmail(e) {
    setEmail(e.target.value);
    setErroEmail("");
  }

  return (
    <>
      <div className="cadastro">
        <div className="container-esquerda">
          {etapaSenha === "primeira" && (
            <img className="checkin" src={cadastrese} alt="Cadastre-se" />
          )}
          {etapaSenha === "segunda" && (
            <img className="checkin" src={escolhaSenha} alt="Escolha Senha" />
          )}
          {etapaSenha === "terceira" && (
            <img
              className="checkin"
              src={cadastroRealizado}
              alt="Escolha Senha"
            />
          )}
        </div>
        <div className="container-direita">
          {etapaSenha === "primeira" && (
            <div className="card-inputs">
              <h1>Adicione seus dados</h1>
              <div className="container-nome">
                <label>Nome*</label>
                <input
                  className={`login-input ${erroNome && "erro-input"}`}
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={handleChangeNome}
                />
                {erroNome && <label className="erro">{erroNome}</label>}
              </div>
              <div className="container-email">
                <label>Email*</label>
                <input
                  className={`login-input ${erroEmail && "erro-input"}`}
                  type="text"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={handleChangeRepitaEmail}
                />
                {erroEmail && <label className="erro">{erroEmail}</label>}
              </div>
              <button className="btn" onClick={handleClick}>
                Continuar
              </button>
              <label className="label-cadastro">
                Já possui uma conta? Faça seu{" "}
                <Link className="login-link" to="/">
                  Login
                </Link>
              </label>
              <footer>
                <div>
                  <img
                    className="footer-barra"
                    src={barraVerde}
                    alt="Barra-Verde"
                  />
                  <img
                    className="footer-barra"
                    src={barraBranca}
                    alt="Barra-Branca"
                  />
                  <img
                    className="footer-barra"
                    src={barraBranca}
                    alt="Barra-Branca"
                  />
                </div>
              </footer>
            </div>
          )}
          {etapaSenha === "segunda" && (
            <Senha
              setEtapaSenha={setEtapaSenha}
              nome={nome}
              setNome={setNome}
              email={email}
              setEmail={setEmail}
            />
          )}
          {exibirToast === false && etapaSenha === "terceira" && (
            <CadastroRealizado setEtapaSenha={setEtapaSenha} />
          )}
        </div>
      </div>
      {exibirToast && (
        <ToastAlerta
          mensagemToast={mensagemToast}
          tipoMensagem={tipoMensagem}
        />
      )}
    </>
  );
}

export default Cadastro;
