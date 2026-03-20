# Mercado API (ASP.NET Core + PostgreSQL)

API para gerenciamento de mercado usando EF Core com PostgreSQL.

## Requisitos

- .NET SDK 8
- PostgreSQL 14+

## 1) Criar banco

Crie um banco chamado `mercado_db` no PostgreSQL.

## 2) Ajustar conexao

Edite `appsettings.json`:

`Host=localhost;Port=5432;Database=mercado_db;Username=postgres;Password=postgres`

## 3) Instalar ferramenta EF (uma vez)

```bash
dotnet tool install --global dotnet-ef
```

## 4) Criar e aplicar migracoes

No diretorio `backend`:

```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 5) Rodar API

```bash
dotnet run
```

A API sobe em `http://localhost:5043`.
