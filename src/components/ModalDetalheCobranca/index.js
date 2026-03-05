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
    if (
      idCobranca &&
      token &&
      String(cobrancaClienteDetalhar?.id ?? "") !== String(idCobranca)
    ) {
      getCobrancaADetalhar();
    }
    // eslint-disable-next-line
  }, [idCobranca, token, cobrancaClienteDetalhar?.id]);

  async function getCobrancaADetalhar() {
    try {
      const endpoints = [
        `${process.env.REACT_APP_API_URL}/cobranca/${idCobranca}`,
        `${process.env.REACT_APP_API_URL}/cobrancas/${idCobranca}`,
      ];

      let cobrancaEncontrada = null;
      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          continue;
        }

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const cobranca = Array.isArray(data)
          ? data.find((item) => String(item?.id) === String(idCobranca)) || null
          : String(data?.id) === String(idCobranca)
          ? data
          : null;

        if (cobranca && typeof cobranca === "object") {
          cobrancaEncontrada = cobranca;
          break;
        }
      }

      if (!cobrancaEncontrada) {
        setCobrancaClienteDetalhar({});
        return;
      }

      setCobrancaClienteDetalhar(cobrancaEncontrada);
    } catch (error) {
      console.log(error);
      setCobrancaClienteDetalhar({});
    }
  }

  const cobranca = cobrancaClienteDetalhar || {};
  // Formatação de data segura
  let dataVenc = "";
  if (cobranca.vencimento) {
    const d = new Date(cobranca.vencimento);
    dataVenc = d.toLocaleDateString("pt-BR");
  }

  return (
    <div className="modal-detalhe-cobranca">
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
          <span>{nomeClienteModalCobranca || "-"}</span>
        </div>
        <div className="detalhe-descricao">
          <span className="titulo-detalhe">Descrição</span>
          <p>{cobranca.descricao || "-"}</p>
        </div>
        <div className="detalhe-vencimento-valor">
          <div className="detalhe-vencimento">
            <span className="titulo-detalhe">Vencimento</span>
            <span>{dataVenc || "-"}</span>
          </div>
          <div className="detalhe-valor">
            <span className="titulo-detalhe">Valor</span>
            <span>
              {cobranca.valor !== undefined
                ? Number(cobranca.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "-"}
            </span>
          </div>
        </div>
        <div className="detalhe-id-status">
          <div className="detalhe-id">
            <span className="titulo-detalhe">ID cobrança</span>
            <span>{cobranca.id ?? "-"}</span>
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
              {cobranca.status
                ? cobranca.status.charAt(0).toUpperCase() +
                  cobranca.status.slice(1)
                : "-"}
            </span>
          </div>
        </div>
        {!cobranca.id && (
          <p className="detalhe-descricao">Nao foi possivel carregar os detalhes desta cobranca.</p>
        )}
      </div>
    </div>
  );
}

export default ModalDetalheCobranca;
