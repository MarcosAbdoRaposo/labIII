// Importa o Knex

const knex = require('knex');

// Importa o arquivo de configuração da conexão com o Banco
const config = require('./knexfile');


// inicializar a biblioteca Knex.js com as configurações específicas do ambiente de desenvolvimento 
// do seu projeto. 

// o "development" esta definido no knexfile

const db = knex(config.development);

// Retorna uma Instância do Knex
module.exports = db;
