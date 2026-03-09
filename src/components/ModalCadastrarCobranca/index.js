import "./styles.css";
import iconeFechar from "../../assets/icone-fechar.svg";
import iconeCobranca from "../../assets/icone-cobranca-main.svg";
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import { useState } from "react";
import { clienteEhInadimplente } from "../../utils/utils";
import { useLazyGetClientesQuery } from "../../store/apiSlice";

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
  const [getClientesQuery] = useLazyGetClientesQuery();
  const [loading, setLoading] = useState(false);

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

  function normalizarData(data) {
    const novaData = new Date(data);
    novaData.setHours(0, 0, 0, 0);
    return novaData;
  }

  async function getClientes() {
    try {
      const data = await getClientesQuery({ limit: 1000, offset: 0 }).unwrap();
      const clientes = Array.isArray(data?.clientes) ? data.clientes : [];

      setClientesList(clientes);
      setClientesListTemp(
        clickFiltroClientes === "emDia"
          ? clientes.filter((d) => !clienteEhInadimplente(d.status))
          : clickFiltroClientes === "inadimplentes"
          ? clientes.filter((d) => clienteEhInadimplente(d.status))
          : clientes
      );
      setClientesInadimplentes(clientes.filter((d) => clienteEhInadimplente(d.status)));
      setClientesEmDia(clientes.filter((d) => !clienteEhInadimplente(d.status)));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
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

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const statusAjustado =
      statusCobranca === "pendente" &&
      normalizarData(inputsCadastroCobranca.vencimento) < hoje
        ? "vencida"
        : statusCobranca;

    const body = {
      cliente_id: idCliente,
      descricao: inputsCadastroCobranca.descricao,
      vencimento: inputsCadastroCobranca.vencimento,
      valor: inputsCadastroCobranca.valor,
      status: statusAjustado,
    };

    const endpoints = [
      `${process.env.REACT_APP_API_URL}/cobrancas/${idCliente}`,
      `${process.env.REACT_APP_API_URL}/cobranca/${idCliente}`,
    ];

    try {
      setLoading(true);

      let response;
      for (const endpoint of endpoints) {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (response.status !== 404) {
          break;
        }
      }

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        setExibirToast(true);
        setTipoMensagem("erro");
        setMensagemToast(
          typeof data === "string" && data.trim() !== ""
            ? data
            : "Não foi possível cadastrar a cobrança"
        );
        return;
      }

      await getDetalharCobrancaCliente(idCliente);
      await getClientes();
      setExibirToast(true);
      setTipoMensagem("sucesso");
      setMensagemToast("Cobrança cadastrada com sucesso");
      limparErros();
      fecharModalCadastroCobranca();
    } catch (error) {
      console.log(error);
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Não foi possível cadastrar a cobrança");
    } finally {
      setLoading(false);
    }
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
                    checked={statusCobranca === "paga"}
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
                    checked={statusCobranca === "pendente"}
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
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="concluir-cadastro-cobranca"
              onClick={() => setSalvarDadosCobranca(true)}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" aria-hidden="true" />
                  Aplicando...
                </span>
              ) : (
                "Aplicar"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ModalCadastrarCobranca;
