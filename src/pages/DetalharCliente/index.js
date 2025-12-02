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
import useGlobal from "../../hooks/useGlobal";
import ToastAlerta from "../../components/ToastAlerta";
import ModalEditarCliente from "../../components/ModalEditarCliente";
import ModalEditarCobranca from "../../components/ModalEditarCobranca";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import ModalDetalheCobranca from "../../components/ModalDetalheCobranca";
import ModalCadastrarCobranca from "../../components/ModalCadastrarCobranca";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import ModalSucessoAlterarCadastro from "../../components/ModalSucessoAlterarCadastro";
import ModalExcluirCobranca from "../../components/ModalExcluirCobranca";

function DetalharCliente() {
  const {
    abrirEditarUsuario,
    abrirModalEditarCliente,
    clienteDetalhado,
    abrirModalCadastroCobrancas,
    exibirToast,
    setExibirToast,
    mensagemToast,
    tipoMensagem,
    alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso,
    setClienteDetalhado,
    setCobrancasListDetalhar,
    idCliente,
    abrirModalDetalharCobranca,
    abrirModalEdicaoCobranca,
    abrirModalExcluirCobranca,
  } = useGlobal();
  const { token } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlteracaoUsuarioSucesso(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alteracaoUsuarioSucesso]);

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
    getClienteDetalhado();
  }, []);

  useEffect(() => {
    getDetalharCobrancaCliente();
  }, []);

  async function getClienteDetalhado() {
    try {
      const response = await fetch(
        `${process.env.API_URL}/clientes/${idCliente}`,
        {
          method: "GET",
          Authorization: `Bearer ${token}`,
        }
      );
      const data = await response.json();
      setClienteDetalhado(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDetalharCobrancaCliente() {
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
