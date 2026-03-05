
export function ordenarTabelaNomeCliente(ordemClienteNome, setOrdemClienteNome, listTemp, setListTemp) {
    setOrdemClienteNome(ordemClienteNome !== 'crescente' ? 'crescente' : 'decrescente');

    const clientesOrdem = [...listTemp];
    clientesOrdem.sort((a, b) => {
        if (ordemClienteNome === 'crescente') {
            return b.nome_cliente.localeCompare(a.nome_cliente);
        }
        else {
            return a.nome_cliente.localeCompare(b.nome_cliente);
        }
    });
    setListTemp(clientesOrdem);
}

export function ordenarTabelaIdCobranca(setOrdemIdCobranca, ordemIdCobranca, listTemp, setListTemp) {
    setOrdemIdCobranca(ordemIdCobranca !== 'crescente' ? 'crescente' : 'decrescente');

    const cobrancasOrdenadasId = [...listTemp];
    cobrancasOrdenadasId.sort((a, b) => {
        if (ordemIdCobranca === 'crescente') {
            return a.id - b.id;
        }
        else {
            return b.id - a.id;
        }
    });
    setListTemp(cobrancasOrdenadasId);
}
export function ordenarTabelaDataCobranca(setOrdemDataCobranca, ordemDataCobranca, listTemp, setListTemp){
    setOrdemDataCobranca(ordemDataCobranca !== 'crescente' ? 'crescente' : 'decrescente');

    const cobrancasOrdenadasData = [...listTemp];
    cobrancasOrdenadasData.sort((a, b) => {
        if(ordemDataCobranca === 'crescente'){
            console.log('crescente')
            return new Date(a.vencimento) - new Date (b.vencimento);
            
        }else {
            console.log('decrescente')

            return new Date(b.vencimento) - new Date (a.vencimento);
        }
    });
    setListTemp(cobrancasOrdenadasData);
}

export function normalizarCpf(cpf) {
    const apenasDigitos = String(cpf ?? "").replace(/\D/g, "");

    if (!apenasDigitos) {
        return "";
    }

    if (apenasDigitos.length <= 11) {
        return apenasDigitos.padStart(11, "0");
    }

    return apenasDigitos;
}