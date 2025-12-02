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
  }, [exibirToast]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExibirToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [exibirToast]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlteracaoUsuarioSucesso(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alteracaoUsuarioSucesso]);

  useEffect(() => {
    getClientes();
  }, []);

  async function getDetalharCobrancaCliente(idCliente) {
    try {
      const response = await fetch(
        `${process.env.API_URL}/cobrancas/${idCliente}`,
        {
          method: "GET",
          Authorization: `Bearer ${token}`,
        }
      );
      const data = await response.json();
      setCobrancasListDetalhar(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getClientes() {
    try {
      const response = await fetch(`${process.env.API_URL}/clientes`, {
        method: "GET",
        Authorization: `Bearer ${token}`,
      });

      const data = await response.json();
      setClientesList(data.clientes);
      const emDia = data.clientes.filter((d) => d.status === true);
      const inadimplentes = data.clientes.filter((d) => d.status === false);
      setTotalClientes(
        clickFiltroClientes === "emDia"
          ? emDia.length
          : clickFiltroClientes === "inadimplentes"
          ? inadimplentes.length
          : data.quantidadeClientes[0].count
      );
      setClientesListTemp(
        clickFiltroClientes === "emDia"
          ? emDia
          : clickFiltroClientes === "inadimplentes"
          ? inadimplentes
          : data.clientes
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handlePesquisarClientes(event) {
    if (event.key !== "Enter") return;
    if (event.key === "Enter" && event.target.value === "") {
      setTotalClientes(clientesList.length);
      setClientesListTemp(clientesList);
    }

    try {
      const response = await fetch(
        `${process.env.API_URL}/clientes/busca?busca=${inputPesquisaClientes}`,
        {
          headers: {
            method: "GET",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.length === 0) {
        setNaoEncontrado(true);
        return;
      }
      setTotalClientes(data.length);
      setClientesListTemp(data);
      setNaoEncontrado(false);
    } catch (error) {
      console.log(error);
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
          <Paginacao setOffset={setOffset} totalArray={totalClientes} />
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
