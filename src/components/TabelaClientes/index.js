import { useState } from 'react';
import { NavLink } from "react-router-dom";
import arrowIcon from '../../assets/arrow-icon.svg';
import cobrancaIcon from '../../assets/cobranca-icon.svg';
import cobrancaName from '../../assets/cobranca-name.svg';
import emDia from '../../assets/emdia-icon.svg';
import inadimplente from '../../assets/inadimplente-icon.svg';
import useGlobal from '../../hooks/useGlobal';
import { ordenarTabelaNomeCliente } from '../../utils/utils';
import './styles.css';

function ClientesTable({ offset }) {
  const {
    abrirModalCadastrarCobranca,
    setIdCliente,
    clientesListTemp,
    setClientesListTemp } = useGlobal();
  const [ordemClienteNome, setOrdemClienteNome] = useState('');
  const listaClientes = Array.isArray(clientesListTemp) ? clientesListTemp : [];

  return (
    <div className='tabela-container'>
      <div className='tabela'>

        <div className='titulo-coluna cliente linha-click'
          onClick={() => ordenarTabelaNomeCliente(ordemClienteNome, setOrdemClienteNome, listaClientes, setClientesListTemp)}>
          <img className='arrow-icon' src={arrowIcon} alt='arrow icon' />
          <span>Cliente</span>
        </div>
        <div className='titulo-coluna cpf'>
          <span>CPF</span>
        </div>
        <div className='titulo-coluna e-mail'>
          <span>E-mail</span>
        </div>
        <div className='titulo-coluna telefone '>
          <span>Telefone</span>
        </div>
        <div className='titulo-coluna  status'>
          <span>Status</span>
        </div>
        <div className='titulo-coluna  cobranca'>
          <span>Criar Cobrança</span>
        </div>
      </div>

      <div className="table-body">
        {listaClientes.map((cliente) => (
          (listaClientes.indexOf(cliente) >= offset &&
            listaClientes.indexOf(cliente) < offset + 10) &&
          <div className="linha-table" key={cliente.id}>
            <div
              className='line-items'
              onClick={() => setIdCliente(cliente.id)}>
              <NavLink to="/clientes/detalhar">
                {cliente.nome_cliente}
              </NavLink>
            </div>
            <div className='line-items'>{cliente.cpf}</div>
            <div className='line-items'><span className='cliente-email'>{cliente.email}</span></div>
            <div className='line-items'>{cliente.telefone}</div>

            <div className='line-items'>
              <img className='status-icon' src={!cliente.status ? inadimplente : emDia} alt='emDia icon' />
            </div>
            <div className='line-items cobrancaIcon'>
              <div onClick={() => abrirModalCadastrarCobranca(cliente)} className='imagemCobranca'>
                <img src={cobrancaIcon} alt='cobrança icon' />
                <img src={cobrancaName} alt='cobrança-name icon' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ClientesTable;


