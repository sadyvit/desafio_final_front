import iconeEmDia from "../../assets/icone-cliente-dia.svg";
import iconeInadimplente from "../../assets/icone-cliente-inadimplente.svg";
import iconePaga from "../../assets/icone-cobranca-paga.svg";
import iconePrevista from "../../assets/icone-cobranca-prevista.svg";
import iconeVencida from "../../assets/icone-cobranca-vencida.svg";
import TabelaClientesStatus from "../../components/TabelaClientesStatus";
import TabelaDadosCobrancas from "../../components/TabelaDadosCobrancas";
import UserMenu from "../../components/UserMenu";
import useGlobal from "../../hooks/useGlobal";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import "./styles.css";
import { useEffect, useState } from "react";
import ModalSucessoAlterarCadastro from "../../components/ModalSucessoAlterarCadastro";
import Sidebar from "../../components/Sidebar";
import iconeClienteOff from "../../assets/clientsOff.svg";
import iconeHomeOn from "../../assets/homeOn.svg";
import iconeCobrancaInactive from "../../assets/icone-cobranca-inactive.svg";
import ToastAlerta from "../../components/ToastAlerta";
import useAuth from "../../hooks/useAuth";

function Home() {
  const {
    abrirEditarUsuario,
    alteracaoUsuarioSucesso,
    setAlteracaoUsuarioSucesso,
    exibirToast,
    setExibirToast,
    mensagemToast,
    tipoMensagem,
    setClientesList,
    setClientesListTemp,
    clientesInadimplentes,
    setClientesInadimplentes,
    clientesEmDia,
    setClientesEmDia,
    setCobrancasVencidas,
    setCobrancasPrevistas,
    setCobrancasPagas,
    cobrancasPagas,
    cobrancasPrevistas,
    cobrancasVencidas,
    setCobrancasListTemp,
    setCobrancasList,
    cobrancasList,
    setTotalCobrancas,
    setTotalClientes,
  } = useGlobal();
  const { token } = useAuth();
  const [somaVencidas, setSomaVencidas] = useState(0);
  const [somaPagas, setSomaPagas] = useState(0);
  const [somaPrevistas, setSomaPrevistas] = useState(0);

  useEffect(() => {
    const sumVencidas = cobrancasList.reduce((acum, intem) => {
      return intem.status === "vencida" ? acum + Number(intem.valor) : acum + 0;
    }, 0);
    const sumPagas = cobrancasList.reduce((acum, intem) => {
      return intem.status === "paga" ? acum + Number(intem.valor) : acum + 0;
    }, 0);
    const sumPrevistas = cobrancasList.reduce((acum, intem) => {
      return intem.status === "pendente"
        ? acum + Number(intem.valor)
        : acum + 0;
    }, 0);
    setSomaVencidas(sumVencidas);
    setSomaPagas(sumPagas);
    setSomaPrevistas(sumPrevistas);
  }, [cobrancasList]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlteracaoUsuarioSucesso(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alteracaoUsuarioSucesso]);

  useEffect(() => {
    let interval;
    if (exibirToast) {
      interval = setInterval(() => {
        setExibirToast(true);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [exibirToast]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExibirToast(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [exibirToast]);

  useEffect(() => {
    getClientes();
  }, []);

  useEffect(() => {
    getCobrancas();
  }, []);

  async function getClientes() {
    try {
      const response = await fetch("process.env.API_URL/clientes", {
        method: "GET",
        Authorization: `Bearer ${token}`,
      });

      const data = await response.json();
      setClientesList(data.clientes);
      setClientesListTemp(data.clientes);
      setTotalClientes(data.quantidadeClientes[0].count);
      setClientesInadimplentes(data.clientes.filter((d) => d.status === false));
      setClientesEmDia(data.clientes.filter((d) => d.status === true));
    } catch (error) {
      console.log(error);
    }
  }

  async function getCobrancas() {
    try {
      const response = await fetch(`${process.env.API_URL}/cobrancas`, {
        method: "GET",
        Authorization: `Bearer ${token}`,
      });
      const data = await response.json();
      setCobrancasListTemp(data.cobrancas);
      setTotalCobrancas(data.quantidadeCobrancas[0].count);
      setCobrancasList(data.cobrancas);
      setCobrancasVencidas(
        data.cobrancas.filter((d) => d.status.toLowerCase() === "vencida")
      );
      setCobrancasPrevistas(
        data.cobrancas.filter((d) => d.status.toLowerCase() === "pendente")
      );
      setCobrancasPagas(
        data.cobrancas.filter((d) => d.status.toLowerCase() === "paga")
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        className={`home ${
          (abrirEditarUsuario || alteracaoUsuarioSucesso) && "blur-modal"
        }`}
      >
        <Sidebar
          imagemHome={iconeHomeOn}
          imagemClientes={iconeClienteOff}
          imagemCobranca={iconeCobrancaInactive}
        />
        <div className="main-tables">
          <div className="home-title">
            <h3>Resumo das cobranças</h3>
            <UserMenu />
          </div>
          <hr />
          <div className="cobrancas-detalhamento cobrancas-saldo">
            <div className="cobranca-paga">
              <img
                className="cobranca-icone"
                src={iconePaga}
                alt="Cobrança Paga"
              />
              <div className="cobranca-info">
                <span className="saldo-titulo">Cobranças Pagas</span>
                <span className="saldo-valor">
                  {Number(somaPagas).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            <div className="cobranca-vencida">
              <img
                className="cobranca-icone"
                src={iconeVencida}
                alt="Cobrança Vencida"
              />
              <div className="cobranca-info">
                <span className="saldo-titulo">Cobranças Vencidas</span>
                <span className="saldo-valor">
                  {Number(somaVencidas).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            <div className="cobranca-prevista">
              <img
                className="cobranca-icone"
                src={iconePrevista}
                alt="Cobrança Prevista"
              />
              <div className="cobranca-info">
                <span className="saldo-titulo">Cobranças Previstas</span>
                <span className="saldo-valor">
                  {Number(somaPrevistas).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="cobrancas-detalhamento">
            <TabelaDadosCobrancas
              tituloStatus={"Vencidas"}
              classeQuantidade={"quantidade-vencidas"}
              array={cobrancasVencidas}
            />

            <TabelaDadosCobrancas
              tituloStatus={"Previstas"}
              classeQuantidade={"quantidade-previstas"}
              array={cobrancasPrevistas}
            />

            <TabelaDadosCobrancas
              tituloStatus={"Pagas"}
              classeQuantidade={"quantidade-pagas"}
              array={cobrancasPagas}
            />
          </div>
          <div className="cobrancas-detalhamento">
            <TabelaClientesStatus
              tituloStatus={"Inadimplentes"}
              iconeCliente={iconeInadimplente}
              classeQuantidade={"quantidade-inadimplentes"}
              array={clientesInadimplentes}
            />

            <TabelaClientesStatus
              tituloStatus={"em dia"}
              iconeCliente={iconeEmDia}
              classeQuantidade={"quantidade-em-dia"}
              array={clientesEmDia}
            />
          </div>
        </div>
      </div>
      {abrirEditarUsuario && <ModalEditarUsuario />}
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

export default Home;
