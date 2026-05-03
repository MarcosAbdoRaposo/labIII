## 1. Pré-requisitos:
1. Ter o **node** instalado. Para fazer o download acesse https://nodejs.org/pt/download . Prefira o download de uma versão LTS.
2. Ter um banco **MySQL** instalado . Para fazer o download acesse https://dev.mysql.com/downloads/. Pode usar também o **MariaDB** que é instalado com o XAMPP, disponível em https://www.apachefriends.org/pt_br/index.html. 

## 2. Criação do Banco de Dados

1) Criar o banco dbmarketplace no serrvidor de banco de dados Mysql.

O script de criação encontra-se na pasta banco.

2) Anotar:

nome do servidor: localhost
nome do banco: dbmarketplace
nome do usuário: root
senha: root

## 3. Criação da estrutura de pastas

Foi utilizado o seguinte comando:

npx express-generator labiii

 Foi então criada a seguinte estrutura: 

   create : labiii\
   create : labiii\public\
   create : labiii\public\javascripts\
   create : labiii\public\images\
   create : labiii\public\stylesheets\
   create : labiii\public\stylesheets\style.css
   create : labiii\routes\
   create : labiii\routes\index.js
   create : labiii\routes\users.js
   create : labiii\views\
   create : labiii\views\error.jade
   create : labiii\views\index.jade
   create : labiii\views\layout.jade
   create : labiii\app.js
   create : labiii\package.json
   create : labiii\bin\
   create : labiii\bin\www

Para entrar na pasta utilize o comando cd (no torminal)

   change directory:lab ii
     > cd labiii

   instalar dependencias
     > npm install

Caso deseje instalar manualmente, execute os seguintes comandos:

npm init
npm install dotenv
npm install express
npm install knex 
npm install mysql2



   run the app:
     > SET DEBUG=labiii:* & npm start