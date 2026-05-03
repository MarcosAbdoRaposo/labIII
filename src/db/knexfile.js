// o comando require abaixo copia as variáveis definidas no .env para o process.env

require('dotenv').config();

/* O objeto process.env armazena as variáveis de ambiente do sistema operacional, fornecendo aos aplicativos uma for,a
segura de acessar configurações

*/

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: 'UTC',
      dateStrings : true
    },
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    }
  }
};
