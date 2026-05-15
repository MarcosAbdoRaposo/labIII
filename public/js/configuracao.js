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


carregarUsuario();