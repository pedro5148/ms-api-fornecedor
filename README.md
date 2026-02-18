# API de Gestão de Fornecedores

Esta é uma API RESTful desenvolvida em Node.js para gerenciamento de fornecedores e usuários. O projeto utiliza Docker para orquestração, Sequelize (MySQL) para persistência de dados e JWT para autenticação segura.

## 🚀 Tecnologias Utilizadas

- **Node.js** (v20)
- **Express** (Framework Web)
- **Sequelize** (ORM para MySQL)
- **MySQL** (Banco de Dados)
- **Docker & Docker Compose** (Containerização)
- **JWT** (Autenticação via JSON Web Token)
- **Bcrypt.js** (Hash de senhas)
- **Nodemailer** (Envio de emails - Configurado com Mailtrap)

## ⚙️ Funcionalidades

- **CRUD de Fornecedores**: Criação, leitura, atualização e exclusão.
- **Autenticação Completa**:
  - Cadastro (Signup) e Login.
  - Recuperação de senha via e-mail (Esqueci minha senha / Resetar senha).
  - Atualização de senha logado.
- **Gerenciamento de Perfil**:
  - Atualização de dados cadastrais (proteção contra alteração de senha na rota errada).
  - Exclusão lógica de conta (Soft Delete).
- **Segurança**:
  - Senhas criptografadas (Hash).
  - Proteção contra _Mass Assignment_.
  - Filtro de campos sensíveis no retorno da API.

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/) e Docker Compose.
- [Postman](https://www.postman.com/) ou Insomnia (para testar as rotas).

## 🛠️ Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/api-fornecedor.git](https://github.com/seu-usuario/api-fornecedor.git)
   cd api-fornecedor
   ```
2. **Configure as Variáveis de Ambiente:**
   Crie um arquivo .env na raiz do projeto e configure conforme o modelo abaixo:

```bash
   NODE_ENV=development
   PORT=3000

   # Configuração do Banco de Dados (Docker)
   DB_HOST=mysqldb
   DB_USER=root
   DB_PASS=sua_senha_root
   DB_NAME=db_fornecedor
   DB_PORT=3306

   # Autenticação JWT
   JWT_SECRET=sua_chave_super_secreta_e_longa_aqui
   JWT_EXPIRES_IN=90d

   # Configuração de Email (Mailtrap.io para testes)
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORTA=2525
   EMAIL_USERNAME=seu_usuario_mailtrap
   EMAIL_SENHA=sua_senha_mailtrap
```
