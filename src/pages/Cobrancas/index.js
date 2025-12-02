import { useEffect, useState } from "react";
import iconeClienteOff from "../../assets/clientsOff.svg";
import iconeHomeOff from "../../assets/homeOff.svg";
import iconeCobrancaActive from "../../assets/icone-cobranca-active.svg";
import iconeCobrancaMain from "../../assets/icone-cobranca-main.svg";
import iconeFiltro from "../../assets/icone-filtro.svg";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import ModalDetalheCobranca from "../../components/ModalDetalheCobranca";
import ModalSucessoAlterarCadastro from "../../components/ModalSucessoAlterarCadastro";
import ModalEditarCobranca from "../../components/ModalEditarCobranca";
import ModalExcluirCobranca from "../../components/ModalExcluirCobranca";
import Sidebar from "../../components/Sidebar";
import UserMenu from "../../components/UserMenu";
import useGlobal from "../../hooks/useGlobal";
import TabelaCobrancas from "../../components/TabelaCobrancas";
import ToastAlerta from "../../components/ToastAlerta";
import useAuth from "../../hooks/useAuth";
import DivNaoEncontrado from "../../components/DivNaoEncontrado";
import Paginacao from "../../components/Paginacao";
import "./styles.css";

function Cobrancas() {
  const {
    abrirEditarUsuario,
    alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso,
    exibirToast,
    setExibirToast,
    mensagemToast,
    tipoMensagem,
    abrirModalEdicaoCobranca,
    abrirModalDetalharCobranca,
    abrirModalExcluirCobranca,
    cobrancasList,
    setCobrancasListTemp,
    setCobrancasList,
    clickFiltroCobrancas,
    totalCobrancas,
    setTotalCobrancas,
  } = useGlobal();
  const [pesquisaCobranca, setPesquisaCobranca] = useState("");
  const { token } = useAuth();
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [offset, setOffset] = useState(0);

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
    getCobrancas();
  }, []);

  async function getCobrancas() {
    try {
      const response = await fetch(`${process.env.API_URL}/cobrancas`, {
        method: "GET",
        Authorization: `Bearer ${token}`,
      });

      const data = await response.json();
      setCobrancasList(data.cobrancas);
      const vencidas = data.cobrancas.filter(
        (d) => d.status.toLowerCase() === "vencida"
      );
      const previstas = data.cobrancas.filter(
        (d) => d.status.toLowerCase() === "pendente"
      );
      const pagas = data.cobrancas.filter(
        (d) => d.status.toLowerCase() === "paga"
      );
      setTotalCobrancas(
        clickFiltroCobrancas === "pagas"
          ? pagas.length
          : clickFiltroCobrancas === "previstas"
          ? previstas.length
          : clickFiltroCobrancas === "vencidas"
          ? vencidas.length
          : data.quantidadeCobrancas[0].count
      );
      setCobrancasListTemp(
        clickFiltroCobrancas === "pagas"
          ? pagas
          : clickFiltroCobrancas === "previstas"
          ? previstas
          : clickFiltroCobrancas === "vencidas"
          ? vencidas
          : data.cobrancas
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleRequestApi(event) {
    if (event.key !== "Enter") return;
    if (event.key === "Enter" && event.target === "") {
      setTotalCobrancas(cobrancasList.length);
      setCobrancasListTemp(cobrancasList);
    }
    try {
      const response = await fetch(
        `${process.env.API_URL}/cobrancas/busca?busca=${pesquisaCobranca}`,
        {
          method: "GET",
          Authorization: `Bearer ${token}`,
        }
      );
      const data = await response.json();
      if (!data.length) {
        setNaoEncontrado(true);
        return;
      }
      setTotalCobrancas(data.length);
      setCobrancasListTemp(data);
      setNaoEncontrado(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className={`cobrancas ${
          (abrirEditarUsuario || alteracaoUsuarioSucesso) && "blur-modal"
        }`}
      >
        <Sidebar
          imagemHome={iconeHomeOff}
          imagemClientes={iconeClienteOff}
          imagemCobranca={iconeCobrancaActive}
        />
        <div
          className={`main-cobrancas ${
            abrirModalDetalharCobranca && "blur-modal"
          }`}
        >
          <div className="cobrancas-title">
            <span className="titulo-pag-cobrancas">Cobranças</span>
            <UserMenu />
          </div>
          <hr />

          <div className="cobrancas-opcoes">
            <div className="cobrancas-opcoes-titulo">
              <img src={iconeCobrancaMain} alt="" />
              <h3>Cobrancas</h3>
            </div>

            <div className="cobrancas-opcoes-actions">
              <button className="btn-filtrar-cobranca">
                <img src={iconeFiltro} alt="Ícone filtrar" />
              </button>
              <input
                type="text"
                placeholder="Pesquisa"
                value={pesquisaCobranca}
                onChange={(event) => setPesquisaCobranca(event.target.value)}
                onKeyDown={handleRequestApi}
              />
            </div>
          </div>
          {!naoEncontrado && <TabelaCobrancas offset={offset} />}
          {naoEncontrado && <DivNaoEncontrado />}
          <Paginacao setOffset={setOffset} totalArray={totalCobrancas} />
        </div>
      </div>
      {abrirEditarUsuario && <ModalEditarUsuario />}
      {abrirModalEdicaoCobranca && (
        <ModalEditarCobranca getCobrancas={getCobrancas} />
      )}
      {abrirModalExcluirCobranca && (
        <ModalExcluirCobranca getCobrancas={getCobrancas} />
      )}
      {!abrirModalEdicaoCobranca &&
        !abrirModalExcluirCobranca &&
        abrirModalDetalharCobranca && <ModalDetalheCobranca />}
      {alteracaoUsuarioSucesso && <ModalSucessoAlterarCadastro />}
      {exibirToast && (
        <ToastAlerta
          mensagemToast={mensagemToast}
          tipoMensagem={tipoMensagem}
        />
      )}
    </>
  );
}

export default Cobrancas;
