import { useCallback } from "react";
import { useLocalStorage } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import {
  setCobrancaAExcluirState,
  setClienteDetalhadoState,
  setListasField,
  setUiField,
} from "../../store/globalSlice";

function useGlobalDomain() {
  const dispatch = useDispatch();
  const { clienteDetalhado, cobrancaAExcluir, listas, ui } = useSelector(
    (state) => state.global
  );
  const [idCliente, setIdCliente] = useLocalStorage("idCliente", "");
  const [idCobranca, setIdCobranca] = useLocalStorage("idCobranca", "");

  const setUi = useCallback(
    (field, value) => {
      dispatch(setUiField({ field, value }));
    },
    [dispatch]
  );

  const setListas = useCallback(
    (field, value) => {
      dispatch(setListasField({ field, value }));
    },
    [dispatch]
  );

  const setClienteDetalhado = useCallback(
    (value) => {
      dispatch(setClienteDetalhadoState(value));
    },
    [dispatch]
  );

  const setCobrancaAExcluir = useCallback(
    (value) => {
      dispatch(setCobrancaAExcluirState(value));
    },
    [dispatch]
  );

  function fecharModalCadastrarCliente() {
    setUi("abrirModalCadastroCliente", false);
  }

  function fecharModalCadastroCobranca() {
    setUi("abrirModalCadastroCobrancas", false);
  }

  function fecharModalEditarCliente() {
    setUi("abrirModalEditarCliente", false);
  }

  function fecharModalEditarCobranca() {
    setUi("abrirModalEdicaoCobranca", false);
    fecharModalDetalheCobranca();
  }

  function fecharModalDetalheCobranca() {
    setUi("abrirModalDetalharCobranca", false);
  }

  function abrirModalCadastrarCobranca(cliente) {
    setIdCliente(cliente.id);
    setUi("nomeClienteModalCobranca", cliente.nome_cliente);
    setUi("abrirModalCadastroCobrancas", true);
  }

  function setDadosCobrancaModal(cobranca, nomeCliente) {
    setIdCobranca(cobranca.id);
    setIdCliente(cobranca.cliente_id);
    setUi("nomeClienteModalCobranca", nomeCliente);
  }

  function abrirModalEditarCobrancaPageCliente(cobranca) {
    setDadosCobrancaModal(cobranca, clienteDetalhado.nome_cliente);
    setUi("abrirModalEdicaoCobranca", true);
  }

  function abrirModalEditarCobranca(cobranca) {
    setDadosCobrancaModal(cobranca, cobranca.nome_cliente);
    setUi("abrirModalEdicaoCobranca", true);
  }

  function abrirModalDetalheCobrancaPageCliente(cobranca) {
    setIdCobranca(cobranca.id);
    setUi("nomeClienteModalCobranca", clienteDetalhado.nome_cliente);
    setListas("cobrancaClienteDetalhar", cobranca);
    setUi("abrirModalDetalharCobranca", true);
  }

  function abrirModalDetalheCobranca(cobranca) {
    setIdCobranca(cobranca.id);
    setUi("nomeClienteModalCobranca", cobranca.nome_cliente);
    setListas("cobrancaClienteDetalhar", cobranca);
    setUi("abrirModalDetalharCobranca", true);
  }

  function fecharModalExcluirCobranca() {
    setUi("abrirModalExcluirCobranca", false);
    fecharModalDetalheCobranca();
  }

  function handleClickModalExcluir(cobranca) {
    setIdCobranca(cobranca.id);
    setUi("abrirModalExcluirCobranca", true);
    setCobrancaAExcluir(cobranca);
  }

  return {
    clienteDetalhado,
    setClienteDetalhado,
    idCliente,
    setIdCliente,
    idCobranca,
    setIdCobranca,
    cobrancaAExcluir,
    setCobrancaAExcluir,
    nomeClienteModalCobranca: ui.nomeClienteModalCobranca,
    cobrancaClienteDetalhar: listas.cobrancaClienteDetalhar,
    setCobrancaClienteDetalhar: (value) => setListas("cobrancaClienteDetalhar", value),
    fecharModalCadastrarCliente,
    fecharModalCadastroCobranca,
    fecharModalEditarCliente,
    fecharModalEditarCobranca,
    fecharModalDetalheCobranca,
    fecharModalExcluirCobranca,
    abrirModalCadastrarCobranca,
    abrirModalEditarCobranca,
    abrirModalEditarCobrancaPageCliente,
    abrirModalDetalheCobranca,
    abrirModalDetalheCobrancaPageCliente,
    handleClickModalExcluir,
  };
}

export default useGlobalDomain;
