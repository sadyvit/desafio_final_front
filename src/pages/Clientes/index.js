import { useEffect, useState } from "react";
import iconeClienteOn from "../../assets/clientsOn.svg";
import iconeHomeOff from "../../assets/homeOff.svg";
import iconeAddCliente from "../../assets/icone-adicionar-cliente.svg";
import iconeClientes from "../../assets/icone-clientes.svg";
import iconeCobrancaInactive from "../../assets/icone-cobranca-inactive.svg";
import iconeFiltro from "../../assets/icone-filtro.svg";
import ModalCadastrarCliente from "../../components/ModalCadastrarCliente";
import ModalCadastrarCobranca from "../../components/ModalCadastrarCobranca";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import ModalSucessoAlterarCadastro from "../../components/ModalSucessoAlterarCadastro";
import Sidebar from "../../components/Sidebar";
import ClientesTable from "../../components/TabelaClientes";
import ToastAlerta from "../../components/ToastAlerta";
import UserMenu from "../../components/UserMenu";
import DivNaoEncontrado from "../../components/DivNaoEncontrado";
import Paginacao from "../../components/Paginacao";
import { clienteEhInadimplente } from "../../utils/utils";
import useGlobalUi from "../../hooks/global/useGlobalUi";
import useGlobalListas from "../../hooks/global/useGlobalListas";
import { useLazyGetCobrancasByClienteQuery, useLazySearchClientesQuery, useGetClientesQuery } from "../../store/apiSlice";
import "./styles.css";

function Clientes() {
  const {
    abrirEditarUsuario,
    alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso,
    abrirModalCadastroCliente,
    setAbrirModalCadastroCliente,
    exibirToast,
    setExibirToast,
    mensagemToast,
    tipoMensagem,
    setMensagemToast,
    setTipoMensagem,
    clickFiltroClientes,
    totalClientes,
    setTotalClientes,
    abrirModalCadastroCobrancas,
  } = useGlobalUi();

  const {
    clientesList,
    setClientesList,
    setClientesListTemp,
    setCobrancasListDetalhar,
  } = useGlobalListas();

  const { data: clientesData, error: clientesError, refetch: refetchClientes } =
    useGetClientesQuery({ limit: 1000, offset: 0 });
  const [searchClientes] = useLazySearchClientesQuery();
  const [getCobrancasByCliente] = useLazyGetCobrancasByClienteQuery();

  const [inputPesquisaClientes, setInputPesquisaClientes] = useState("");
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExibirToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [exibirToast, setExibirToast]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlteracaoUsuarioSucesso(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alteracaoUsuarioSucesso, setAlteracaoUsuarioSucesso]);

  async function getDetalharCobrancaCliente(idCliente) {
    try {
      const data = await getCobrancasByCliente(idCliente).unwrap();
      setCobrancasListDetalhar(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  }

  async function getClientes() {
    await refetchClientes();
  }

  useEffect(() => {
    if (clientesError) {
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Nao foi possivel carregar clientes.");
      return;
    }

    if (!clientesData) {
      return;
    }

    const clientes = Array.isArray(clientesData?.clientes)
      ? clientesData.clientes
      : [];
    const quantidade = Number(clientesData?.quantidadeClientes?.[0]?.count ?? 0);

    setClientesList(clientes);
    const inadimplentes = clientes.filter((d) => clienteEhInadimplente(d.status));
    const emDia = clientes.filter((d) => !clienteEhInadimplente(d.status));

    setTotalClientes(
      clickFiltroClientes === "emDia"
        ? emDia.length
        : clickFiltroClientes === "inadimplentes"
        ? inadimplentes.length
        : quantidade
    );
    setClientesListTemp(
      clickFiltroClientes === "emDia"
        ? emDia
        : clickFiltroClientes === "inadimplentes"
        ? inadimplentes
        : clientes
    );
    setNaoEncontrado(clientes.length === 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientesData, clientesError, clickFiltroClientes]);

  async function handlePesquisarClientes(event) {
    if (event.key !== "Enter") return;
    if (event.key === "Enter" && event.target.value === "") {
      setTotalClientes(clientesList.length);
      setClientesListTemp(clientesList);
      setNaoEncontrado(clientesList.length === 0);
      return;
    }

    try {
      const data = await searchClientes(inputPesquisaClientes).unwrap();

      if (!Array.isArray(data) || data.length === 0) {
        setNaoEncontrado(true);
        return;
      }
      setTotalClientes(data.length);
      setClientesListTemp(data);
      setNaoEncontrado(false);
    } catch (error) {
      console.log(error);
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Nao foi possivel pesquisar clientes.");
    }
  }

  return (
    <>
      <div
        className={`clientes ${
          (abrirEditarUsuario || alteracaoUsuarioSucesso) && "blur-modal"
        }`}
      >
        <Sidebar
          imagemHome={iconeHomeOff}
          imagemClientes={iconeClienteOn}
          imagemCobranca={iconeCobrancaInactive}
        />
        <div
          className={`main-clientes ${
            (abrirModalCadastroCliente || abrirModalCadastroCobrancas) &&
            "blur-modal"
          }`}
        >
          <div className="clientes-title">
            <span className="titulo-pag-clientes">Clientes</span>
            <UserMenu />
          </div>
          <hr />

          <div className="clientes-opcoes">
            <div className="clientes-opcoes-titulo">
              <img src={iconeClientes} alt="" />
              <h3>Clientes</h3>
            </div>

            <div className="clientes-opcoes-actions">
              <button
                onClick={() => setAbrirModalCadastroCliente(true)}
                className="btn-adicionar-cliente"
              >
                <img src={iconeAddCliente} alt="Ícone adicionar" />
                Adicionar cliente
              </button>
              <button className="btn-filtrar-cliente">
                <img src={iconeFiltro} alt="Ícone filtrar" />
              </button>
              <input
                type="text"
                value={inputPesquisaClientes}
                onChange={(e) => setInputPesquisaClientes(e.target.value)}
                onKeyDown={handlePesquisarClientes}
                placeholder="Pesquisa"
              />
            </div>
          </div>
          {!naoEncontrado && <ClientesTable offset={offset} />}
          {naoEncontrado && <DivNaoEncontrado />}
          {!naoEncontrado && totalClientes > 0 && (
            <Paginacao setOffset={setOffset} totalArray={totalClientes} />
          )}
        </div>
      </div>
      {abrirEditarUsuario && <ModalEditarUsuario />}
      {alteracaoUsuarioSucesso && <ModalSucessoAlterarCadastro />}
      {abrirModalCadastroCliente && (
        <ModalCadastrarCliente getClientes={getClientes} />
      )}
      {exibirToast && (
        <ToastAlerta
          mensagemToast={mensagemToast}
          tipoMensagem={tipoMensagem}
        />
      )}
      {abrirModalCadastroCobrancas && (
        <ModalCadastrarCobranca
          getDetalharCobrancaCliente={getDetalharCobrancaCliente}
        />
      )}
    </>
  );
}

export default Clientes;
