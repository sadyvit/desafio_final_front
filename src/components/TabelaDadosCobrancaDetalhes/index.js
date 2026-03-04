import arrowIcon from "../../assets/arrow-icon.svg";
import iconeEditar from "../../assets/icone-editar.svg";
import iconeExcluir from "../../assets/icone-excluir-cobranca.svg";
import iconeAddCliente from "../../assets/icone-adicionar-cliente.svg";
import useGlobal from "../../hooks/useGlobal";
import { ordenarTabelaIdCobranca, ordenarTabelaDataCobranca } from "../../utils/utils";
import "./style.css";
import { useState } from "react";

function TabelaCobrancasDetalhe() {
  const {
    cobrancasListDetalhar,
    setCobrancasListDetalhar,
    abrirModalCadastrarCobranca,
    clienteDetalhado,
    abrirModalEditarCobrancaPageCliente,
    abrirModalDetalheCobrancaPageCliente,
    handleClickModalExcluir } = useGlobal();
  const [ordemIdCobranca, setOrdemIdCobranca] = useState('');
  const [ordemDataCobranca, setOrdemDataCobranca] = useState('');
  const listaCobrancasDetalhe = Array.isArray(cobrancasListDetalhar) ? cobrancasListDetalhar : [];

  return (
    <div className="tabela-cobranças-cliente">
      <div className="header-tabela-cobranca-detalhe">
        <span >Cobranças do Cliente</span>
        <button onClick={() => abrirModalCadastrarCobranca(clienteDetalhado)}>
          <img src={iconeAddCliente} alt="adicionar cliente" /> Nova cobrança
        </button>
      </div>
      <div className="titulo-coluna-cobrancas-detalhe">
        <span className="titulo-coluna-cobrancas-detalhe-span icone-ordem"
          onClick={() => ordenarTabelaIdCobranca(setOrdemIdCobranca, ordemIdCobranca, listaCobrancasDetalhe, setCobrancasListDetalhar)}>
          <img src={arrowIcon} alt="" />
          ID Cob.
        </span>
        <span className="titulo-coluna-cobrancas-detalhe-span">Valor</span>
        <span className="titulo-coluna-cobrancas-detalhe-span icone-ordem"
          onClick={() => ordenarTabelaDataCobranca(setOrdemDataCobranca, ordemDataCobranca, listaCobrancasDetalhe, setCobrancasListDetalhar)}>
          <img src={arrowIcon} alt="" />
          Data de venc.
        </span>
        <span className="titulo-coluna-cobrancas-detalhe-span">Status</span>
        <span className="titulo-coluna-cobrancas-detalhe-span">Descrição</span>
      </div>
      <div className="conteudo-cobrancas-detalhe">
        {listaCobrancasDetalhe.map((cobrancasDetalhe) => (
          <div className="linha-info-cobranca-detalhe linha-click" key={cobrancasDetalhe.id} onClick={() => abrirModalDetalheCobrancaPageCliente(cobrancasDetalhe)}>
            <span className="linha-info-cobranca-detalhe">{cobrancasDetalhe.id}</span>
            <span className="linha-info-cobranca-detalhe">{Number(cobrancasDetalhe.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span className='linha-info-cobranca-detalhe'>
              {`${cobrancasDetalhe.vencimento.split('T')[0].split('-')[2]}/${cobrancasDetalhe.vencimento.split('T')[0].split('-')[1]}/${cobrancasDetalhe.vencimento.split('T')[0].split('-')[0]}`}
            </span>
            <div className="linha-info-cobranca-detalhe">
              <span className={`
              ${cobrancasDetalhe.status === 'paga' ? 'status-cobranca-paga' :
                  cobrancasDetalhe.status === 'vencida' ? 'status-cobranca-vencida' : 'status-cobranca-pendente'}`
              }>
                {cobrancasDetalhe.status.replace(cobrancasDetalhe.status[0], cobrancasDetalhe.status[0].toUpperCase())}
              </span>
            </div>
            <div className="linha-info-cobranca-detalhe info-detalhe-descricao">
              <span className="descricao-cobranca">{cobrancasDetalhe.descricao}</span>
            </div>

            <div className="editar-excluir-cobranca">
              <div className="icones-editar-excluir" onClick={() => abrirModalEditarCobrancaPageCliente(cobrancasDetalhe)}>
                <img src={iconeEditar} alt="Ícone editar" />
                <span>Editar</span>
              </div>
              <div className="icones-editar-excluir excluir-cobranca-icone" >
                <img src={iconeExcluir} alt="Ícone excluir" onClick={() => handleClickModalExcluir(cobrancasDetalhe)} />
                <span>Excluir</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabelaCobrancasDetalhe;
