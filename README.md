<h1 align="center">Users Storage API</h1>

<p align="center">
    <img alt="Badge indicando que o projeto foi criado em fevereiro de 2023" src="https://img.shields.io/badge/Data%20de%20cria%C3%A7%C3%A3o-Fevereiro%2F2023-blue">
    <img alt="Badge indicando que o status do projeto é 'concluído'" src="https://img.shields.io/badge/Status-Concluído-yellow">
</p>

## Índice

• <a href="#descricao">Descrição</a>
<br>
• <a href="#tecnologias">Tecnologias</a>
<br>
• <a href="#bd">Banco de dados</a>
<br>
• <a href="#endpoints">Endpoints do serviço</a>
<br>
• <a href="#entradas-responses">Endpoints, entradas e responses</a>
<br>
• <a href="#Desenvolvedora">Desenvolvedora</a>
<br>
<p align="center">
</p>


<h2 id="descricao">Descrição</h2>
CRUD de usuários feito com express e typescript, com serialização de dados por meio da biblioteca zod e uso de token de autenticação em alguns endpoints.

<h2 id="tecnologias">Tecnologias</h2>

- Typescript
- Express
- NodeJS
- PostgreSQL
- JSON web token

<h2 id="bd">Banco de dados</h2>

### SGBD
PostgreSQL

### Especificações da tabela `users`
* **Nome da tabela**: users
* **Colunas da tabela**
  * **id**: inteiro, sequencial e chave primária.
  * **name**: caractere, tamanho máximo de 20 e obrigatório.
  * **email**: caractere, tamanho máximo de 100, único e obrigatório.
  * **password**: caractere, tamanho máximo de 120 e obrigatório.
  * **admin**: booleano, obrigatório e falso por padrão.
  * **active**: booleano, obrigatório e verdadeiro por padrão.

<h2 id="endpoints">Endpoints do serviço</h2>

| Método | Endpoint           | Responsabilidade                        |
| ------ | ------------------ | ---------------------------------------- |
| POST   | /users             | Criação de usuários.                     |
| POST   | /login             | Gera o token JWT.                        |
| GET    | /users             | Lista todos os usuários.                  |
| GET    | /users/profile     | Retorna os dados do usuário logado.       |
| PATCH  | /users/:id         | Atualiza os dados de um usuário.          |
| DELETE | /users/:id         | Faz um soft delete do usuário.            |
| PUT    | /users/:id/recover | Ativa um usuário que foi inativado.       |


<h2 id="entradas-responses">Endpoints, entradas e responses</h2>

### **POST `/users`**
### *Regras de negócio*
* Caso de sucesso:
  * **Envio**: Um objeto contendo os dados do usuário a ser criado.
  * **Retorno**: Um objeto contendo os dados do usuário criado.
  * **Status**: 201 CREATED.

**Exemplo de envio**:

```json
{
  "name": "Fabio",
  "email": "fabio@kenzie.com.br",
  "password": "naomaisjunior",
  "admin": true,
  "active": false
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "Fabio",
  "email": "fabio@kenzie.com.br",
  "admin": true,
  "active": true
}
```
### *Casos de erro*
* Não deve ser possível criar um usuário com um email já existente:
  * **Envio**: Um objeto contendo um email já existente.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 409 UNIQUE.

**Exemplo de envio**:

```json
{
  "name": "Fabio",
  "email": "fabio@kenzie.com.br",
  "password": "naomaisjunior",
  "admin": true,
  "active": false
}
```

**Exemplo de retorno**:

```json
{
  "message": "E-mail already registered"
}
```

### **POST `/login`**
### *Regras de negócio*

* Caso de sucesso:
  * **Envio**: Um objeto contendo os dados de login do usuário.
  * **Retorno**: Um token JWT válido.
  * **Status**: 200 OK.

**Exemplo de envio**:

```json
{
  "email": "fabio@kenzie.com.br",
  "password": "naomaisjunior"
}
```

**Exemplo de retorno**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```
### *Casos de erro*
* Não é possível efetuar login com os dados de um usuário inativo ou se o email e/ou senha estiverem incorretos:
  * **Envio**: Um objeto contendo email e/ou senha incorretos ou com dados de um usuário inativo.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 401 UNAUTHORIZED.

**Exemplo de envio**:

```json
{
  "email": "wrongemail@kenzie.com.br",
  "password": "wrongpassword",
}
```

**Exemplo de retorno**:

```json
{
  "message": "Wrong email/password"
}
```

### **GET `/users`**
### *Regras de negócio*

* Caso de sucesso:
  * **Envio**: Token JWT no cabeçalho da requisição.
  * **Retorno**: Lista de usuários cadastrados.
  * **Status**: 200 OK.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Exemplo de retorno**:

```json
[
  {
    "id": 1,
    "name": "Fabio",
    "email": "fabio@kenzie.com.br",
    "admin": true,
    "active": true
  },
  {
    "id": 2,
    "name": "Cauan",
    "email": "cauan@kenzie.com.br",
    "admin": false,
    "active": false
  }
]
```

### *Casos de erro*
* Um usuário não administrador não pode obter a lista de usuários:
  * **Envio**: Token JWT de um usuário não admin no cabeçalho da requisição.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 403 FORBIDDEN.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Exemplo de retorno**:

```json
{
  "message": "Insufficient Permission"
}
```

* O token passado é inválido ou não foi enviado:
  * **Envio**: Token inválido ou não enviado no cabeçalho da requisição.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 401 UNAUTHORIZED.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "token inválido"
}
```

