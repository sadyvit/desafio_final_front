import "./styles.css";
import useGlobal from "../../hooks/useGlobal";
import { NavLink } from 'react-router-dom';
import { normalizarCpf } from "../../utils/utils";

function TabelaClientesStatus({ iconeCliente, tituloStatus, classeQuantidade, array }) {
  const { setClientesListTemp, clientesInadimplentes, clientesEmDia, setClickFiltroClientes } = useGlobal();

  function handleClickVerTodos() {
    setClientesListTemp(tituloStatus === 'em dia' ? clientesEmDia : clientesInadimplentes);
    setClickFiltroClientes(tituloStatus === 'em dia' ? 'emDia' : 'inadimplentes');
  }
  return (
    <div className="clientes-status">
      <div className="status-quantidade">
        <div className="status-icone">
          <img src={iconeCliente} alt="ícone inadimplentes" />
          <h3>Clientes {tituloStatus}</h3>
        </div>
        <span className={classeQuantidade}>{array.length < 10 ? `0${array.length}` : array.length}</span>
      </div>
      <div className="nome-colunas">
        <div className={"nome-coluna col-clientes"}>Clientes</div>
        <div className={"nome-coluna col-id-cliente"}>ID do clie.</div>
        <div className={"nome-coluna col-cpf"}>CPF</div>
      </div>
      {array.map(cliente => (
        array.indexOf(cliente) <= 3 &&
        <div className="linha-cliente" key={cliente.id}>
          <div className={"celula-cliente col-clientes"}>{cliente.nome_cliente}</div>
          <div className={"celula-cliente col-id-cliente"}>{cliente.id}</div>
          <div className={"celula-cliente col-cpf"}>{normalizarCpf(cliente.cpf)}</div>
        </div>
      ))}
      <span className="ver-todos" >
        <NavLink onClick={handleClickVerTodos} to={"/clientes"}>Ver todos</NavLink>
      </span>
    </div>
  )
}

export default TabelaClientesStatus;