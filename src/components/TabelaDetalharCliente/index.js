import "./style.css";
import iconeEditarVerde from "../../assets/icone-editar-verde.svg";
import useGlobal from "../../hooks/useGlobal";

function TabelaDetalharCliente() {
  const { setAbrirModalEditarCliente, clienteDetalhado, setClienteEdicao } =
    useGlobal();

  function handleEditarCliente() {
    setClienteEdicao(true);
    setAbrirModalEditarCliente(true);
  }

  return (
    <>
      <div className="tabela-perfil-cliente">
        <div className="header-tabela-perfil-cliente">
          <span>Dados do cliente</span>
          <button onClick={handleEditarCliente}>
            <img src={iconeEditarVerde} alt="editar cliente" />
            Editar Cliente
          </button>
        </div>
        <div className="linha-01-dado-cliente">
          <div className="dado-email">
            <span className="titulo-coluna-perfil-span">E-mail</span>
            <span className="descicao-coluna-perfil-span">
              {clienteDetalhado.email}
            </span>
          </div>
          <div className="dado-telefone">
            <span className="titulo-coluna-perfil-span">Telefone</span>
            <span className="descicao-coluna-perfil-span">
              {clienteDetalhado.telefone}
            </span>
          </div>
          <div className="dado-cpf">
            <span className="titulo-coluna-perfil-span">CPF</span>
            <span className="descicao-coluna-perfil-span">
              {clienteDetalhado.cpf}
            </span>
          </div>
        </div>
        <div className="linha-02-dado-cliente">
          <div className="linha-03-dado-cliente">
            <div className="dado-endereco">
              <span className="titulo-coluna-perfil-span">Endereço</span>
              <span className="descicao-coluna-perfil-span">
                {clienteDetalhado.logradouro}
              </span>
            </div>
            <div className="dado-bairro">
              <span className="titulo-coluna-perfil-span">Bairro</span>
              <span className="descicao-coluna-perfil-span">
                {clienteDetalhado.bairro}
              </span>
            </div>
            <div className="dado-complemento">
              <span className="titulo-coluna-perfil-span">Complemento</span>
              <span className="descicao-coluna-perfil-span">
                {clienteDetalhado.complemento}
              </span>
            </div>
          </div>
          <div className="linha-04-dado-cliente">
            <div className="dado-cep">
              <span className="titulo-coluna-perfil-span">CEP</span>
              <span className="descicao-coluna-perfil-span">
                {clienteDetalhado.cep}
              </span>
            </div>
            <div className="dado-cidade">
              <span className="titulo-coluna-perfil-span">Cidade</span>
              <span className="descicao-coluna-perfil-span">
                {clienteDetalhado.cidade}
              </span>
            </div>
            <div className="dado-uf">
              <span className="titulo-coluna-perfil-span">UF</span>
              <span className="descicao-coluna-perfil-span">
                {clienteDetalhado.estado.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TabelaDetalharCliente;
