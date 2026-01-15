import "./styles.css";
import iconeFechar from "../../assets/icone-fechar.svg";
import iconeCobranca from "../../assets/icone-cobranca-main.svg";
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import { useEffect, useState } from "react";

function ModalEditarCobranca({ getCobrancas }) {
  const {
    inputCobrancasVazio,
    fecharModalEditarCobranca,
    setExibirToast,
    setTipoMensagem,
    setMensagemToast,
    idCobranca,
    nomeClienteModalCobranca,
    cobrancaEdicao,
    setCobrancaEdicao,
  } = useGlobal();
  const [inputsEditarCobranca, setInputsEditarCobranca] =
    useState(inputCobrancasVazio);
  const [erroDescricao, setErroDescricao] = useState("");
  const [erroVencimento, setErroVencimento] = useState("");
  const [erroValor, setErroValor] = useState("");
  const [salvarEditarCobranca, setSalvarEditarCobranca] = useState(false);
  const [statusCobranca, setStatusCobranca] = useState("paga");

  const { token } = useAuth();

  function limparErros() {
    setErroDescricao("");
    setErroVencimento("");
    setErroValor("");
  }

  function cancelarEditarCobranca(event) {
    event.preventDefault();
    setSalvarEditarCobranca(false);
    fecharModalEditarCobranca();
  }

  function setErros() {
    setErroDescricao(
      inputsEditarCobranca.descricao === ""
        ? "Este campo deve ser preenchido"
        : ""
    );
    setErroVencimento(
      inputsEditarCobranca.vencimento === ""
        ? "Este campo deve ser preenchido"
        : ""
    );
    setErroValor(
      inputsEditarCobranca.valor === "" ? "Este campo deve ser preenchido" : ""
    );
  }

  function handleChange(event) {
    setInputsEditarCobranca({
      ...inputsEditarCobranca,
      [event.target.name]: event.target.value,
    });
    limparErros();
  }

  function handleRadioChange(event) {
    setStatusCobranca(event.target.value);
  }

  useEffect(() => {
    getCobranca();
  }, [getCobranca, salvarEditarCobranca]);

  useEffect(() => {
    if (cobrancaEdicao) {
      setInputsEditarCobranca({
        descricao: cobrancaEdicao.descricao,
        vencimento: `${cobrancaEdicao.vencimento.split("T")[0].split("-")[0]}-${
          cobrancaEdicao.vencimento.split("T")[0].split("-")[1]
        }-${cobrancaEdicao.vencimento.split("T")[0].split("-")[2]}`,
        valor: cobrancaEdicao.valor,
      });
      setStatusCobranca(cobrancaEdicao.status);
      return;
    }
  }, [cobrancaEdicao]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getCobranca() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cobranca/${idCobranca}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCobrancaEdicao(data[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    limparErros();

    if (
      inputsEditarCobranca.descricao === "" ||
      inputsEditarCobranca.vencimento === "" ||
      inputsEditarCobranca.valor === ""
    ) {
      setErros();
      return;
    }

    const body = {
      cliente_id: cobrancaEdicao.cliente_id,
      descricao: inputsEditarCobranca.descricao,
      vencimento: inputsEditarCobranca.vencimento,
      valor: Number(inputsEditarCobranca.valor),
      status:
        statusCobranca === "vencida" &&
        new Date(inputsEditarCobranca.vencimento) > new Date()
          ? "pendente"
          : statusCobranca,
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/cobrancas/${idCobranca}`,
      {
        method: "PUT",
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
    await getCobrancas();
    setExibirToast(true);
    setTipoMensagem("sucesso");
    setMensagemToast("Cobrança editada com sucesso");
    limparErros();
    fecharModalEditarCobranca();
  }

  return (
    <>
      <div className="modal-editar-cobranca">
        <form onSubmit={handleSubmit} className="form-editar-cobranca">
          <img
            onClick={fecharModalEditarCobranca}
            src={iconeFechar}
            className="btn-fechar-editar-cobranca"
            alt="Fechar"
          />
          <h3>
            <img src={iconeCobranca} alt="Ícone Clientes" />
            Edição de Cobrança
          </h3>
          <div className="edicao-cobranca-input-containers">
            <div className="edicao-cobranca-input-container">
              <label htmlFor="nome_cliente">Nome*</label>
              <input
                type="text"
                name="nome_cliente"
                className="form-editar-cobranca-input"
                value={nomeClienteModalCobranca}
                placeholder="Digite o nome"
                readOnly
              />
            </div>
            <div className="edicao-cobranca-input-container">
              <label htmlFor="descricao">Descrição*</label>
              <textarea
                type="text"
                name="descricao"
                className={`form-editar-cobranca-input input-descricao ${
                  erroDescricao && "editar-cobranca-erro"
                }`}
                value={inputsEditarCobranca.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição"
              />
              {erroDescricao && (
                <span className="erro-input-cobranca">{erroDescricao}</span>
              )}
            </div>

            <div className="cobranca-input-vencimento-valor">
              <div className="edicao-cobranca-input-container min-width-vencimento-valor">
                <label htmlFor="vencimento">Vencimento*</label>
                <input
                  className={`form-editar-cobranca-input ${
                    erroVencimento && "editar-cobranca-erro"
                  }`}
                  type="date"
                  name="vencimento"
                  value={inputsEditarCobranca.vencimento}
                  onChange={handleChange}
                  placeholder="Data de Vencimento"
                />
                {erroVencimento && (
                  <span className="erro-input-cobranca">{erroVencimento}</span>
                )}
              </div>

              <div className="edicao-cobranca-input-container min-width-vencimento-valor">
                <label htmlFor="valor">Valor*</label>
                <input
                  className={`form-editar-cobranca-input ${
                    erroValor && "editar-cobranca-erro"
                  }`}
                  type="number"
                  name="valor"
                  value={inputsEditarCobranca.valor}
                  onChange={handleChange}
                  placeholder="Digite o valor"
                  min="0"
                  step="0.01"
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
                  <span className="cobranca-label">Cobrança paga</span>
                </div>

                <div className="container-cobranca-status">
                  <input
                    type="radio"
                    name="status"
                    onChange={handleRadioChange}
                    value="pendente"
                    checked={statusCobranca === "pendente"}
                  />
                  <span className="cobranca-label">Cobrança pendente</span>
                </div>
              </div>
            </div>
          </div>
          <div className="btns-editar-cobranca">
            <button
              onClick={cancelarEditarCobranca}
              className="cancelar-editar-cobranca"
              type="button"
            >
              Cancelar
            </button>
            <button className="concluir-editar-cobranca" type="submit">
              Aplicar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ModalEditarCobranca;
