import "./style.css";
import iconeModalExcluir from "../../assets/icone-modal-excluir.svg";
import iconeFecharModalExcluir from "../../assets/icone-fechar.svg";
import useGlobal from "../../hooks/useGlobal";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

function ModalExcluirCobranca({ getCobrancas }) {
  const {
    setCobrancasListTemp,
    setCobrancasList,
    fecharModalExcluirCobranca,
    idCobranca,
    cobrancaAExcluir,
    setCobrancaAExcluir,
    exibirToast,
    setExibirToast,
    setTipoMensagem,
    setMensagemToast,
  } = useGlobal();
  const { token } = useAuth();

  async function handleDeleteCobranca() {
    if (cobrancaAExcluir.status !== "pendente") {
      fecharModalExcluirCobranca();
      setExibirToast(true);
      setTipoMensagem("erro");
      setMensagemToast("Esta cobrança não pode ser excluída!");
      return;
    }
    await fetch(`${process.env.API_URL}/cobrancas/${idCobranca}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    fecharModalExcluirCobranca();
    setExibirToast(true);
    setTipoMensagem("sucesso");
    setMensagemToast("Cobrança excluída com sucesso!");
    await getCobrancas();
  }

  return (
    <div className="modal-excluir-cobranca">
      <div className="excluir-img-msg">
        <img
          onClick={() => fecharModalExcluirCobranca()}
          className="img-fechar-modal"
          src={iconeFecharModalExcluir}
          alt="Fechar Modal"
        />
        <img src={iconeModalExcluir} alt="Icone Excluir" />
        <h3>Tem certeza que deseja excluir esta cobrança?</h3>
        <div className="btn-modal">
          <button
            onClick={() => fecharModalExcluirCobranca()}
            className="class-btn-modal não"
          >
            Não
          </button>
          <button
            onClick={handleDeleteCobranca}
            className="class-btn-modal sim"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalExcluirCobranca;