**Exemplo de retorno**:

```json
{
  "message": "Malformed JWT"
}
```

### **GET `/users/profile`**
### *Regras de negócio*

* Caso de sucesso:
  * **Envio**: Token JWT no cabeçalho da requisição.
  * **Retorno**: Dados do usuário que gerou o token.
  * **Status**: 200 OK.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "Fabio",
  "email": "fabio@kenzie.com.br",
  "admin": true,
  "active": true
}
```

### *Casos de erro*
* O token passado é inválido ou não foi enviado:
  * **Envio**: Token inválido ou não enviado no cabeçalho da requisição.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 401 UNAUTHORIZED.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "token inválido"
}
```

**Exemplo de retorno**:

```json
{
  "message": "Malformed JWT"
}
```

### **PATCH `/users/:id`**
Atualiza os dados do usuário cujo ID foi passado na rota.

### *Regras de negócio*

* Caso de sucesso:
  * **Envio**: Novos dados do usuário.
  * **Retorno**: Todos os dados do usuário, inclusive os atualizados.
  * **Status**: 200 OK.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Exemplo de envio**:

```json
{
  "name": "Fabio Junior"
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "Fabio Junior",
  "email": "fabio@kenzie.com.br",
  "admin": true,
  "active": true
}
```

### *Casos de erro*
* ID passado na rota não existe:
  * **Envio**: ID inválido.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 404 NOT FOUND.

**Exemplo de retorno**:

```json
{
  "message": "User not found"
}
```

* O token passado é inválido ou não foi enviado:
  * **Envio**: Token inválido ou não enviado no cabeçalho da requisição.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 401 UNAUTHORIZED.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "token inválido"
}
```

**Exemplo de retorno**:

```json
{
  "message": "Malformed JWT"
}
```

### **DELETE `/users/:id`**
Usuário cujo ID foi passado na rota sofre soft-delete.

### *Regras de negócio*

* Caso de sucesso:
  * **Envio**: Token do usuário no cabeçalho da requisição.
  * **Status**: 204 NO CONTENT.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

### *Casos de erro*
* ID passado na rota não existe:
  * **Envio**: ID inválido.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 404 NOT FOUND.

**Exemplo de retorno**:

```json
{
  "message": "User not found"
}
```

* O token passado é inválido ou não foi enviado:
  * **Envio**: Token inválido ou não enviado no cabeçalho da requisição.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 401 UNAUTHORIZED.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "token inválido"
}
```


### **PUT `/users/:id/recover`**
Usuário cujo ID foi passado na rota é reativado caso tenha sofrido soft-delete.

### *Regras de negócio*

* Caso de sucesso:
  * **Envio**: Token do usuário no cabeçalho da requisição.
  * **Retorno**: Dados do usuário recuperado.
  * **Status**: 200 OK.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "Fabio Junior",
  "email": "fabio@kenzie.com.br",
  "admin": true,
  "active": true
}
```

### *Casos de erro*
* ID passado na rota não existe:
  * **Envio**: ID inválido.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 404 NOT FOUND.

**Exemplo de retorno**:

```json
{
  "message": "User not found"
}
```

* O token passado é inválido ou não foi enviado:
  * **Envio**: Token inválido ou não enviado no cabeçalho da requisição.
  * **Retorno**: Um objeto contendo uma mensagem de erro.
  * **Status**: 401 UNAUTHORIZED.

**Cabeçalho da requisição**:

```json
{
  "Authorization": "token inválido"
}
```

<h2 id="Desenvolvedora">Desenvolvedora</h2>

<p align="center">
  <a href="https://github.com/Danielle-Luz">
    <img width="120px" src="https://avatars.githubusercontent.com/u/99164019?v=4" alt="foto de uma mulher parda com o cabelo castanho, sorrindo levemente na frente de um fundo verde com bits">
  </a>
</p>

<p align="center">
Danielle da Luz Nascimento
</p>

<p align="center">
<a href="https://www.linkedin.com/in/danielle-da-luz-nascimento/">@Linkedin</a>
</p>
