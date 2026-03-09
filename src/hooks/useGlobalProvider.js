import useGlobalUi from "./global/useGlobalUi";
import useGlobalListas from "./global/useGlobalListas";
import useGlobalDomain from "./global/useGlobalDomain";
import {
  INPUT_CLIENTE_VAZIO,
  INPUT_COBRANCAS_VAZIO,
  INPUT_USUARIO_VAZIO,
} from "./global/globalConstants";

function useGlobalProvider() {
  const globalUi = useGlobalUi();
  const globalListas = useGlobalListas();
  const globalDomain = useGlobalDomain();

  return {
    ...globalUi,
    ...globalListas,
    ...globalDomain,
    dadosUsuario: globalUi.usuarioEdicao,
    inputUsuarioVazio: INPUT_USUARIO_VAZIO,
    inputClienteVazio: INPUT_CLIENTE_VAZIO,
    inputCobrancasVazio: INPUT_COBRANCAS_VAZIO,
  };
}

export default useGlobalProvider;
