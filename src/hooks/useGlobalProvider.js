import { useReducer, useState } from "react";
import { useLocalStorage } from "react-use";

const INPUT_USUARIO_VAZIO = {
  nome_usuario: "",
  email: "",
  cpf: "",
  telefone: "",
  senha: "",
  confirmarSenha: "",
};

const INPUT_CLIENTE_VAZIO = {
  nome_cliente: "",
  email: "",
  cpf: "",
  telefone: "",
  logradouro: "",
  complemento: "",
  cep: "",
  bairro: "",
  cidade: "",
  estado: "",
};

const INPUT_COBRANCAS_VAZIO = { descricao: "", vencimento: "", valor: "" };

const INITIAL_UI_STATE = {
  abrirEditarUsuario: false,
  alteracaoUsuarioSucesso: false,
  exibirToast: false,
  usuarioEdicao: false,
  abrirModalCadastroCliente: false,
  nomeClienteModalCobranca: "",
  abrirModalCadastroCobrancas: false,
  mensagemToast: "",
  tipoMensagem: "",
  abrirModalEditarCliente: false,
  abrirModalDetalharCobranca: false,
  abrirModalEdicaoCobranca: false,
  editarClienteSucesso: false,
  clienteEdicao: false,
  cobrancaEdicao: false,
  abrirModalExcluirCobranca: false,
  clickFiltroClientes: "",
  clickFiltroCobrancas: "",
  totalCobrancas: 0,
  totalClientes: 0,
};

const INITIAL_LISTAS_STATE = {
  clientesList: [],
  clientesListTemp: [],
  cobrancasList: [],
  cobrancasListTemp: [],
  cobrancasListDetalhar: [],
  cobrancaClienteDetalhar: [],
  clientesInadimplentes: [],
  clientesEmDia: [],
  cobrancasVencidas: [],
  cobrancasPrevistas: [],
  cobrancasPagas: [],
};

function stateReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: typeof action.value === "function"
          ? action.value(state[action.field])
          : action.value,
      };
    default:
      return state;
  }
}

function createStateSetter(dispatch, field) {
  return (value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };
}


