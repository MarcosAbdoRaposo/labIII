const clientes = [
    
    { idCliente: 1, nome: "Pedro Paulo"  },
    { idCliente: 2, nome: "Mario Augusto" },
    { idCliente: 3, nome: "João Carlos"},
    { idCliente: 4, nome: "Pedro de Castro"},
    { idCliente: 5, nome: "Maurício de Paula"},
    { idCliente: 6, nome: "José Bonifácio"}
];


function obtemListaClientes () {
    return  JSON.parse(clientes);
}