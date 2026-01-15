import arrowIcon from "../../assets/arrow-icon.svg";
import iconeEditar from "../../assets/icone-editar.svg";
import iconeExcluir from "../../assets/icone-excluir-cobranca.svg";
import {
  ordenarTabelaNomeCliente,
  ordenarTabelaIdCobranca,
} from "../../utils/utils";
import "./styles.css";
import useGlobal from "../../hooks/useGlobal";
import { useState } from "react";

function TabelaCobrancas({ offset }) {
  const {
    cobrancasListTemp,
    abrirModalDetalheCobranca,
    setCobrancasListTemp,
    abrirModalEditarCobranca,
    setIdCliente,
    handleClickModalExcluir,
  } = useGlobal();
  const [ordemCobrancaNome, setOrdemCobrancaNome] = useState("");
  const [ordemIdCobranca, setOrdemIdCobranca] = useState("");

  return (
    <div className="tabela-cobrancas">
      <div className="titulo-coluna-cobrancas">
        <span
          className="titulo-coluna-cobrancas-span icone-ordem"
          onClick={() =>
            ordenarTabelaNomeCliente(
              ordemCobrancaNome,
              setOrdemCobrancaNome,
              cobrancasListTemp,
              setCobrancasListTemp
            )
          }
        >
          <img src={arrowIcon} alt="" />
          Cliente
        </span>
        <span
          className="titulo-coluna-cobrancas-span icone-ordem"
          onClick={() =>
            ordenarTabelaIdCobranca(
              setOrdemIdCobranca,
              ordemIdCobranca,
              cobrancasListTemp,
              setCobrancasListTemp
            )
          }
        >
          <img src={arrowIcon} alt="" />
          ID Cob.
        </span>
        <span className="titulo-coluna-cobrancas-span">Valor</span>
        <span className="titulo-coluna-cobrancas-span">Data de venc.</span>
        <span className="titulo-coluna-cobrancas-span">Status</span>
        <span className="titulo-coluna-cobrancas-span">Descrição</span>
      </div>
      <div className="conteudo-cobrancas">
        {cobrancasListTemp.map(
          (cobranca) =>
            cobrancasListTemp.indexOf(cobranca) >= offset &&
            cobrancasListTemp.indexOf(cobranca) < offset + 10 && (
              <div
                className="linha-info-cobranca linha-click"
                key={cobranca.id}
                onClick={() => abrirModalDetalheCobranca(cobranca)}
              >
                <span
                  className="linha-info-cobranca"
                  onClick={() => setIdCliente(cobranca.cliente_id)}
                >
                  {cobranca.nome_cliente}
                </span>
                <span className="linha-info-cobranca">{cobranca.id}</span>
                <span className="linha-info-cobranca">
                  {Number(cobranca.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span className="linha-info-cobranca">
                  {`${cobranca.vencimento.split("T")[0].split("-")[2]}/${
                    cobranca.vencimento.split("T")[0].split("-")[1]
                  }/${cobranca.vencimento.split("T")[0].split("-")[0]}`}
                </span>
                <div className="linha-info-cobranca">
                  <span
                    className={`status-cobranca-vencida
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
                <div className="linha-info-cobranca descricao-div">
                  <span className="descricao-cobranca">
                    {cobranca.descricao}
                  </span>
                </div>
                <div className="editar-excluir-cobranca">
                  <div
                    className="icones-editar-excluir"
                    onClick={() => abrirModalEditarCobranca(cobranca)}
                  >
                    <img src={iconeEditar} alt="" />
                    <span>Editar</span>
                  </div>
                  <div
                    onClick={() => handleClickModalExcluir(cobranca)}
                    className="icones-editar-excluir excluir-cobranca-icone"
                  >
                    <img src={iconeExcluir} alt="" />
                    <span>Excluir</span>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default TabelaCobrancas;
