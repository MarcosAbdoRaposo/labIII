const API_URL = "http://localhost:3000/voucher";

async function carregarVoucher() {
    // Lista os Vouchers
    const res = await fetch(API_URL);
    // Converte para Jason
    const vouchers = await res.json();
    // aponta para a tabela de Vouchers no HTML
    const tabela = document.getElementById("tabelaVouchers");
    // Limpa a tabela
    tabela.innerHTML = "";

    // Adiciona uma Linha de Vouchers
    vouchers.forEach(voucher => {
        const row = document.createElement("tr");
        const origemVoucher = (voucher.codOrigem = "P") ? "Plataforma" : "Loja";
        const tipoVoucher = (voucher.codTipo = "V") ? "Valor"
                        : (voucher.codTipo = "P") ? "Percentual"
                        : (voucher.codTipo = "F") ? "Frete Grátis"
                        : "";
        const periodoValidade = (new Date (voucher.datInicioValidade)).toLocaleString("pt-BR") +"<br>"+(new Date (voucher.datFimValidade)).toLocaleString("pt-BR");
        row.innerHTML = `
            <td>${origemVoucher}</td>
            <td>${voucher.codDesconto}</td>
            <td>${tipoVoucher}</td>
            <td>${periodoValidade}</td>
            <td>00000</td>
            <td class="actions">
            <button onclick="consultarVoucher(${voucher.idDesconto})">👁️</button>
            <button onclick="inativarVoucher(${voucher.idDesconto})">❌</button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

async function salvarVoucher(e) {
    if (criticaVoucher()) {
    
        //e.preventDefault();

        // Cria json com os dados a seren enviados

        
        const datCriacao = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        
        const datInicioValidade = document.getElementById("inputDataInicio").value.slice(0, 19).replace('T', ' ');
        const datFimValidade = document.getElementById("inputDataFim").value.slice(0, 19).replace('T', ' ');

        const codOrigem = document.querySelector('input[name="inlineRadioOrigem"]:checked').value;
        const codTipo = document.querySelector('input[name="inlineRadioTipo"]:checked').value;

        const data = {
                    codDesconto : document.getElementById("inputCodigo").value,
                    codNatureza : "C",
                    codOrigem : codOrigem,
                    codTipo : codTipo,
                    valDesconto : document.getElementById("inputValor").value,
                    perDesconto : document.getElementById("inputPercentual").value,
                    datInicioValidade : datInicioValidade.toLocaleString('pt-BR'),
                    datFimValidade: datFimValidade,
                    obsDesconto : document.getElementById("inputObservacao").value,
                    indAtivo : 1,
                    idLoja : 1,
                    idUsuarioCriacao: 1,
                    datCriacao: datCriacao


        };

        const metodo = "POST"
        const url =  API_URL;
    
        
        await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
        });

        // Recarrega a Grade a tela
        ocultarFormulario();
        carregarVoucher();
}
}

async function consultarVoucher(idDesconto) {

    // Obtem os dados de um determinado Voucher
    const res = await fetch(`${API_URL}/${idDesconto}`, { method: "GET" });
    const voucher = await res.json();

    document.getElementById("idDesconto").value = idDesconto;
    document.getElementById("inputCodigo").value = voucher.codDesconto;

    // Loja ou Plataforma
    if (voucher.codOrigem == "P") {
        document.getElementById("inlineRadioPlataforma").checked = true;
        document.getElementById("inlineRadioLoja").checked = false;
    } else {
        document.getElementById("inlineRadioPlataforma").checked = false;
        document.getElementById("inlineRadioLoja").checked = true;
    }

    
    document.getElementById("inlineRadioPercentual").checked = (voucher.codTipo == "P");
    document.getElementById("inlineRadioValor").checked = (voucher.codTipo == "V") ;
    document.getElementById("inlineRadioFrete").checked = (voucher.codTipo == "F") ;

    document.getElementById("inputValor").value = voucher.valDesconto;
    document.getElementById("inputPercentual").value = voucher.perDesconto;

    document.getElementById("inputDataInicio").value = voucher.datInicioValidade.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    document.getElementById("inputDataFim").value = voucher.datFimValidade.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    document.getElementById("inputObservacao").value = voucher.obsDesconto;
    document.getElementById("ckBoxInativo").checked = ( voucher.indAtivo == 0) ;
    document.getElementById("inputCriadoPor").value = voucher.idUsuarioCriacao;
    if (voucher.datCriacao != null) {
        document.getElementById("inputDataCriacao").value = voucher.datCriacao.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    }
    document.getElementById("inputInativadoPor").value = voucher.idUsuarioInativacao;
    if (voucher.datInativacao != null) {
        document.getElementById("inputDataInativacao").value = voucher.datInativacao.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    }
    exibirVoucher(true);
    exibirFormulario();

}

async function inativarVoucher(id) {

    if (confirm("Deseja inativar este voucher?")) {
        const datInativacao = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        
        const idUsuarioInativacao = 2;
        
        const data = {

                    idUsuarioInativacao : idUsuarioInativacao,
                    datInativacao: datInativacao
        }
        const metodo = "DELETE"
        const url =  `${API_URL}/${id}`;

        //await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
        });
        carregarVoucher();
    }
}

function exibirVoucher(visualizar) {



    if (visualizar) {
        document.getElementById("lblNovoVoucher").hidden = true;
        document.getElementById("lblVisualizarVoucher").hidden = false;
        document.getElementById("btnCancelarVoucher").hidden = true;
        document.getElementById("btnSalvarVoucher").hidden = true;
        document.getElementById("btnRetornarVoucher").hidden = false;

        
    } else {
        document.getElementById("lblNovoVoucher").hidden = false;
        document.getElementById("lblVisualizarVoucher").hidden = true;
        document.getElementById("btnCancelarVoucher").hidden = false;
        document.getElementById("btnSalvarVoucher").hidden = false;
        document.getElementById("btnRetornarVoucher").hidden = true;

    }

}

function exibeTipoDesconto(tipoDesconto) {
    document.getElementById("inputPercentual").hidden = (tipoDesconto != "P");
    document.getElementById("labelPercentual").hidden = (tipoDesconto != "P");

    document.getElementById("inputValor").hidden = (tipoDesconto != "V");
    document.getElementById("labelValor").hidden = (tipoDesconto != "V");
}

function exibirFormulario() {

document.getElementById("areaEdicao").hidden = false
document.getElementById("areaLista").hidden = true
}

function ocultarFormulario() {
document.getElementById("areaEdicao").hidden = true
document.getElementById("areaLista").hidden = false
}

function limparCamposFormulario() {
    document.getElementById("idDesconto").value = 0;
    document.getElementById("inlineRadioLoja").checked = false;
    document.getElementById("inlineRadioPlataforma").checked = false;
    
    document.getElementById("inputCodigo").value = "";
    document.getElementById("inlineRadioPercentual").checked = false;
    document.getElementById("inlineRadioValor").checked = false;
    document.getElementById("inlineRadioFrete").checked = false;
    document.getElementById("inputPercentual").value = "";
    document.getElementById("inputValor").value = "";
    document.getElementById("inputDataInicio").value = "";
    document.getElementById("inputDataFim").value = "";
    document.getElementById("inputObservacao").value = "";

    document.getElementById("inputCriadoPor").value = "";
    document.getElementById("inputDataCriacao").value = "";
    document.getElementById("inputInativadoPor").value = "";
    document.getElementById("inputDataInativacao").value = "";
    document.getElementById("ckBoxInativo").checked = false;

}

function novoVoucher() {
    limparCamposFormulario();
    document.getElementById("idDesconto").value = 0;
    exibirVoucher(false);
    exibirFormulario();
}

function criticaVoucher() {

    // Testa a Origem do Voucher 
    if ( ! document.getElementById("inlineRadioLoja").checked && ! document.getElementById("inlineRadioPlataforma").checked ) {
        alert("É obrigatório identificar se é um voucher de loja ou de plataforma.");
        return false;
    }

    if (document.getElementById("inputCodigo").value == "") {
        alert("É obrigatório informar um código para o Voucher.");
        return false;
    }
    
    if ( ! document.getElementById("inlineRadioPercentual").checked && ! document.getElementById("inlineRadioValor").checked && ! document.getElementById("inlineRadioValor").checked ) {
        alert("É obrigatório identificar se é o voucher é Percentual, Valor ou Frete Grátis.");
        return false;
    }

    if (document.getElementById("inlineRadioPercentual").checked) {
        if (document.getElementById("inputPercentual").value  == "" ) {
            alert("É obrigatório informar um percentual para vouchers do tipo percentual.");
            return false;
        }
        const percentual = Number(document.getElementById("inputPercentual").value);
        if (percentual == 0 ) {
            alert("É obrigatório informar um percentual para vouchers do tipo percentual.");
            return false;
        }
    }
    
    // Voucher do tipo Valor
    if (document.getElementById("inlineRadioValor").checked) {
        if (document.getElementById("inputValor").value  == "" ) {
            alert("É obrigatório informar um valor para vouchers do tipo valor.");
            return false;
        }
        const valor = Number(document.getElementById("inputValor").value);
        if (valor  == 0 ) {
            alert("É obrigatório informar um valor para vouchers do tipo valor.");
            return false;
        }
    }

    // Verificando as Datas de Início e de Fim
    if (! document.getElementById("inputDataInicio").value ){
        alert("É obrigatório informar a data de início de validade do voucher.");
        return false;

    }
    if (! document.getElementById("inputDataFim").value ){
        alert("É obrigatório informar a data de fim de validade do voucher.");
        return false;

    }

    const dataInicio = new Date(document.getElementById("inputDataInicio").value);
    const dataFim = new Date(document.getElementById("inputDataFim").value);

    if (dataInicio < new Date()) {
        alert("A data de início não pode ser retroativa a este momento.");
        return false;
    }

    if (dataFim <= dataInicio) {
        alert("A data de final deve ser posterior a data inicial.");
        return false;
    }

    // Testa a Observação

    if (! document.getElementById("inputObservacao").value ){
        alert("É obrigatório informar uma observação descrevento o motipo pelo qual este voucher está sendo criado.");
        return false;
    }

    return true;

}

//document.getElementById("clienteForm").addEventListener("submit", salvarCliente);
carregarVoucher();