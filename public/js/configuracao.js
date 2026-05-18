const API_URL = "http://localhost:3000/desconto";

const usuarios = [
    { id: 1, nome: "João Silva", tipo: "Plataforma"  },
    { id: 2, nome: "Maria Oliveira ", tipo: "Plataforma" },
    { id: 3, nome: "Carlos Souza", tipo: "Loja", idLoja : 1 },
    { id: 4, nome: "Ana Costa ", tipo: "Loja", idLoja : 2 },
    { id: 5, nome: "Pedro Paulo", tipo: "Cliente", idCliente : 1 },
    { id: 6, nome: "Mario Augusto", tipo: "Cliente", idCliente : 2 },

];


function carregarUsuario() {
    const select = document.getElementById('cmbUsuario'); // Seu <select> do HTML
    usuarios.forEach(usuario => {
        const novaOpcao = document.createElement('option');
        novaOpcao.value = usuario.id;
        if (usuario.tipo == "Loja") {
            novaOpcao.textContent = usuario.nome+ " - "+usuario.tipo+ " "+usuario.idLoja;
        } else {
            novaOpcao.textContent = usuario.nome+ " - "+usuario.tipo;
        }
        
        select.appendChild(novaOpcao);
    });
};

function salvarConfiguracao() {
    const idUsuario = document.getElementById("cmbUsuario").value;
    const usuario = usuarios.find(u => u.id == idUsuario)
    if (typeof usuario === 'undefined') {
       alert("É obrigatório escolher um Usuário .");
    } else {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    }
};

async function validarDesconto() {
    const codDesconto = document.getElementById("inputCupomVoucher").value;

    //if (codDesconto == "") {
    //     document.getElementById("areaResposta").value = "É necessário informar um Código de Desconto para ser realizado o teste";
    //     return;
    //} else {
    
        // Obtem os dados de um determinado Cupom
        const res = await fetch(`${API_URL}/${codDesconto}`, { method: "GET" });
        if (res.status == 400) {
            document.getElementById("areaResposta").value = "O Códido do Desconto deve ser Diferente de Brancos."

        }
        const desconto = await res.json();

        const jsonFormatado = JSON.stringify(desconto, null, 2);
        document.getElementById("areaResposta").value = jsonFormatado;
    //}
}

async function utilizarDesconto() {
    const idDesconto = document.getElementById("inputIdDesconto").value;
    const idPedido = document.getElementById("inputPedido").value;
    const valDesconto = document.getElementById("inputValor").value;

    const data = {
                idDesconto : idDesconto,
                idPedido   : idPedido,
                valDesconto : valDesconto
    };

    const metodo = "POST"
    const url =  API_URL;
    
        
    const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
    });

    const resultado = await res.json();

    const jsonFormatado = JSON.stringify(resultado, null, 2);
    document.getElementById("areaResposta").value = jsonFormatado;




   
}



carregarUsuario();