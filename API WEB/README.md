# Mercado API (ASP.NET Core + PostgreSQL)

API para gerenciamento de mercado usando EF Core com PostgreSQL.

## Requisitos

- .NET SDK 8
- PostgreSQL 14+

## 1) Subir PostgreSQL

Na raiz do repositorio:

```bash
docker compose up -d
```

Isso sobe um banco `mercado_db` em `localhost:5432`.

## 2) Ajustar conexao

Edite `appsettings.json`:

`Host=localhost;Port=5432;Database=mercado_db;Username=postgres;Password=postgres`

Opcionalmente, voce pode sobrescrever com a variavel de ambiente:

`ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=mercado_db;Username=postgres;Password=postgres`

## 3) Instalar ferramenta EF local (uma vez)

```bash
dotnet new tool-manifest
dotnet tool install dotnet-ef --version 8.0.12
```

## 4) Criar e aplicar migracoes

No diretorio `API WEB`:

```bash
dotnet restore
dotnet tool run dotnet-ef migrations add InitialCreate
dotnet tool run dotnet-ef database update
```

Observacao: a API tambem executa `Database.Migrate()` no startup.

## 5) Rodar API

```bash
dotnet run
```

A API sobe em `http://localhost:5043`.
