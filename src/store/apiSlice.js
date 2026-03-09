import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("Token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Clientes", "Cobrancas"],
  endpoints: (builder) => ({
    getClientes: builder.query({
      query: ({ limit = 1000, offset = 0 } = {}) =>
        `/clientes?limit=${limit}&offset=${offset}`,
      providesTags: ["Clientes"],
    }),
    searchClientes: builder.query({
      query: (busca) => `/clientes/busca?busca=${encodeURIComponent(busca)}`,
    }),
    getClienteById: builder.query({
      query: (idCliente) => `/clientes/${idCliente}`,
      providesTags: (result, error, idCliente) => [{ type: "Clientes", id: idCliente }],
    }),
    getCobrancas: builder.query({
      query: ({ limit = 1000, offset = 0 } = {}) =>
        `/cobrancas?limit=${limit}&offset=${offset}`,
      providesTags: ["Cobrancas"],
    }),
    searchCobrancas: builder.query({
      query: (busca) => `/cobrancas/busca?busca=${encodeURIComponent(busca)}`,
    }),
    getCobrancasByCliente: builder.query({
      query: (idCliente) => `/cobrancas/${idCliente}`,
      providesTags: (result, error, idCliente) => [{ type: "Cobrancas", id: idCliente }],
    }),
  }),
});

export const {
  useGetClientesQuery,
  useLazyGetClientesQuery,
  useLazySearchClientesQuery,
  useGetClienteByIdQuery,
  useGetCobrancasQuery,
  useLazySearchCobrancasQuery,
  useGetCobrancasByClienteQuery,
  useLazyGetCobrancasByClienteQuery,
} = apiSlice;
