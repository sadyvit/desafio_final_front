import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListasField } from "../../store/globalSlice";

function useGlobalListas() {
  const dispatch = useDispatch();
  const listas = useSelector((state) => state.global.listas);
  const setterCacheRef = useRef({});

  const createListasSetter = useCallback((field) => {
    if (!setterCacheRef.current[field]) {
      setterCacheRef.current[field] = (value) => {
        dispatch(setListasField({ field, value }));
      };
    }

    return setterCacheRef.current[field];
  }, [dispatch]);

  return {
    clientesList: listas.clientesList,
    setClientesList: createListasSetter("clientesList"),
    clientesListTemp: listas.clientesListTemp,
    setClientesListTemp: createListasSetter("clientesListTemp"),
    cobrancasList: listas.cobrancasList,
    setCobrancasList: createListasSetter("cobrancasList"),
    cobrancasListTemp: listas.cobrancasListTemp,
    setCobrancasListTemp: createListasSetter("cobrancasListTemp"),
    cobrancasListDetalhar: listas.cobrancasListDetalhar,
    setCobrancasListDetalhar: createListasSetter("cobrancasListDetalhar"),
    cobrancaClienteDetalhar: listas.cobrancaClienteDetalhar,
    setCobrancaClienteDetalhar: createListasSetter("cobrancaClienteDetalhar"),
    clientesInadimplentes: listas.clientesInadimplentes,
    setClientesInadimplentes: createListasSetter("clientesInadimplentes"),
    clientesEmDia: listas.clientesEmDia,
    setClientesEmDia: createListasSetter("clientesEmDia"),
    cobrancasVencidas: listas.cobrancasVencidas,
    setCobrancasVencidas: createListasSetter("cobrancasVencidas"),
    cobrancasPrevistas: listas.cobrancasPrevistas,
    setCobrancasPrevistas: createListasSetter("cobrancasPrevistas"),
    cobrancasPagas: listas.cobrancasPagas,
    setCobrancasPagas: createListasSetter("cobrancasPagas"),
  };
}

export default useGlobalListas;
