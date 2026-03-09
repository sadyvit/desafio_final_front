import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUiField } from "../../store/globalSlice";

function useGlobalUi() {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.global.ui);
  const setterCacheRef = useRef({});

  const createUiSetter = useCallback((field) => {
    if (!setterCacheRef.current[field]) {
      setterCacheRef.current[field] = (value) => {
        dispatch(setUiField({ field, value }));
      };
    }

    return setterCacheRef.current[field];
  }, [dispatch]);

  return {
    abrirEditarUsuario: ui.abrirEditarUsuario,
    setAbrirEditarUsuario: createUiSetter("abrirEditarUsuario"),
    alteracaoUsuarioSucesso: ui.alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso: createUiSetter("alteracaoUsuarioSucesso"),
    exibirToast: ui.exibirToast,
    setExibirToast: createUiSetter("exibirToast"),
    usuarioEdicao: ui.usuarioEdicao,
    setUsuarioEdicao: createUiSetter("usuarioEdicao"),
    abrirModalCadastroCliente: ui.abrirModalCadastroCliente,
    setAbrirModalCadastroCliente: createUiSetter("abrirModalCadastroCliente"),
    nomeClienteModalCobranca: ui.nomeClienteModalCobranca,
    setNomeClienteModalCobranca: createUiSetter("nomeClienteModalCobranca"),
    abrirModalCadastroCobrancas: ui.abrirModalCadastroCobrancas,
    setAbrirModalCadastroCobrancas: createUiSetter("abrirModalCadastroCobrancas"),
    mensagemToast: ui.mensagemToast,
    setMensagemToast: createUiSetter("mensagemToast"),
    tipoMensagem: ui.tipoMensagem,
    setTipoMensagem: createUiSetter("tipoMensagem"),
    abrirModalEditarCliente: ui.abrirModalEditarCliente,
    setAbrirModalEditarCliente: createUiSetter("abrirModalEditarCliente"),
    abrirModalDetalharCobranca: ui.abrirModalDetalharCobranca,
    setAbrirModalDetalharCobranca: createUiSetter("abrirModalDetalharCobranca"),
    abrirModalEdicaoCobranca: ui.abrirModalEdicaoCobranca,
    setAbrirModalEdicaoCobranca: createUiSetter("abrirModalEdicaoCobranca"),
    editarClienteSucesso: ui.editarClienteSucesso,
    setEditarClienteSucesso: createUiSetter("editarClienteSucesso"),
    clienteEdicao: ui.clienteEdicao,
    setClienteEdicao: createUiSetter("clienteEdicao"),
    cobrancaEdicao: ui.cobrancaEdicao,
    setCobrancaEdicao: createUiSetter("cobrancaEdicao"),
    abrirModalExcluirCobranca: ui.abrirModalExcluirCobranca,
    setAbrirModalExcluirCobranca: createUiSetter("abrirModalExcluirCobranca"),
    clickFiltroClientes: ui.clickFiltroClientes,
    setClickFiltroClientes: createUiSetter("clickFiltroClientes"),
    clickFiltroCobrancas: ui.clickFiltroCobrancas,
    setClickFiltroCobrancas: createUiSetter("clickFiltroCobrancas"),
    totalCobrancas: ui.totalCobrancas,
    setTotalCobrancas: createUiSetter("totalCobrancas"),
    totalClientes: ui.totalClientes,
    setTotalClientes: createUiSetter("totalClientes"),
  };
}

export default useGlobalUi;
