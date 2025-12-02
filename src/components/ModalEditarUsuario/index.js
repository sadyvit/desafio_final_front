import "./styles.css";
import iconeFechar from "../../assets/icone-fechar.svg";
import iconeMostrar from "../../assets/icone-mostrar.svg";
import iconeOcultar from "../../assets/icone-ocultar.svg";
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import { useEffect, useState } from "react";

function ModalEditarUsuario() {
  const {
    setAbrirEditarUsuario,
    setAlteracaoUsuarioSucesso,
    inputUsuarioVazio,
    usuarioEdicao,
    setUsuarioEdicao,
    setExibirToast,
    setTipoMensagem,
    setMensagemToast,
  } = useGlobal();
  const [inputsEditarUsuario, setInputsEditarUsuario] =
    useState(inputUsuarioVazio);
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [tipoInputSenha, setTipoInputSenha] = useState("password");
  const {
    token,
    setNomeUsuarioHeader,
    setPrimeiraInicialHeader,
    setSegundaInicialHeader,
  } = useAuth();

  useEffect(() => {
    getUsuario();
  }, []);

  useEffect(() => {
    if (usuarioEdicao) {
      setInputsEditarUsuario({
        nome_usuario: usuarioEdicao.nome_usuario,
        email: usuarioEdicao.email,
        cpf: usuarioEdicao.cpf,
        telefone: usuarioEdicao.telefone,
      });
      return;
    }
  }, [usuarioEdicao]);

  function fecharModal() {
    setAbrirEditarUsuario(false);
    setTipoInputSenha("password");
  }

  function handleChange(event) {
    setInputsEditarUsuario({
      ...inputsEditarUsuario,
      [event.target.name]: event.target.value,
    });
    setErroNome("");
    setErroEmail("");
    setErroSenha("");
  }

  async function getUsuario() {
    try {
      const response = await fetch(`${process.env.API_URL}/usuario`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsuarioEdicao(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (inputsEditarUsuario.nome_usuario === "") {
      setErroNome("Este campo deve ser preenchido");
      setErroEmail(
        inputsEditarUsuario.email === "" && "Este campo deve ser preenchido"
      );
      setErroSenha("");
      return;
    }

    if (inputsEditarUsuario.email === "") {
      setErroEmail("Este campo deve ser preenchido");
      setErroNome(
        inputsEditarUsuario.nome_usuario === "" &&
          "Este campo deve ser preenchido"
      );
      setErroSenha("");
      return;
    }

    if (inputsEditarUsuario.senha !== inputsEditarUsuario.confirmarSenha) {
      setErroSenha("As senhas não coincidem");
      setErroNome("");
      setErroEmail("");
      return;
    }

    const body = {
      nome_usuario: inputsEditarUsuario.nome_usuario,
      email: inputsEditarUsuario.email,
      senha: inputsEditarUsuario.senha,
      cpf: inputsEditarUsuario.cpf,
      telefone: inputsEditarUsuario.telefone,
    };

    const response = await fetch(`${process.env.API_URL}/usuario`, {
      method: "PUT",
      headers: {
        "Content-type": "Application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast(data);
      return;
    }

    await getUsuario();
    setNomeUsuarioHeader(data[0].nome_usuario.split(" ")[0]);
    setPrimeiraInicialHeader(data[0].nome_usuario.split(" ")[0][0]);
    setSegundaInicialHeader(
      data[0].nome_usuario.split(" ").length >= 2
        ? data[0].nome_usuario.split(" ")[1][0]
        : ""
    );
    setAlteracaoUsuarioSucesso(true);
    fecharModal();
    setErroNome("");
    setErroEmail("");
    setErroSenha("");
  }

  return (
    <>
      <div className="modal-editar-usuario">
        <form onSubmit={handleSubmit} className="form-editar-usuario">
          <img
            onClick={fecharModal}
            src={iconeFechar}
            className={"btn-fechar-editar"}
            alt="Fechar"
          />
          <h3>Edite seu cadastro</h3>
          <div className="usuario-input-containers">
            <div className="usuario-input-container">
              <label htmlFor="nome_usuario">Nome*</label>
              <input
                type="text"
                name="nome_usuario"
                className={`form-editar-usuario-input ${
                  erroNome && "editar-usuario-erro"
                }`}
                value={inputsEditarUsuario.nome_usuario}
                onChange={handleChange}
                placeholder="Digite seu nome"
              />
              {erroNome && (
                <span className="erro-input-usuario">{erroNome}</span>
              )}
            </div>
            <div className="usuario-input-container">
              <label htmlFor="email">E-mail*</label>
              <input
                type="text"
                name="email"
                className={`form-editar-usuario-input ${
                  erroEmail && "editar-usuario-erro"
                }`}
                value={inputsEditarUsuario.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
              />
              {erroEmail && (
                <span className="erro-input-usuario">{erroEmail}</span>
              )}
            </div>

            <div className="usuario-input-cpf-telefone">
              <div className="usuario-input-container min-width-47">
                <label htmlFor="cpf">CPF</label>
                <input
                  className="form-editar-usuario-input"
                  type="text"
                  name="cpf"
                  value={inputsEditarUsuario.cpf}
                  onChange={handleChange}
                  placeholder="Digite seu CPF"
                />
              </div>
              <div className="usuario-input-container min-width-47">
                <label htmlFor="telefone">Telefone</label>
                <input
                  className="form-editar-usuario-input"
                  type="text"
                  name="telefone"
                  value={inputsEditarUsuario.telefone}
                  onChange={handleChange}
                  placeholder="Digite seu Telefone"
                />
              </div>
            </div>
            <div className="usuario-input-container input-senha-editar">
              <label htmlFor="senha">Nova Senha</label>
              <img
                onClick={() =>
                  setTipoInputSenha(
                    tipoInputSenha === "text" ? "password" : "text"
                  )
                }
                className="btn-ocultar-senha"
                src={tipoInputSenha === "text" ? iconeOcultar : iconeMostrar}
                alt=""
              />
              <input
                className="form-editar-usuario-input"
                type={tipoInputSenha}
                name="senha"
                value={inputsEditarUsuario.senha}
                onChange={handleChange}
              />
            </div>
            <div className="usuario-input-container input-senha-editar input-senha-confirmar">
              <label htmlFor="confirmarSenha">Confirmar Senha</label>
              <img
                onClick={() =>
                  setTipoInputSenha(
                    tipoInputSenha === "text" ? "password" : "text"
                  )
                }
                className="btn-ocultar-senha btn-ocultar-senha-repetida"
                src={tipoInputSenha === "text" ? iconeOcultar : iconeMostrar}
                alt=""
              />
              <input
                type={tipoInputSenha}
                name="confirmarSenha"
                className={`form-editar-usuario-input ${
                  erroSenha && "editar-usuario-erro"
                }`}
                value={inputsEditarUsuario.confirmarSenha}
                onChange={handleChange}
              />
              {erroSenha && (
                <span className="erro-input-usuario">{erroSenha}</span>
              )}
            </div>
            <button>Aplicar</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ModalEditarUsuario;
