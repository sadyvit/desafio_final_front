import "./styles.css";
import useGlobal from "../../hooks/useGlobal";
import { NavLink } from 'react-router-dom'

function TabelaDadosCobrancas({ tituloStatus, classeQuantidade, array }) {
  const { setCobrancasListTemp, cobrancasPagas, cobrancasPrevistas, cobrancasVencidas, setClickFiltroCobrancas } = useGlobal();
  const listaCobrancas = Array.isArray(array) ? array : [];

  function handleClickVerTodos() {
    setCobrancasListTemp(tituloStatus === 'Pagas' ? cobrancasPagas : tituloStatus === 'Previstas' ? cobrancasPrevistas : cobrancasVencidas);
    setClickFiltroCobrancas(tituloStatus === 'Pagas' ? 'pagas' : tituloStatus === 'Previstas' ? 'previstas' : 'vencidas');
  }

  return (
    <div className="dados-cobrancas">
      <div className="titulo-quantidade">
        <h3>Cobrancas {tituloStatus}</h3>
        <span className={classeQuantidade}>{listaCobrancas.length < 10 ? `0${listaCobrancas.length}` : listaCobrancas.length}</span>
      </div>
      <div className="nome-colunas">
        <div className={"nome-coluna-cliente"}>Cliente</div>
        <div className={"nome-coluna"}>ID da cob.</div>
        <div className={"nome-coluna"}>Valor</div>
      </div>
      {listaCobrancas.map(cobranca => (
        listaCobrancas.indexOf(cobranca) <= 3 &&
        <div className="linha-cobranca" key={cobranca.id}>
          <div className={"celula-cobranca-nome"}><span className="nome-cliente-cobranca">{cobranca.nome_cliente}</span></div>
          <div className={"celula-cobranca"}>{cobranca.id}</div>
          <div className={"celula-cobranca"}>{Number(cobranca.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
      ))}
      <span className="ver-todos" onClick={handleClickVerTodos}><NavLink to={"/cobrancas"}>Ver todos</NavLink></span>
    </div>
  )
}

export default TabelaDadosCobrancas;