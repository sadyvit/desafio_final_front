import "./styles.css";
import iconeFechar from "../../assets/icone-fechar.svg";
import iconeClientes from "../../assets/icone-clientes.svg";
import useGlobal from "../../hooks/useGlobal";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

function ModalCadastrarCliente({ getClientes }) {
  const {
    inputClienteVazio,
    setExibirToast,
    setMensagemToast,
    setTipoMensagem,
    fecharModalCadastrarCliente,
  } = useGlobal();
  const [inputsClientes, setInputsClientes] = useState(inputClienteVazio);
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [salvarDadosCliente, setSalvarDadosCliente] = useState(false);
  const { token } = useAuth();

  function limparErros() {
    setErroNome("");
    setErroEmail("");
    setErroCpf("");
    setErroTelefone("");
  }

  function setErros() {
    setErroNome(
      inputsClientes.nome_cliente === "" ? "Este campo deve ser preenchido" : ""
    );
    setErroEmail(
      inputsClientes.email === "" ? "Este campo deve ser preenchido" : ""
    );
    setErroTelefone(
      inputsClientes.telefone === "" ? "Este campo deve ser preenchido" : ""
    );
    setErroCpf(
      inputsClientes.cpf === "" ? "Este campo deve ser preenchido" : ""
    );
  }

  function cancelarCadastrarCliente(event) {
    event.preventDefault();
    setSalvarDadosCliente(false);
    fecharModalCadastrarCliente();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (salvarDadosCliente === false) return;

    if (
      inputsClientes.nome_cliente === "" ||
      inputsClientes.email === "" ||
      inputsClientes.cpf === "" ||
      inputsClientes.telefone === ""
    ) {
      setErros();
      return;
    }

    const novoCliente = {
      nome_cliente: inputsClientes.nome_cliente,
      email: inputsClientes.email,
      cpf: inputsClientes.cpf,
      telefone: inputsClientes.telefone,
      logradouro: inputsClientes.logradouro,
      complemento: inputsClientes.complemento,
      cep: inputsClientes.cep,
      bairro: inputsClientes.bairro,
      cidade: inputsClientes.cidade,
      estado: inputsClientes.estado,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/clientes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(novoCliente),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setExibirToast(true);
        setTipoMensagem("erro");
        setMensagemToast(data);
        return;
      }
      await getClientes();
      setExibirToast(true);
      setTipoMensagem("sucesso");
      setMensagemToast("Cadastro concluído com sucesso");
      limparErros();
      fecharModalCadastrarCliente();
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(event) {
    setInputsClientes({
      ...inputsClientes,
      [event.target.name]: event.target.value,
    });
    limparErros();
  }

  return (
    <>
      <div className="modal-cadastrar-cliente">
        <form onSubmit={handleSubmit} className="form-cadastrar-cliente">
          <img
            onClick={fecharModalCadastrarCliente}
            src={iconeFechar}
            className={"btn-fechar-cadastrar"}
            alt="Fechar"
          />
          <h3>
            <img src={iconeClientes} alt="Ícone Clientes" />
            Cadastro do Cliente
          </h3>
          <div className="cliente-input-containers">
            <div className="cliente-input-container">
              <label htmlFor="nome_cliente">Nome*</label>
              <input
                type="text"
                name="nome_cliente"
                className={`form-cliente-input ${
                  erroNome !== "" && "cadastrar-cliente-erro"
                }`}
                value={inputsClientes.nome_cliente}
                onChange={handleChange}
                placeholder="Digite o nome"
              />
              {erroNome && (
                <span className="erro-input-cliente">{erroNome}</span>
              )}
            </div>
            <div className="cliente-input-container">
              <label htmlFor="email">Email*</label>
              <input
                type="text"
                name="email"
                className={`form-cliente-input ${
                  erroEmail !== "" && "cadastrar-cliente-erro"
                }`}
                value={inputsClientes.email}
                onChange={handleChange}
                placeholder="Digite o email"
              />
              {erroEmail && (
                <span className="erro-input-cliente">{erroEmail}</span>
              )}
            </div>

            <div className="cliente-input-cpf-telefone">
              <div className="cliente-input-container min-width-50">
                <label htmlFor="cpf">CPF*</label>
                <input
                  className={`form-cliente-input ${
                    erroCpf !== "" && "cadastrar-cliente-erro"
                  }`}
                  type="text"
                  name="cpf"
                  value={inputsClientes.cpf}
                  onChange={handleChange}
                  placeholder="Digite o CPF"
                />
                {erroCpf && (
                  <span className="erro-input-cliente">{erroCpf}</span>
                )}
              </div>
              <div className="cliente-input-container min-width-50">
                <label htmlFor="telefone">Telefone*</label>
                <input
                  className={`form-cliente-input ${
                    erroTelefone !== "" && "cadastrar-cliente-erro"
                  }`}
                  type="text"
                  name="telefone"
                  value={inputsClientes.telefone}
                  onChange={handleChange}
                  placeholder="Digite o Telefone"
                />
                {erroTelefone && (
                  <span className="erro-input-cliente">{erroTelefone}</span>
                )}
              </div>
            </div>

            <div className="cliente-input-container">
              <label htmlFor="logradouro">Endereço</label>
              <input
                type="text"
                name="logradouro"
                className="form-cliente-input"
                value={inputsClientes.logradouro}
                onChange={handleChange}
                placeholder="Digite o endereco"
              />
            </div>

            <div className="cliente-input-container">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                name="complemento"
                className="form-cliente-input"
                value={inputsClientes.complemento}
                onChange={handleChange}
                placeholder="Digite o complemento"
              />
            </div>

            <div className="cliente-input-cep-bairro">
              <div className="cliente-input-container min-width-50">
                <label htmlFor="cep">CEP</label>
                <input
                  className="form-cliente-input"
                  type="text"
                  name="cep"
                  value={inputsClientes.cep}
                  onChange={handleChange}
                  placeholder="Digite o CEP"
                />
              </div>

              <div className="cliente-input-container min-width-50">
                <label htmlFor="bairro">Bairro</label>
                <input
                  className="form-cliente-input"
                  type="text"
                  name="bairro"
                  value={inputsClientes.bairro}
                  onChange={handleChange}
                  placeholder="Digite o bairro"
                />
              </div>
            </div>
            <div className="cliente-input-cidade-uf">
              <div className="cliente-input-container min-width-60">
                <label htmlFor="cidade">Cidade</label>
                <input
                  className={`form-cliente-input`}
                  type="text"
                  name="cidade"
                  value={inputsClientes.cidade}
                  onChange={handleChange}
                  placeholder="Digite a cidade"
                />
              </div>
              <div className="cliente-input-container max-width-35">
                <label htmlFor="estado">UF</label>
                <input
                  className={`form-cliente-input`}
                  type="text"
                  name="estado"
                  value={inputsClientes.estado}
                  onChange={handleChange}
                  placeholder="Digite a UF"
                />
              </div>
            </div>
          </div>

          <div className="btns-cadastrar-cliente">
            <button
              onClick={cancelarCadastrarCliente}
              className="cancelar-cadastro-cliente"
            >
              Cancelar
            </button>
            <button
              onClick={() => setSalvarDadosCliente(true)}
              className="concluir-cadastro-cliente"
            >
              Aplicar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ModalCadastrarCliente;
