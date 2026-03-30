# WhatsApp Bot (gratis)

Bot de WhatsApp que consome a API do projeto (`http://localhost:5043`) sem usar API oficial paga.

## Importante

Este bot usa `whatsapp-web.js` (sessao do WhatsApp Web). E um metodo nao oficial.

- Sem custo de API oficial.
- Requer manter o numero conectado no WhatsApp Web.
- Pode haver instabilidade ou bloqueio se houver uso abusivo.

## Requisitos

- Node.js 18+
- API rodando em `http://localhost:5043`

## Como rodar

1. Entre na pasta:

```bash
cd whatsapp-bot
```

2. Instale dependencias:

```bash
npm install
```

3. Crie o arquivo `.env` a partir do exemplo:

```bash
copy .env.example .env
```

4. Inicie o bot:

```bash
npm start
```

5. Escaneie o QR Code que aparece no terminal:
   - WhatsApp no celular -> Aparelhos conectados -> Conectar aparelho.

## Comandos

- `menu`
- `dashboard`
- `clientes`
- `produtos`
- `vendas`
- `cliente novo | Nome Sobrenome | CPF`
- `produto novo | Nome Produto | preco | estoque`
- `estoque repor | produtoId | quantidade`
- `venda nova | clienteId | produtoId:quantidade,produtoId:quantidade`

## Variaveis de ambiente

No arquivo `.env`:

- `API_BASE_URL` -> URL da API (padrao: `http://localhost:5043`)
- `WHATSAPP_CLIENT_ID` -> identificador da sessao (padrao: `mercado-bot`)
- `ALLOW_GROUPS` -> `true` para responder em grupos (padrao: `false`)
- `ALLOWED_CONTACTS` -> lista de contatos permitidos separados por virgula (opcional).

Exemplo:

```env
API_BASE_URL=http://localhost:5043
WHATSAPP_CLIENT_ID=mercado-bot
ALLOW_GROUPS=false
ALLOWED_CONTACTS=5588999999999,5588988888888
```
