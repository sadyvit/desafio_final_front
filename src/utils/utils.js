
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

export function formatarCpfInput(cpf) {
    const apenasDigitos = String(cpf ?? "").replace(/\D/g, "").slice(0, 11);

    if (apenasDigitos.length <= 3) return apenasDigitos;
    if (apenasDigitos.length <= 6) {
        return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3)}`;
    }
    if (apenasDigitos.length <= 9) {
        return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6)}`;
    }
    return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6, 9)}-${apenasDigitos.slice(9)}`;
}

export function formatarTelefoneInput(telefone) {
    const apenasDigitos = String(telefone ?? "").replace(/\D/g, "").slice(0, 11);

    if (!apenasDigitos) return "";
    if (apenasDigitos.length <= 2) return `(${apenasDigitos}`;
    if (apenasDigitos.length <= 6) {
        return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`;
    }
    if (apenasDigitos.length <= 10) {
        return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 6)}-${apenasDigitos.slice(6)}`;
    }
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7)}`;
}

export function formatarCepInput(cep) {
    const apenasDigitos = String(cep ?? "").replace(/\D/g, "").slice(0, 8);

    if (apenasDigitos.length <= 5) return apenasDigitos;
    return `${apenasDigitos.slice(0, 5)}-${apenasDigitos.slice(5)}`;
}

export function normalizarTelefone(telefone) {
    return String(telefone ?? "").replace(/\D/g, "").slice(0, 11);
}

export function normalizarCep(cep) {
    return String(cep ?? "").replace(/\D/g, "").slice(0, 8);
}