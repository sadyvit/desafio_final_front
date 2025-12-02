import { useState } from "react";
import { Link } from "react-router-dom";
import barraBranca from "../../../assets/barraBranca.svg";
import barraVerde from "../../../assets/barraVerde.svg";
import iconeMostrar from "../../../assets/icone-mostrar.svg";
import iconeOcultar from "../../../assets/icone-ocultar.svg";
import useGlobal from "../../../hooks/useGlobal";
import "./style.css";

function Senha({ nome, email, setEtapaSenha, setNome, setEmail }) {
  const [senha, setSenha] = useState("");
  const [senhaConfirmar, setSenhaConfirmar] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroRepitaSenha, setErroRepitaSenha] = useState("");
  const [ocultarSenha, setOcultarSenha] = useState(false);
  const [ocultarRepitaSenha, setOcultarRepitaSenha] = useState(false);
  const {
    exibirToast,
    setExibirToast,
    tipoMensagem,
    setTipoMensagem,
    mensagemToast,
    setMensagemToast,
  } = useGlobal();

  async function handleRegistroUsuario() {
    const body = {
      nome_usuario: nome,
      email: email,
      senha: senha,
    };
    try {
      const response = await fetch(`${process.env.API_URL}/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        setExibirToast(true);
        setTipoMensagem("erro");
        setMensagemToast(data);
        setEtapaSenha("segunda");
        return;
      }
      setEtapaSenha("terceira");
    } catch (error) {
      console.log(error);
    }
  }

  function handleClick() {
    if (!senha || senha.length < 5) {
      setErroSenha("A senha deve conter no minimo 5 caracteres");
      return;
    }
    if (senhaConfirmar != senha) {
      setErroRepitaSenha("As senhas não coincidem");
      return;
    }

    handleRegistroUsuario();
    setEtapaSenha(exibirToast ? "segunda" : "terceira");
    setEmail("");
    setNome("");
  }
  function handleChangeSenha(e) {
    setSenha(e.target.value);
    setErroSenha("");
  }
  function handleChangeRepitaSenha(e) {
    setSenhaConfirmar(e.target.value);
    setErroRepitaSenha("");
  }

  return (
    <>
      <div className="card-inputs">
        <h1>Escolha uma senha</h1>
        <div className={`container-senha`}>
          <label>Senha*</label>
          <input
            className={`login-input ${erroSenha && "erro-input"}`}
            type={ocultarSenha ? "text" : "password"}
            value={senha}
            onChange={handleChangeSenha}
          />
          <img
            className="icone-Olho"
            onClick={() => setOcultarSenha(!ocultarSenha)}
            src={ocultarSenha ? iconeMostrar : iconeOcultar}
            alt="Icone Olho"
          />
        </div>
        <div className="nao-tem-campo-senha">
          {erroSenha && <label className="erro">{erroSenha}</label>}
        </div>
        <div className={`container-repita-senha`}>
          <label>Repita a senha*</label>
          <input
            className={`login-input ${erroRepitaSenha && "erro-input"}`}
            type={ocultarRepitaSenha ? "text" : "password"}
            value={senhaConfirmar}
            onChange={handleChangeRepitaSenha}
          />
          <img
            className="icone-Olho"
            onClick={() => setOcultarRepitaSenha(!ocultarRepitaSenha)}
            src={ocultarRepitaSenha ? iconeMostrar : iconeOcultar}
            alt="Icone Olho"
          />
        </div>
        <div className="nao-tem-campo-repita-senha">
          {erroRepitaSenha && <label className="erro">{erroRepitaSenha}</label>}
        </div>
        <button className="btn" onClick={handleClick}>
          Entrar
        </button>
        <label className="label-cadastro">
          Já possui uma conta? Faça seu <Link to="/">Login</Link>
        </label>
        <footer>
          <div>
            <img
              onClick={() => setEtapaSenha("primeira")}
              className="footer-barra"
              src={barraBranca}
              alt="Barra-Verde"
            />
            <img className="footer-barra" src={barraVerde} alt="Barra-Branca" />
            <img
              className="footer-barra"
              src={barraBranca}
              alt="Barra-Branca"
            />
          </div>
        </footer>
      </div>
    </>
  );
}

export default Senha;
