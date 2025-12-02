import "./styles.css";
import iconeFechar from "../../assets/icone-fechar.svg";
import iconeCobranca from "../../assets/icone-cobranca-main.svg";
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import { useState } from "react";

function ModalCadastrarCobranca({ getDetalharCobrancaCliente }) {
  const {
    inputCobrancasVazio,
    fecharModalCadastroCobranca,
    setExibirToast,
    setTipoMensagem,
    setMensagemToast,
    idCliente,
    nomeClienteModalCobranca,
    setClientesList,
    setClientesListTemp,
    clickFiltroClientes,
    setClientesInadimplentes,
    setClientesEmDia,
  } = useGlobal();
  const [inputsCadastroCobranca, setInputsCadastroCobranca] =
    useState(inputCobrancasVazio);
  const [erroDescricao, setErroDescricao] = useState("");
  const [erroVencimento, setErroVencimento] = useState("");
  const [erroValor, setErroValor] = useState("");
  const [salvarDadosCobranca, setSalvarDadosCobranca] = useState(false);
  const [statusCobranca, setStatusCobranca] = useState("paga");

  const { token } = useAuth();

  function limparErros() {
    setErroDescricao("");
    setErroVencimento("");
    setErroValor("");
  }

  function cancelarCadastrarCobranca(event) {
    event.preventDefault();
    setSalvarDadosCobranca(false);
    fecharModalCadastroCobranca();
  }

  function setErros() {
    setErroDescricao(
      inputsCadastroCobranca.descricao === ""
        ? "Este campo deve ser preenchido"
        : ""
    );
    setErroVencimento(
      inputsCadastroCobranca.vencimento === ""
        ? "Este campo deve ser preenchido"
        : ""
    );
    setErroValor(
      inputsCadastroCobranca.valor === ""
        ? "Este campo deve ser preenchido"
        : ""
    );
  }

  function handleChange(event) {
    setInputsCadastroCobranca({
      ...inputsCadastroCobranca,
      [event.target.name]: event.target.value,
    });
    limparErros();
  }

  function handleRadioChange(event) {
    setStatusCobranca(event.target.value);
  }

  async function getClientes() {
    try {
      const response = await fetch(`${process.env.API_URL}/clientes`, {
        method: "GET",
        Authorization: `Bearer ${token}`,
      });

      const data = await response.json();
      setClientesList(data.clientes);
      setClientesListTemp(
        clickFiltroClientes === "emDia"
          ? data.clientes.filter((d) => d.status === true)
          : clickFiltroClientes === "inadimplentes"
          ? data.clientes.filter((d) => d.status === false)
          : data.clientes
      );
      setClientesInadimplentes(data.clientes.filter((d) => d.status === false));
      setClientesEmDia(data.clientes.filter((d) => d.status === true));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (salvarDadosCobranca === false) return;

    if (
      inputsCadastroCobranca.nome_cliente === "" ||
      inputsCadastroCobranca.descricao === "" ||
      inputsCadastroCobranca.vencimento === "" ||
      inputsCadastroCobranca.valor === ""
    ) {
      setErros();
      return;
    }

    const body = {
      cliente_id: idCliente,
      descricao: inputsCadastroCobranca.descricao,
      vencimento: inputsCadastroCobranca.vencimento,
      valor: inputsCadastroCobranca.valor,
      status: statusCobranca,
    };

    const response = await fetch(
      `${process.env.API_URL}/cobrancas/${idCliente}`,
      {
        method: "POST",
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast(data);
      return;
    }
    await getDetalharCobrancaCliente(idCliente);
    await getClientes();
    setExibirToast(true);
    setTipoMensagem("sucesso");
    setMensagemToast("Cobrança cadastrada com sucesso");
    limparErros();
    fecharModalCadastroCobranca();
  }

  return (
    <>
      <div className="modal-cadastrar-cobranca">
        <form onSubmit={handleSubmit} className="form-cadastrar-cobranca">
          <img
            onClick={fecharModalCadastroCobranca}
            src={iconeFechar}
            className={"btn-fechar-cadastrar-cobranca"}
            alt="Fechar"
          />
          <h3>
            <img src={iconeCobranca} alt="Ícone Clientes" />
            Cadastro de Cobrança
          </h3>
          <div className="cadastro-cobranca-input-containers">
            <div className="cadastro-cobranca-input-container">
              <label htmlFor="nome_cliente">Nome*</label>
              <input
                type="text"
                name="nome_cliente"
                className="form-cadastrar-cobranca-input"
                value={nomeClienteModalCobranca}
                onChange={handleChange}
                placeholder="Digite o nome"
              />
            </div>
            <div className="cadastro-cobranca-input-container">
              <label htmlFor="descricao">Descrição*</label>
              <textarea
                type="text"
                name="descricao"
                className={`form-cadastrar-cobranca-input input-descricao ${
                  erroDescricao && "cadastrar-cobranca-erro"
                }`}
                value={inputsCadastroCobranca.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição"
              />
              {erroDescricao && (
                <span className="erro-input-cobranca">{erroDescricao}</span>
              )}
            </div>

            <div className="cobranca-input-vencimento-valor">
              <div className="cadastro-cobranca-input-container min-width-vencimento-valor">
                <label htmlFor="vencimento">Vencimento*</label>
                <input
                  className={`form-cadastrar-cobranca-input ${
                    erroVencimento && "cadastrar-cobranca-erro"
                  }`}
                  type="date"
                  name="vencimento"
                  value={inputsCadastroCobranca.vencimento}
                  onChange={handleChange}
                  placeholder="Data de Vencimento"
                />
                {erroVencimento && (
                  <span className="erro-input-cobranca">{erroVencimento}</span>
                )}
              </div>

              <div className="cadastro-cobranca-input-container min-width-vencimento-valor">
                <label htmlFor="valor">Valor*</label>
                <input
                  className={`form-cadastrar-cobranca-input ${
                    erroValor && "cadastrar-cobranca-erro"
                  }`}
                  type="text"
                  name="valor"
                  value={inputsCadastroCobranca.valor}
                  onChange={handleChange}
                  placeholder="Digite o valor"
                />
                {erroValor && (
                  <span className="erro-input-cobranca">{erroValor}</span>
                )}
              </div>

              <div className="cobranca-input-status">
                <p>Status*</p>
                <div className="container-cobranca-status">
                  <input
                    type="radio"
                    name="status"
                    onChange={handleRadioChange}
                    value="paga"
                    checked={statusCobranca === "paga" ? true : false}
                  />
                  <p className="cobranca-label" htmlFor="cobranca-status">
                    Cobrança paga
                  </p>
                </div>

                <div className="container-cobranca-status">
                  <input
                    type="radio"
                    name="status"
                    onChange={handleRadioChange}
                    value="pendente"
                    checked={statusCobranca === "paga" ? false : true}
                  />
                  <p className="cobranca-label" htmlFor="cobranca-status">
                    Cobrança pendente
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="btns-cadastrar-cobranca">
            <button
              onClick={cancelarCadastrarCobranca}
              className="cancelar-cadastro-cobranca"
            >
              Cancelar
            </button>
            <button
              onClick={() => setSalvarDadosCobranca(true)}
              className="concluir-cadastro-cobranca"
            >
              Aplicar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ModalCadastrarCobranca;