function useGlobalProvider() {
  const [uiState, dispatchUi] = useReducer(stateReducer, INITIAL_UI_STATE);
  const [listasState, dispatchListas] = useReducer(stateReducer, INITIAL_LISTAS_STATE);
  const [clienteDetalhado, setClienteDetalhado] = useState(INPUT_CLIENTE_VAZIO);
  const [idCliente, setIdCliente] = useLocalStorage('idCliente', "");
  const [idCobranca, setIdCobranca] = useLocalStorage('idCobranca', "");
  const [cobrancaAExcluir, setCobrancaAExcluir] = useState(INPUT_COBRANCAS_VAZIO);

  const {
    abrirEditarUsuario,
    alteracaoUsuarioSucesso,
    exibirToast,
    usuarioEdicao,
    abrirModalCadastroCliente,
    nomeClienteModalCobranca,
    abrirModalCadastroCobrancas,
    mensagemToast,
    tipoMensagem,
    abrirModalEditarCliente,
    abrirModalDetalharCobranca,
    abrirModalEdicaoCobranca,
    editarClienteSucesso,
    clienteEdicao,
    cobrancaEdicao,
    abrirModalExcluirCobranca,
    clickFiltroClientes,
    clickFiltroCobrancas,
    totalCobrancas,
    totalClientes,
  } = uiState;

  const {
    clientesList,
    clientesListTemp,
    cobrancasList,
    cobrancasListTemp,
    cobrancasListDetalhar,
    cobrancaClienteDetalhar,
    clientesInadimplentes,
    clientesEmDia,
    cobrancasVencidas,
    cobrancasPrevistas,
    cobrancasPagas,
  } = listasState;

  const setAbrirEditarUsuario = createStateSetter(dispatchUi, "abrirEditarUsuario");
  const setAlteracaoUsuarioSucesso = createStateSetter(dispatchUi, "alteracaoUsuarioSucesso");
  const setExibirToast = createStateSetter(dispatchUi, "exibirToast");
  const setUsuarioEdicao = createStateSetter(dispatchUi, "usuarioEdicao");
  const setAbrirModalCadastroCliente = createStateSetter(dispatchUi, "abrirModalCadastroCliente");
  const setNomeClienteModalCobranca = createStateSetter(dispatchUi, "nomeClienteModalCobranca");
  const setAbrirModalCadastroCobrancas = createStateSetter(dispatchUi, "abrirModalCadastroCobrancas");
  const setMensagemToast = createStateSetter(dispatchUi, "mensagemToast");
  const setTipoMensagem = createStateSetter(dispatchUi, "tipoMensagem");
  const setAbrirModalEditarCliente = createStateSetter(dispatchUi, "abrirModalEditarCliente");
  const setAbrirModalDetalharCobranca = createStateSetter(dispatchUi, "abrirModalDetalharCobranca");
  const setAbrirModalEdicaoCobranca = createStateSetter(dispatchUi, "abrirModalEdicaoCobranca");
  const setEditarClienteSucesso = createStateSetter(dispatchUi, "editarClienteSucesso");
  const setClienteEdicao = createStateSetter(dispatchUi, "clienteEdicao");
  const setCobrancaEdicao = createStateSetter(dispatchUi, "cobrancaEdicao");
  const setAbrirModalExcluirCobranca = createStateSetter(dispatchUi, "abrirModalExcluirCobranca");
  const setClickFiltroClientes = createStateSetter(dispatchUi, "clickFiltroClientes");
  const setClickFiltroCobrancas = createStateSetter(dispatchUi, "clickFiltroCobrancas");
  const setTotalCobrancas = createStateSetter(dispatchUi, "totalCobrancas");
  const setTotalClientes = createStateSetter(dispatchUi, "totalClientes");

  const setClientesList = createStateSetter(dispatchListas, "clientesList");
  const setClientesListTemp = createStateSetter(dispatchListas, "clientesListTemp");
  const setCobrancasList = createStateSetter(dispatchListas, "cobrancasList");
  const setCobrancasListTemp = createStateSetter(dispatchListas, "cobrancasListTemp");
  const setCobrancasListDetalhar = createStateSetter(dispatchListas, "cobrancasListDetalhar");
  const setCobrancaClienteDetalhar = createStateSetter(dispatchListas, "cobrancaClienteDetalhar");
  const setClientesInadimplentes = createStateSetter(dispatchListas, "clientesInadimplentes");
  const setClientesEmDia = createStateSetter(dispatchListas, "clientesEmDia");
  const setCobrancasVencidas = createStateSetter(dispatchListas, "cobrancasVencidas");
  const setCobrancasPrevistas = createStateSetter(dispatchListas, "cobrancasPrevistas");
  const setCobrancasPagas = createStateSetter(dispatchListas, "cobrancasPagas");

  function fecharModalCadastrarCliente() {
    setAbrirModalCadastroCliente(false);
  }

  function fecharModalCadastroCobranca() {
    setAbrirModalCadastroCobrancas(false);
  }

  function fecharModalEditarCliente() {
    setAbrirModalEditarCliente(false);
  }

  function fecharModalEditarCobranca() {
    setAbrirModalEdicaoCobranca(false);
    fecharModalDetalheCobranca();
  }

  function fecharModalDetalheCobranca() {
    setAbrirModalDetalharCobranca(false);
  }

  function abrirModalCadastrarCobranca(cliente) {
    setIdCliente(cliente.id);
    setNomeClienteModalCobranca(cliente.nome_cliente);
    setAbrirModalCadastroCobrancas(true);
  }

  function setDadosCobrancaModal(cobranca, nomeCliente) {
    setIdCobranca(cobranca.id);
    setIdCliente(cobranca.cliente_id);
    setNomeClienteModalCobranca(nomeCliente);
  }

  function abrirModalEditarCobrancaPageCliente(cobranca) {
    setDadosCobrancaModal(cobranca, clienteDetalhado.nome_cliente);
    setAbrirModalEdicaoCobranca(true);
  }

  function abrirModalEditarCobranca(cobranca) {
    setDadosCobrancaModal(cobranca, cobranca.nome_cliente);
    setAbrirModalEdicaoCobranca(true);
  }

  function abrirModalDetalheCobrancaPageCliente(cobranca) {
    setIdCobranca(cobranca.id);
    setNomeClienteModalCobranca(clienteDetalhado.nome_cliente);
    setCobrancaClienteDetalhar(cobranca);
    setAbrirModalDetalharCobranca(true);
  }

  function abrirModalDetalheCobranca(cobranca) {
    setIdCobranca(cobranca.id);
    setNomeClienteModalCobranca(cobranca.nome_cliente);
    setCobrancaClienteDetalhar(cobranca);
    setAbrirModalDetalharCobranca(true);
  }
  function fecharModalExcluirCobranca() {
    setAbrirModalExcluirCobranca(false);
    fecharModalDetalheCobranca();
  }
  function handleClickModalExcluir(cobranca) {
    setIdCobranca(cobranca.id);
    setAbrirModalExcluirCobranca(true);
    setCobrancaAExcluir(cobranca);
  }

  return {
    abrirEditarUsuario,
    setAbrirEditarUsuario,
    alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso,
    exibirToast,
    setExibirToast,
    usuarioEdicao,
    setUsuarioEdicao,
    inputUsuarioVazio: INPUT_USUARIO_VAZIO,
    abrirModalCadastroCliente,
    setAbrirModalCadastroCliente,
    inputClienteVazio: INPUT_CLIENTE_VAZIO,
    clientesList,
    setClientesList,
    clientesListTemp,
    setClientesListTemp,
    abrirModalCadastroCobrancas,
    setAbrirModalCadastroCobrancas,
    nomeClienteModalCobranca,
    setNomeClienteModalCobranca,
    inputCobrancasVazio: INPUT_COBRANCAS_VAZIO,
    mensagemToast,
    setMensagemToast,
    tipoMensagem,
    setTipoMensagem,
    clienteDetalhado,
    setClienteDetalhado,
    abrirModalEditarCliente,
    setAbrirModalEditarCliente,
    editarClienteSucesso,
    setEditarClienteSucesso,
    fecharModalCadastrarCliente,
    fecharModalCadastroCobranca,
    fecharModalEditarCliente,
    cobrancasList,
    setCobrancasList,
    cobrancasListTemp,
    setCobrancasListTemp,
    idCliente,
    setIdCliente,
    abrirModalCadastrarCobranca,
    clienteEdicao,
    setClienteEdicao,
    cobrancasListDetalhar,
    setCobrancasListDetalhar,
    cobrancaClienteDetalhar,
    setCobrancaClienteDetalhar,
    abrirModalEdicaoCobranca,
    setAbrirModalEdicaoCobranca,
    fecharModalEditarCobranca,
    idCobranca,
    setIdCobranca,
    abrirModalEditarCobranca,
    abrirModalEditarCobrancaPageCliente,
    abrirModalDetalheCobrancaPageCliente,
    abrirModalDetalharCobranca,
    setAbrirModalDetalharCobranca,
    abrirModalDetalheCobranca,
    fecharModalDetalheCobranca,
    cobrancaEdicao,
    setCobrancaEdicao,
    abrirModalExcluirCobranca,
    setAbrirModalExcluirCobranca,
    fecharModalExcluirCobranca,
    cobrancaAExcluir,
    setCobrancaAExcluir,
    handleClickModalExcluir,
    clickFiltroClientes,
    setClickFiltroClientes,
    clientesInadimplentes,
    setClientesInadimplentes,
    clientesEmDia,
    setClientesEmDia,
    cobrancasVencidas,
    setCobrancasVencidas,
    cobrancasPrevistas,
    setCobrancasPrevistas,
    cobrancasPagas,
    setCobrancasPagas,
    clickFiltroCobrancas,
    setClickFiltroCobrancas,
    totalCobrancas,
    setTotalCobrancas,
    totalClientes,
    setTotalClientes
  };
}

export default useGlobalProvider;