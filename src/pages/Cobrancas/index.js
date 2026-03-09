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
import TabelaCobrancas from "../../components/TabelaCobrancas";
import ToastAlerta from "../../components/ToastAlerta";
import DivNaoEncontrado from "../../components/DivNaoEncontrado";
import Paginacao from "../../components/Paginacao";
import useGlobalUi from "../../hooks/global/useGlobalUi";
import useGlobalListas from "../../hooks/global/useGlobalListas";
import { useGetCobrancasQuery, useLazySearchCobrancasQuery } from "../../store/apiSlice";
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
    clickFiltroCobrancas,
    totalCobrancas,
    setTotalCobrancas,
  } = useGlobalUi();

  const {
    cobrancasList,
    setCobrancasListTemp,
    setCobrancasList,
  } = useGlobalListas();

  const { data: cobrancasData, error: cobrancasError, refetch: refetchCobrancas } =
    useGetCobrancasQuery({ limit: 1000, offset: 0 });
  const [searchCobrancas] = useLazySearchCobrancasQuery();

  const [pesquisaCobranca, setPesquisaCobranca] = useState("");
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

  async function getCobrancas() {
    await refetchCobrancas();
  }

  useEffect(() => {
    if (cobrancasError) {
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Nao foi possivel carregar cobrancas.");
      return;
    }

    if (!cobrancasData) {
      return;
    }

    const cobrancas = Array.isArray(cobrancasData?.cobrancas)
      ? cobrancasData.cobrancas
      : [];
    const quantidade = Number(cobrancasData?.quantidadeCobrancas?.[0]?.count ?? 0);

    setCobrancasList(cobrancas);
    const vencidas = cobrancas.filter((d) => d.status.toLowerCase() === "vencida");
    const previstas = cobrancas.filter((d) => d.status.toLowerCase() === "pendente");
    const pagas = cobrancas.filter((d) => d.status.toLowerCase() === "paga");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cobrancasData, cobrancasError, clickFiltroCobrancas]);

  async function handleRequestApi(event) {
    if (event.key !== "Enter") return;
    if (event.key === "Enter" && event.target.value === "") {
      setTotalCobrancas(cobrancasList.length);
      setCobrancasListTemp(cobrancasList);
      setNaoEncontrado(cobrancasList.length === 0);
      return;
    }
    try {
      const data = await searchCobrancas(pesquisaCobranca).unwrap();

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
      setMensagemToast("Nao foi possivel pesquisar cobrancas.");
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
