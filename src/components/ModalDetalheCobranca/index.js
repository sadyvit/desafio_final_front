import iconeCobrancaMain from "../../assets/icone-cobranca-main.svg";
import iconeFechar from "../../assets/icone-fechar.svg";
import useGlobal from "../../hooks/useGlobal";
import useAuth from "../../hooks/useAuth";
import "./styles.css";
import { useEffect } from "react";

function ModalDetalheCobranca() {
  const {
    fecharModalDetalheCobranca,
    idCobranca,
    cobrancaClienteDetalhar,
    setCobrancaClienteDetalhar,
    nomeClienteModalCobranca,
  } = useGlobal();
  const { token } = useAuth();

  useEffect(() => {
    getCobrancaADetalhar();
  }, []);

  async function getCobrancaADetalhar() {
    try {
      const response = await fetch(
        `${process.env.API_URL}/cobranca/${idCobranca}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCobrancaClienteDetalhar(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="modal-detalhe-cobranca">
      {cobrancaClienteDetalhar.map((cobranca) => (
        <div className="card-detalhe-cobranca" key={cobranca.id}>
          <img
            src={iconeFechar}
            className="fechar-detalhe-cobranca"
            alt="fechar"
            onClick={fecharModalDetalheCobranca}
          />
          <h3>
            <img src={iconeCobrancaMain} alt="" />
            Detalhe da Cobrança
          </h3>
          <div className="detalhe-nome">
            <span className="titulo-detalhe">Nome</span>
            <span>{nomeClienteModalCobranca}</span>
          </div>
          <div className="detalhe-descricao">
            <span className="titulo-detalhe">Descrição</span>
            <p>{cobranca.descricao} </p>
          </div>
          <div className="detalhe-vencimento-valor">
            <div className="detalhe-vencimento">
              <span className="titulo-detalhe">Vencimento</span>
              <span>{`${cobranca.vencimento.split("T")[0].split("-")[2]}/${
                cobranca.vencimento.split("T")[0].split("-")[1]
              }/${cobranca.vencimento.split("T")[0].split("-")[0]}`}</span>
            </div>
            <div className="detalhe-valor">
              <span className="titulo-detalhe">Valor</span>
              <span>
                {Number(cobranca.valor).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
          <div className="detalhe-id-status">
            <div className="detalhe-id">
              <span className="titulo-detalhe">ID cobrança</span>
              <span>{cobranca.id}</span>
            </div>
            <div className="detalhe-status">
              <span className="titulo-detalhe">Status</span>
              <span
                className={`status-detalhe
              ${
                cobranca.status === "paga"
                  ? "status-cobranca-paga"
                  : cobranca.status === "vencida"
                  ? "status-cobranca-vencida"
                  : "status-cobranca-pendente"
              }`}
              >
                {cobranca.status.replace(
                  cobranca.status[0],
                  cobranca.status[0].toUpperCase()
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ModalDetalheCobranca;
