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
import useAuth from "../../hooks/useAuth";
import useGlobal from "../../hooks/useGlobal";
import DivNaoEncontrado from "../../components/DivNaoEncontrado";
import Paginacao from "../../components/Paginacao";
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
    clientesList,
    setClientesList,
    setClientesListTemp,
    abrirModalCadastroCobrancas,
    mensagemToast,
    tipoMensagem,
    setMensagemToast,
    setTipoMensagem,
    setCobrancasListDetalhar,
    clickFiltroClientes,
    totalClientes,
    setTotalClientes,
  } = useGlobal();
  const { token } = useAuth();
  const [inputPesquisaClientes, setInputPesquisaClientes] = useState("");
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let interval;
    if (exibirToast) {
      interval = setInterval(() => {
        setExibirToast(true);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [exibirToast, setExibirToast]);

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

  useEffect(() => {
    getClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getDetalharCobrancaCliente(idCliente) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cobrancas/${idCliente}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setCobrancasListDetalhar(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  }

  async function getClientes() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/clientes?limit=1000&offset=0`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setExibirToast(true);
        setTipoMensagem("erro");
        setMensagemToast(
          response.status === 401
            ? "Sessão expirada. Faça login novamente."
            : "Não foi possível carregar clientes."
        );
        return;
      }

      const data = await response.json();

      const clientes = Array.isArray(data?.clientes) ? data.clientes : [];
      const quantidade = Number(data?.quantidadeClientes?.[0]?.count ?? 0);

      setClientesList(clientes);
      const emDia = clientes.filter((d) => d.status === true);
      const inadimplentes = clientes.filter((d) => d.status === false);
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
    } catch (error) {
      console.log(error);
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Erro de conexão ao carregar clientes.");
    }
  }

  async function handlePesquisarClientes(event) {
    if (event.key !== "Enter") return;
    if (event.key === "Enter" && event.target.value === "") {
      setTotalClientes(clientesList.length);
      setClientesListTemp(clientesList);
      setNaoEncontrado(clientesList.length === 0);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/clientes/busca?busca=${inputPesquisaClientes}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setExibirToast(true);
        setTipoMensagem("erro");
        setMensagemToast(
          response.status === 401
            ? "Sessão expirada. Faça login novamente."
            : "Não foi possível pesquisar clientes."
        );
        return;
      }

      const data = await response.json();

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
      setMensagemToast("Erro de conexão ao pesquisar clientes.");
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
