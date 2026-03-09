import "./style.css";
import Sidebar from "../../components/Sidebar";
import iconeHomeOff from "../../assets/homeOff.svg";
import iconeClienteOn from "../../assets/clientsOn.svg";
import iconeCobrancaOff from "../../assets/icone-cobranca-inactive.svg";
import iconeClientes from "../../assets/icone-clientes.svg";
import UserMenu from "../../components/UserMenu";
import TabelaDadosCobrancasDetalhe from "../../components/TabelaDadosCobrancaDetalhes";
import TabelaDetalharCliente from "../../components/TabelaDetalharCliente";
import { NavLink } from "react-router-dom";
import ToastAlerta from "../../components/ToastAlerta";
import ModalEditarCliente from "../../components/ModalEditarCliente";
import ModalEditarCobranca from "../../components/ModalEditarCobranca";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import ModalDetalheCobranca from "../../components/ModalDetalheCobranca";
import ModalCadastrarCobranca from "../../components/ModalCadastrarCobranca";
import { useEffect } from "react";
import ModalSucessoAlterarCadastro from "../../components/ModalSucessoAlterarCadastro";
import ModalExcluirCobranca from "../../components/ModalExcluirCobranca";
import useGlobalUi from "../../hooks/global/useGlobalUi";
import useGlobalDomain from "../../hooks/global/useGlobalDomain";
import useGlobalListas from "../../hooks/global/useGlobalListas";
import { useGetClienteByIdQuery, useGetCobrancasByClienteQuery } from "../../store/apiSlice";

function DetalharCliente() {
  const {
    abrirEditarUsuario,
    abrirModalEditarCliente,
    abrirModalCadastroCobrancas,
    exibirToast,
    setExibirToast,
    mensagemToast,
    tipoMensagem,
    alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso,
    abrirModalDetalharCobranca,
    abrirModalEdicaoCobranca,
    abrirModalExcluirCobranca,
  } = useGlobalUi();

  const {
    clienteDetalhado,
    setClienteDetalhado,
    idCliente,
  } = useGlobalDomain();

  const { setCobrancasListDetalhar } = useGlobalListas();

  const {
    data: clienteData,
    error: clienteError,
    refetch: refetchCliente,
  } = useGetClienteByIdQuery(idCliente, { skip: !idCliente });

  const {
    data: cobrancasClienteData,
    error: cobrancasClienteError,
    refetch: refetchCobrancasCliente,
  } = useGetCobrancasByClienteQuery(idCliente, { skip: !idCliente });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlteracaoUsuarioSucesso(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alteracaoUsuarioSucesso, setAlteracaoUsuarioSucesso]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExibirToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [exibirToast, setExibirToast]);

  async function getClienteDetalhado() {
    await refetchCliente();
  }

  async function getDetalharCobrancaCliente() {
    await refetchCobrancasCliente();
  }

  useEffect(() => {
    if (clienteError) {
      setClienteDetalhado({});
      return;
    }

    if (!clienteData) {
      return;
    }

    setClienteDetalhado(clienteData && typeof clienteData === "object" ? clienteData : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteData, clienteError]);

  useEffect(() => {
    if (cobrancasClienteError) {
      setCobrancasListDetalhar([]);
      return;
    }

    if (!cobrancasClienteData) {
      return;
    }

    setCobrancasListDetalhar(Array.isArray(cobrancasClienteData) ? cobrancasClienteData : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cobrancasClienteData, cobrancasClienteError]);

  return (
    <>
      <div
        className={`detalhar-cliente ${
          (abrirEditarUsuario || alteracaoUsuarioSucesso) && "blur-modal"
        }`}
      >
        <Sidebar
          imagemHome={iconeHomeOff}
          imagemClientes={iconeClienteOn}
          imagemCobranca={iconeCobrancaOff}
        />

        <div
          className={`main-detalhamento 
        ${
          (abrirModalEditarCliente ||
            abrirModalDetalharCobranca ||
            abrirModalCadastroCobrancas ||
            abrirModalEdicaoCobranca) &&
          "blur-modal"
        }`}
        >
          <div className="Detalhamento-title">
            <span className="titulo-detalhe-clientes-link">
              <NavLink to="/clientes">Clientes</NavLink>
              <span className="titulo-detalhe"> {">"} Detalhes do cliente</span>
            </span>
            <UserMenu />
          </div>
          <hr />
          <div className="detalhes-opcoes-titulo">
            <img src={iconeClientes} alt="" />
            <h3>{clienteDetalhado.nome_cliente}</h3>
          </div>
          <TabelaDetalharCliente />
          <TabelaDadosCobrancasDetalhe />
        </div>
      </div>
      {abrirModalEditarCliente && (
        <ModalEditarCliente getClienteDetalhado={getClienteDetalhado} />
      )}
      {alteracaoUsuarioSucesso && <ModalSucessoAlterarCadastro />}
      {abrirEditarUsuario && <ModalEditarUsuario />}
      {abrirModalEdicaoCobranca && (
        <ModalEditarCobranca getCobrancas={getDetalharCobrancaCliente} />
      )}
      {abrirModalCadastroCobrancas && (
        <ModalCadastrarCobranca
          getDetalharCobrancaCliente={getDetalharCobrancaCliente}
        />
      )}
      {exibirToast && (
        <ToastAlerta
          mensagemToast={mensagemToast}
          tipoMensagem={tipoMensagem}
        />
      )}
      {abrirModalExcluirCobranca && (
        <ModalExcluirCobranca getCobrancas={getDetalharCobrancaCliente} />
      )}
      {!abrirModalEdicaoCobranca &&
        !abrirModalExcluirCobranca &&
        abrirModalDetalharCobranca && <ModalDetalheCobranca />}
    </>
  );
}

export default DetalharCliente;
