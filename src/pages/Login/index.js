import "./styles.css";
import loginImg from "../../assets/loginImg.svg";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import ToastAlerta from "../../components/ToastAlerta";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  function goTo(path) {
    navigate(path);
  }

  useEffect(() => {
    let interval;
    if (auth.exibirToastLogin) {
      interval = setInterval(() => {
        auth.setExibirToastLogin(true);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [auth]);

  useEffect(() => {
    if (!auth.exibirToastLogin) return;
    const timeout = setTimeout(() => {
      auth.setExibirToastLogin(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [auth]);

  function handleClick() {
    if (!email) {
      setErroEmail("Este campo deve ser preenchido");
      return;
    }
    if (!senha) {
      setErroSenha("Este campo deve ser preenchido");
      return;
    }
    auth.signIn(email, senha, () => goTo("/home"));
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value || "");
    setErroEmail("");
  }
  function handleChangeSenha(e) {
    setSenha(e.target.value || "");
    setErroSenha("");
  }

  return (
    <>
      <div className="login">
        <div className="container-esquerda">
          <img src={loginImg} alt="Logo" />
        </div>
        <div className="container-direita">
          <div className="card-inputs">
            <h1>Faça seu login!</h1>
            <div className="container-email">
              <label>Email</label>
              <input
                className="login-input"
                type="text"
                placeholder="Digite seu e-mail"
                onChange={handleChangeEmail}
                value={email}
              />
              {erroEmail && <label className="erro">{erroEmail}</label>}
            </div>
            <div className="space-between">
              <label>Senha</label>
              <a href="#">Esqueceu a senha?</a>
            </div>
            <div className="container-email">
              <input
                className="login-input senha"
                type="password"
                placeholder="Digite sua senha"
                onChange={handleChangeSenha}
                value={senha}
              />
              {erroSenha && <label className="erro">{erroSenha}</label>}
            </div>
            <button className="btn" onClick={handleClick}>
              Entrar
            </button>
            <label>
              Ainda não possui uma conta?{" "}
              <Link to="/cadastro">Cadastre-se</Link>
            </label>
          </div>
        </div>
      </div>
      {auth.exibirToastLogin && (
        <ToastAlerta
          mensagemToast={auth.mensagemToastLogin}
          tipoMensagem={"erro"}
        />
      )}
    </>
  );
}

export default Login;
