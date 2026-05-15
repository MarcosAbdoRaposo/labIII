const API_URL = "http://localhost:3000/cupom";

//import { obterUsuarioLogado } from './servicoUsuario.js';

async function carregarCupom() {
    // Lista os Cupons
    const res = await fetch(API_URL);
    // Converte para Jason
    const cupons = await res.json();
    // aponta para a tabela de Cupons no HTML
    const tabela = document.getElementById("tabelaCupons");
    // Limpa a tabela
    tabela.innerHTML = "";

    // Adiciona uma Linha de Cupons
    cupons.forEach(cupom => {
        const row = document.createElement("tr");
        const origemCupom = (cupom.codOrigem = "P") ? "Plataforma" : "Loja";
        const tipoCupom = (cupom.codTipo = "V") ? "Valor"
                        : (cupom.codTipo = "P") ? "Percentual"
                        : (cupom.codTipo = "F") ? "Frete Grátis"
                        : "";
        const periodoValidade = (new Date (cupom.datInicioValidade)).toLocaleString("pt-BR") +"<br>"+(new Date (cupom.datFimValidade)).toLocaleString("pt-BR");
        row.innerHTML = `
            <td>${origemCupom}</td>
            <td>${cupom.codDesconto}</td>
            <td>${tipoCupom}</td>
            <td>${periodoValidade}</td>
            <td>00000</td>
            <td class="actions">
            <button onclick="consultarCupom(${cupom.idDesconto})">👁️</button>
            <button onclick="inativarCupom(${cupom.idDesconto})">❌</button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

async function salvarCupom(e) {
    if (criticaCupom()) {
    
        //e.preventDefault();

        // Cria json com os dados a seren enviados

        
        const datCriacao = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        
        const datInicioValidade = document.getElementById("inputDataInicio").value.slice(0, 19).replace('T', ' ');
        const datFimValidade = document.getElementById("inputDataFim").value.slice(0, 19).replace('T', ' ');

        const codOrigem = document.querySelector('input[name="inlineRadioOrigem"]:checked').value;
        const codTipo = document.querySelector('input[name="inlineRadioTipo"]:checked').value;
        const idUsuarioLogado = obtemIdUsuarioLogado();
        const nomUsuarioLogado = obtemNomeUsuarioLogado();


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
                    idUsuarioCriacao: idUsuarioLogado,
                    
                    nomUsuarioCriacao: nomUsuarioLogado,

                    datCriacao: datCriacao
        };
        // Loja
        if (codOrigem == "L") {
            const idLoja = obtemIdLojaUsuarioLogado();
            data.idLoja = idLoja;
        }

        const metodo = "POST"
        const url =  API_URL;
    
        
        await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
        });

        // Recarrega a Grade a tela
        ocultarFormulario();
        carregarCupom();
}
}

async function consultarCupom(idDesconto) {

    // Obtem os dados de um determinado Cupom
    const res = await fetch(`${API_URL}/${idDesconto}`, { method: "GET" });
    const cupom = await res.json();

    document.getElementById("idDesconto").value = idDesconto;
    document.getElementById("inputCodigo").value = cupom.codDesconto;

    // Loja ou Plataforma
    if (cupom.codOrigem == "P") {
        document.getElementById("inlineRadioPlataforma").checked = true;
        document.getElementById("inlineRadioLoja").checked = false;
    } else {
        document.getElementById("inlineRadioPlataforma").checked = false;
        document.getElementById("inlineRadioLoja").checked = true;
    }

    
    document.getElementById("inlineRadioPercentual").checked = (cupom.codTipo == "P");
    document.getElementById("inlineRadioValor").checked = (cupom.codTipo == "V") ;
    document.getElementById("inlineRadioFrete").checked = (cupom.codTipo == "F") ;

    document.getElementById("inputValor").value = cupom.valDesconto;
    document.getElementById("inputPercentual").value = cupom.perDesconto;

    document.getElementById("inputDataInicio").value = cupom.datInicioValidade.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    document.getElementById("inputDataFim").value = cupom.datFimValidade.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    document.getElementById("inputObservacao").value = cupom.obsDesconto;
    document.getElementById("ckBoxInativo").checked = ( cupom.indAtivo == 0) ;
    document.getElementById("inputCriadoPor").value = cupom.nomUsuarioCriacao;
    if (cupom.datCriacao != null) {
        document.getElementById("inputDataCriacao").value = cupom.datCriacao.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
    }
    if (cupom.indAtivo == 0) {
        document.getElementById("inputInativadoPor").value = cupom.nomUsuarioInativacao;
        if (cupom.datInativacao != null) {
            document.getElementById("inputDataInativacao").value = cupom.datInativacao.toLocaleString('pt-BR').replace(' ', 'T').substring(0, 16);
        }
    }

   
    visualizarCupom(); 
    exibeTipoDesconto(cupom.codTipo);
    exibirFormulario();

}

async function inativarCupom(id) {

    if (confirm("Deseja inativar este cupom?")) {
        const datInativacao = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        
        const idUsuarioLogado = obtemIdLojaUsuarioLogado();
        const nomUsuarioLogado = obtemNomeUsuarioLogado();
        
        const data = {

                    idUsuarioInativacao : idUsuarioLogado,
                    nomUsuarioInativacao : nomUsuarioLogado,
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
        carregarCupom();
    }
}


function visualizarCupom() {
    document.getElementById("lblNovoCupom").hidden = true;
    document.getElementById("lblVisualizarCupom").hidden = false;
    document.getElementById("btnCancelarCupom").hidden = true;
    document.getElementById("btnSalvarCupom").hidden = true;
    document.getElementById("btnRetornarCupom").hidden = false;
    document.getElementById("divAtivo").classList.replace("col-md-3", "col-md-6");

   
    document.getElementById("inputCodigo").disabled = true;
    document.getElementById("inlineRadioPercentual").disabled = true;
    document.getElementById("inlineRadioValor").disabled = true;
    document.getElementById("inlineRadioFrete").disabled = true;
    document.getElementById("inputPercentual").disabled = true;
    document.getElementById("inputValor").disabled = true;
    document.getElementById("inputDataInicio").disabled = true;
    document.getElementById("inputDataFim").disabled = true;
    document.getElementById("inputObservacao").disabled = true;


    return;
}

function criarCupom() {
    document.getElementById("lblNovoCupom").hidden = false;
    document.getElementById("lblVisualizarCupom").hidden = true;

    document.getElementById("inputCodigo").disabled = false;
    document.getElementById("inlineRadioPercentual").disabled = false;
    document.getElementById("inlineRadioValor").disabled = false;
    document.getElementById("inlineRadioFrete").disabled = false;
    document.getElementById("inputPercentual").disabled = false;
    document.getElementById("inputValor").disabled = false;
    document.getElementById("inputDataInicio").disabled = false;
    document.getElementById("inputDataFim").disabled = false;
    document.getElementById("inputObservacao").disabled = false;


    document.getElementById("btnCancelarCupom").hidden = false;
    document.getElementById("btnSalvarCupom").hidden = false;
    document.getElementById("btnRetornarCupom").hidden = true;
    document.getElementById("divAtivo").classList.replace("col-md-6", "col-md-3");
}       

function exibeTipoDesconto(tipoDesconto) {
    document.getElementById("divPercentual").hidden = (tipoDesconto != "P");

    document.getElementById("divValor").hidden = (tipoDesconto != "V");

}


// Oculta a área de lista e exibe a área de Formulário
function exibirFormulario() {

document.getElementById("areaEdicao").hidden = false
document.getElementById("areaLista").hidden = true
}


// Oculta a área de formulário e exibe a área de lista
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

function selecionarOrigem(codOrigem) {

// Loja ou Plataforma
    if (codOrigem == "P") {
        document.getElementById("inlineRadioPlataforma").checked = true;
        document.getElementById("inlineRadioLoja").checked = false;
    } else {
        document.getElementById("inlineRadioPlataforma").checked = false;
        document.getElementById("inlineRadioLoja").checked = true;
    }
}



function novoCupom() {
    limparCamposFormulario();
    document.getElementById("idDesconto").value = 0;

    criarCupom(); 
    selecionarOrigem( obtemOrigemUsuarioLogado());
    exibirFormulario();
}

function criticaCupom() {

    // Testa a Origem do Cupom 
    if ( ! document.getElementById("inlineRadioLoja").checked && ! document.getElementById("inlineRadioPlataforma").checked ) {
        alert("É obrigatório identificar se é um cupom de loja ou de plataforma.");
        return false;
    }

    if (document.getElementById("inputCodigo").value == "") {
        alert("É obrigatório informar um código para o Cupom.");
        return false;
    }
    
    if ( ! document.getElementById("inlineRadioPercentual").checked && ! document.getElementById("inlineRadioValor").checked && ! document.getElementById("inlineRadioValor").checked ) {
        alert("É obrigatório identificar se é o cupom é Percentual, Valor ou Frete Grátis.");
        return false;
    }

    if (document.getElementById("inlineRadioPercentual").checked) {
        if (document.getElementById("inputPercentual").value  == "" ) {
            alert("É obrigatório informar um percentual para cupons do tipo percentual.");
            return false;
        }
        const percentual = Number(document.getElementById("inputPercentual").value);
        if (percentual == 0 ) {
            alert("É obrigatório informar um percentual para cupons do tipo percentual.");
            return false;
        }
    }
    
    // Cupom do tipo Valor
    if (document.getElementById("inlineRadioValor").checked) {
        if (document.getElementById("inputValor").value  == "" ) {
            alert("É obrigatório informar um valor para cupons do tipo valor.");
            return false;
        }
        const valor = Number(document.getElementById("inputValor").value);
        if (valor  == 0 ) {
            alert("É obrigatório informar um valor para cupons do tipo valor.");
            return false;
        }
    }

    // Verificando as Datas de Início e de Fim
    if (! document.getElementById("inputDataInicio").value ){
        alert("É obrigatório informar a data de início de validade do cupom.");
        return false;

    }
    if (! document.getElementById("inputDataFim").value ){
        alert("É obrigatório informar a data de fim de validade do cupom.");
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
        alert("É obrigatório informar uma observação descrevento o motipo pelo qual este cupom está sendo criado.");
        return false;
    }

    return true;

}

function exibeUsuarioLogado() {
    const usuarioLogado = obterUsuarioLogado();
    if (usuarioLogado.tipo == "Loja") {
        document.getElementById("lblUsuario").textContent = usuarioLogado.tipo+" "+usuarioLogado.idLoja +": "+usuarioLogado.nome;
    } else {
        document.getElementById("lblUsuario").textContent = usuarioLogado.tipo +": "+usuarioLogado.nome;
    }

    
}


function obtemOrigemUsuarioLogado() {
    const usuarioLogado = obterUsuarioLogado();
    if (usuarioLogado.tipo == "Loja") {
        return "L";
    } else if (usuarioLogado.tipo == "Plataforma") {
        return "P";
    } else {
        alert("Usuário de tipo não autorizado: "+usuarioLogado.tipo);
        return "";
    }
}

function obtemNomeUsuarioLogado() {
    const usuarioLogado = obterUsuarioLogado();
    return usuarioLogado.nome;
}

function obtemIdUsuarioLogado() {
    const usuarioLogado = obterUsuarioLogado();
    return usuarioLogado.id;
}

function obtemIdLojaUsuarioLogado() {
    const usuarioLogado = obterUsuarioLogado();
    return usuarioLogado.idLoja;
}





//document.getElementById("clienteForm").addEventListener("submit", salvarCliente);
carregarCupom();
exibeUsuarioLogado();


 
  