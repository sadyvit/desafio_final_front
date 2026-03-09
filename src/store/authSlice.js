import { createSlice } from "@reduxjs/toolkit";

function getStorageValue(key) {
  const value = localStorage.getItem(key);
  if (value === null || value === "undefined") {
    return null;
  }
  return value;
}

const initialState = {
  token: getStorageValue("Token"),
  nomeUsuarioHeader: getStorageValue("nomeUsuarioHeader"),
  primeiraInicialHeader: getStorageValue("primeiraInicialHeader"),
  segundaInicialHeader: getStorageValue("segundaInicialHeader"),
  exibirToastLogin: false,
  tipoMesagemLogin: "",
  mensagemToastLogin: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokenState: (state, action) => {
      state.token = action.payload;
    },
    setNomeUsuarioHeaderState: (state, action) => {
      state.nomeUsuarioHeader = action.payload;
    },
    setPrimeiraInicialHeaderState: (state, action) => {
      state.primeiraInicialHeader = action.payload;
    },
    setSegundaInicialHeaderState: (state, action) => {
      state.segundaInicialHeader = action.payload;
    },
    setExibirToastLoginState: (state, action) => {
      state.exibirToastLogin = action.payload;
    },
    setTipoMensagemLoginState: (state, action) => {
      state.tipoMesagemLogin = action.payload;
    },
    setMensagemToastLoginState: (state, action) => {
      state.mensagemToastLogin = action.payload;
    },
    clearAuthState: (state) => {
      state.token = null;
      state.nomeUsuarioHeader = null;
      state.primeiraInicialHeader = null;
      state.segundaInicialHeader = null;
    },
  },
});

export const {
  setTokenState,
  setNomeUsuarioHeaderState,
  setPrimeiraInicialHeaderState,
  setSegundaInicialHeaderState,
  setExibirToastLoginState,
  setTipoMensagemLoginState,
  setMensagemToastLoginState,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
