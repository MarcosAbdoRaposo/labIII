/* Obtem uma "conexão" Knex já vinculado ao banco, que por sua vez é configurado através do knexfile, que carrega os valores definidos
no arquivo .env para process.env, de onde 

acessa as variáves armazenadas
em process.env.*

Neste local os valores arquivo .env são carregados

*/

const db = require('../db/knex');

// Método de Consulta através do ID

exports.obter = async (req, res) => {
  try {
    const { idDesconto } = req.params;
    const desconto = await db("desconto").where({ idDesconto: req.params.idDesconto }).first();
    if (!desconto) {
      return res.status(404).json({ erro: "Cupom não encontrado" });
    }
    res.json(desconto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar o Cupom" });
  }
};

// Método de Listar todos os cupons

exports.listar = async (req, res) => {
  try {
    const desconto = await db('desconto').orderBy('datInicioValidade');
    res.json(desconto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar o Cupom' });
  }
};


// Método de inserir um Cupom 

exports.inserir = async (req, res) => {
  try {
    const { codDesconto,codNatureza,codOrigem,codTipo,valDesconto,perDesconto,datInicioValidade,datFimValidade,obsDesconto,idLoja,idUsuarioCriacao,datCriacao } = req.body;
    const camposDesconto = { 
      codDesconto : codDesconto,
      codNatureza : codNatureza,
      codOrigem: codOrigem,
      codTipo : codTipo,
      datInicioValidade : datInicioValidade,
      datFimValidade: datFimValidade,
      obsDesconto : obsDesconto,
      indAtivo : 1,
      idLoja : idLoja,
      idUsuarioCriacao:idUsuarioCriacao,
      datCriacao: datCriacao
    };

    // adiciona campos que podem ser nulos.
    if (codOrigem == "L") {
        camposDesconto.idLoja = idLoja;    
    }
    if (codTipo == 'V') {
      camposDesconto.valDesconto = valDesconto;
    } else if (codTipo == 'P') {
      camposDesconto.perDesconto = perDesconto;
    }

    await db('desconto').insert(camposDesconto);
    res.status(201).json({ mensagem: 'Cupom inserido com sucesso' });
  } catch (err) {
    console.error('Erro ao inserir:', err.message);
    res.status(501).json({ erro: 'Erro ao inserir o Cupom' });
  }
};

// Método de inativar um Cupom


exports.inativar = async (req, res) => {
  try {
    const { idDesconto } = req.params;
    const { idUsuarioInativacao, datInativacao } = req.body;
    
    await db('desconto').where({ idDesconto }).update({ indAtivo : 0, idUsuarioInativacao : idUsuarioInativacao, datInativacao : datInativacao });
    res.json({ mensagem: 'Cupom inativado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar:', err.message);
    res.status(500).json({ erro: 'Erro ao atualizar Cupom' });
  }
};

// Método de inativar um Cupom 


