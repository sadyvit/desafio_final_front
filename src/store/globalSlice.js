import { createSlice } from "@reduxjs/toolkit";

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

const INITIAL_INPUT_CLIENTE = {
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

const INITIAL_INPUT_COBRANCAS = { descricao: "", vencimento: "", valor: "" };

const initialState = {
  ui: INITIAL_UI_STATE,
  listas: INITIAL_LISTAS_STATE,
  clienteDetalhado: INITIAL_INPUT_CLIENTE,
  cobrancaAExcluir: INITIAL_INPUT_COBRANCAS,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUiField: (state, action) => {
      const { field, value } = action.payload;
      state.ui[field] = value;
    },
    setListasField: (state, action) => {
      const { field, value } = action.payload;
      state.listas[field] = value;
    },
    setClienteDetalhadoState: (state, action) => {
      state.clienteDetalhado = action.payload;
    },
    setCobrancaAExcluirState: (state, action) => {
      state.cobrancaAExcluir = action.payload;
    },
  },
});

export const {
  setUiField,
  setListasField,
  setClienteDetalhadoState,
  setCobrancaAExcluirState,
} = globalSlice.actions;

export default globalSlice.reducer;
