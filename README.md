# Mercado Web

Sistema fullstack para gerenciamento de mercado, com frontend em React + Material UI e backend em ASP.NET Core Web API com PostgreSQL.

## Tecnologias

- Frontend: React, Vite, Material UI
- Backend: ASP.NET Core 8, Entity Framework Core
- Banco de dados: PostgreSQL (Npgsql)

## Estrutura do projeto

- `frontend`: aplicacao web (interface)
- `backend`: API REST e acesso ao banco

## Funcionalidades

- Cadastro e listagem de clientes
- Cadastro e listagem de produtos
- Reposicao de estoque
- Registro de vendas com validacao de estoque
- Historico de vendas
- Dashboard com indicadores

## Requisitos

- Node.js 18+ (recomendado 20+)
- .NET SDK 8
- PostgreSQL 14+

## Configuracao do banco (PostgreSQL)

1. Suba o PostgreSQL com Docker Compose na raiz do projeto:

```bash
docker compose up -d
```

2. A API usa por padrao esta connection string em `backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=mercado_db;Username=postgres;Password=postgres"
  }
}
```

3. Se quiser mudar as credenciais sem editar arquivo, use variavel de ambiente:

```bash
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=mercado_db;Username=postgres;Password=postgres
```

## Rodando o backend

No terminal, dentro de `backend`:

```bash
dotnet restore
dotnet run
```

As migracoes sao aplicadas automaticamente no startup da API.

API disponivel em:

- `http://localhost:5043`
- Swagger (dev): `http://localhost:5043/swagger`

## Rodando o frontend

No terminal, dentro de `frontend`:

```bash
npm install
npm run dev
```

Aplicacao disponivel em:

- `http://localhost:5173`

## Endpoints principais

- `GET /api/clientes`
- `POST /api/clientes`
- `GET /api/produtos`
- `POST /api/produtos`
- `PATCH /api/produtos/{id}/estoque`
- `GET /api/vendas`
- `POST /api/vendas`
- `GET /api/dashboard`

## Status atual

- Projeto de console removido.
- Repositorio contem apenas a versao fullstack web.