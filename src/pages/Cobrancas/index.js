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
    setMensagemToast,
    setTipoMensagem,
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
  }, [alteracaoUsuarioSucesso, setAlteracaoUsuarioSucesso]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExibirToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [exibirToast, setExibirToast]);

  useEffect(() => {
    getCobrancas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCobrancas() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cobrancas?limit=1000&offset=0`,
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
            : "Não foi possível carregar cobranças."
        );
        return;
      }

      const data = await response.json();

      const cobrancas = Array.isArray(data?.cobrancas) ? data.cobrancas : [];
      const quantidade = Number(data?.quantidadeCobrancas?.[0]?.count ?? 0);

      setCobrancasList(cobrancas);
      const vencidas = cobrancas.filter(
        (d) => d.status.toLowerCase() === "vencida"
      );
      const previstas = cobrancas.filter(
        (d) => d.status.toLowerCase() === "pendente"
      );
      const pagas = cobrancas.filter(
        (d) => d.status.toLowerCase() === "paga"
      );
      setTotalCobrancas(
        clickFiltroCobrancas === "pagas"
          ? pagas.length
          : clickFiltroCobrancas === "previstas"
          ? previstas.length
          : clickFiltroCobrancas === "vencidas"
          ? vencidas.length
          : quantidade
      );
      setCobrancasListTemp(
        clickFiltroCobrancas === "pagas"
          ? pagas
          : clickFiltroCobrancas === "previstas"
          ? previstas
          : clickFiltroCobrancas === "vencidas"
          ? vencidas
          : cobrancas
      );
      setNaoEncontrado(cobrancas.length === 0);
    } catch (error) {
      console.log(error.message);
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Erro de conexão ao carregar cobranças.");
    }
  }

  async function handleRequestApi(event) {
    if (event.key !== "Enter") return;
    if (event.key === "Enter" && event.target.value === "") {
      setTotalCobrancas(cobrancasList.length);
      setCobrancasListTemp(cobrancasList);
      setNaoEncontrado(cobrancasList.length === 0);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/cobrancas/busca?busca=${pesquisaCobranca}`,
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
            : "Não foi possível pesquisar cobranças."
        );
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data) || !data.length) {
        setNaoEncontrado(true);
        return;
      }
      setTotalCobrancas(data.length);
      setCobrancasListTemp(data);
      setNaoEncontrado(false);
    } catch (error) {
      console.log(error);
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Erro de conexão ao pesquisar cobranças.");
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
          {!naoEncontrado && totalCobrancas > 0 && (
            <Paginacao setOffset={setOffset} totalArray={totalCobrancas} />
          )}
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
