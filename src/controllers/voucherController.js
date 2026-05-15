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
    const desconto = await db("desconto")
      .where({ 
        idDesconto: req.params.idDesconto,
        codNatureza: 'V'  // Filtra apenas Vouchers
      })
      .first();
    if (!desconto) {
      return res.status(404).json({ erro: "Voucher não encontrado" });
    }
    res.json(desconto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar o Voucher" });
  }
};

// Método de Listar todos os vouchers

exports.listar = async (req, res) => {
  try {
    const desconto = await db('desconto')
      .where({ codNatureza: 'V' })  // Filtra apenas Vouchers
      .orderBy('datInicioValidade');
    res.json(desconto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar o Voucher' });
  }
};

// Método de Listar Vouchers por Cliente

exports.listarPorCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const desconto = await db('desconto')
      .where({ 
        codNatureza: 'V',
        idCliente: idCliente 
      })
      .orderBy('datInicioValidade');
    res.json(desconto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar Vouchers do Cliente' });
  }
};

// Método de inserir um Voucher 

exports.inserir = async (req, res) => {
  try {
    const { codDesconto, codOrigem, codTipo, valDesconto, perDesconto, datInicioValidade, datFimValidade, obsDesconto, idCliente, idUsuarioCriacao, datCriacao } = req.body;
    
    // Validação obrigatória: Voucher precisa de idCliente
    if (!idCliente) {
      return res.status(400).json({ erro: "idCliente é obrigatório para Voucher" });
    }

    const camposDesconto = { 
      codDesconto: codDesconto,
      codNatureza: 'V',  // Define como Voucher
      codOrigem: codOrigem,
      codTipo: codTipo,
      datInicioValidade: datInicioValidade,
      datFimValidade: datFimValidade,
      obsDesconto: obsDesconto,
      indAtivo: 1,
      idCliente: idCliente,
      idUsuarioCriacao: idUsuarioCriacao,
      datCriacao: datCriacao
    };

    // adiciona campos que podem ser nulos.
    if (codTipo == 'V') {
      camposDesconto.valDesconto = valDesconto;
    } else if (codTipo == 'P') {
      camposDesconto.perDesconto = perDesconto;
    }

    await db('desconto').insert(camposDesconto);
    res.status(201).json({ mensagem: 'Voucher inserido com sucesso' });
  } catch (err) {
    console.error('Erro ao inserir:', err.message);
    res.status(501).json({ erro: 'Erro ao inserir o Voucher' });
  }
};

// Método de inativar um Voucher

exports.inativar = async (req, res) => {
  try {
    const { idDesconto } = req.params;
    const { idUsuarioInativacao, datInativacao } = req.body;
    
    await db('desconto')
      .where({ 
        idDesconto,
        codNatureza: 'V'  // Garante que é um Voucher
      })
      .update({ 
        indAtivo: 0, 
        idUsuarioInativacao: idUsuarioInativacao, 
        datInativacao: datInativacao 
      });
    res.json({ mensagem: 'Voucher inativado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar:', err.message);
    res.status(500).json({ erro: 'Erro ao inativar Voucher' });
  }
};
