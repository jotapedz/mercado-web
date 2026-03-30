const api = require("./api-client");

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const HELP_TEXT = [
  "*Bot Mercado - Comandos*",
  "",
  "`menu`",
  "`dashboard`",
  "`clientes`",
  "`produtos`",
  "`vendas`",
  "",
  "*Cadastrar cliente*",
  "`cliente novo | Nome Sobrenome | CPF`",
  "",
  "*Cadastrar produto*",
  "`produto novo | Nome Produto | preco | estoque`",
  "Exemplo: `produto novo | Cafe 500g | 12,90 | 30`",
  "",
  "*Repor estoque*",
  "`estoque repor | produtoId | quantidade`",
  "",
  "*Criar venda*",
  "`venda nova | clienteId | produtoId:quantidade,produtoId:quantidade`",
  "Exemplo: `venda nova | 1 | 2:3,4:1`",
].join("\n");

function normalizeText(value) {
  return String(value || "").trim();
}

function splitByPipe(text) {
  return text
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseInteger(value) {
  const parsed = Number.parseInt(String(value).trim(), 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

function parseDecimal(value) {
  const text = String(value).trim();
  if (!text) {
    return null;
  }

  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  let normalized = text;
  if (hasComma && hasDot) {
    normalized = text.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = text.replace(",", ".");
  }

  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function formatMoney(value) {
  const numberValue = Number(value || 0);
  return moneyFormatter.format(numberValue);
}

function maskCpf(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 11) {
    return value || "-";
  }
  return `${digits.slice(0, 3)}.***.***-${digits.slice(-2)}`;
}

function parseVendaItens(value) {
  const chunks = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return null;
  }

  const itens = [];
  for (const chunk of chunks) {
    const [produtoIdRaw, quantidadeRaw] = chunk.split(":").map((part) => part.trim());
    const produtoId = parseInteger(produtoIdRaw);
    const quantidade = parseInteger(quantidadeRaw);

    if (!produtoId || !quantidade || quantidade <= 0) {
      return null;
    }

    itens.push({ produtoId, quantidade });
  }

  return itens;
}

async function cmdDashboard() {
  const data = await api.get("/api/dashboard");

  const linhas = [
    "*Dashboard*",
    `Clientes: ${data.clientes ?? 0}`,
    `Produtos: ${data.produtos ?? 0}`,
    `Estoque total: ${data.estoqueTotal ?? 0}`,
    `Faturamento total: ${formatMoney(data.faturamentoTotal ?? 0)}`,
  ];

  if (Array.isArray(data.faturamentoPorDia) && data.faturamentoPorDia.length > 0) {
    linhas.push("");
    linhas.push("Ultimos dias:");
    const ultimosDias = data.faturamentoPorDia.slice(-5);
    for (const item of ultimosDias) {
      linhas.push(
        `${item.dia}: ${item.quantidadeVendas} venda(s) - ${formatMoney(item.total)}`
      );
    }
  }

  return linhas.join("\n");
}

async function cmdClientes() {
  const clientes = await api.get("/api/clientes");
  if (!Array.isArray(clientes) || clientes.length === 0) {
    return "Nenhum cliente cadastrado.";
  }

  const linhas = ["*Clientes*"];
  clientes.slice(0, 20).forEach((cliente) => {
    linhas.push(`#${cliente.id} - ${cliente.nome} (${maskCpf(cliente.documento)})`);
  });

  if (clientes.length > 20) {
    linhas.push(`... e mais ${clientes.length - 20} cliente(s).`);
  }

  return linhas.join("\n");
}

async function cmdNovoCliente(input) {
  const parts = splitByPipe(input);
  if (parts.length < 3) {
    return "Uso: cliente novo | Nome Sobrenome | CPF";
  }

  const nome = parts[1];
  const documento = parts[2];

  const created = await api.post("/api/clientes", {
    nome,
    documento,
  });

  return `Cliente criado com sucesso.\nId: ${created.id}\nNome: ${created.nome}`;
}

async function cmdProdutos() {
  const produtos = await api.get("/api/produtos");
  if (!Array.isArray(produtos) || produtos.length === 0) {
    return "Nenhum produto cadastrado.";
  }

  const linhas = ["*Produtos*"];
  produtos.slice(0, 20).forEach((produto) => {
    linhas.push(
      `#${produto.id} - ${produto.nome} | ${formatMoney(produto.preco)} | estoque ${produto.estoque}`
    );
  });

  if (produtos.length > 20) {
    linhas.push(`... e mais ${produtos.length - 20} produto(s).`);
  }

  return linhas.join("\n");
}

async function cmdNovoProduto(input) {
  const parts = splitByPipe(input);
  if (parts.length < 4) {
    return "Uso: produto novo | Nome Produto | preco | estoque";
  }

  const nome = parts[1];
  const preco = parseDecimal(parts[2]);
  const estoque = parseInteger(parts[3]);

  if (!preco || preco <= 0 || estoque === null || estoque < 0) {
    return "Dados invalidos. Exemplo: produto novo | Cafe 500g | 12,90 | 30";
  }

  const created = await api.post("/api/produtos", {
    nome,
    preco,
    estoque,
  });

  return `Produto criado com sucesso.\nId: ${created.id}\nNome: ${created.nome}\nPreco: ${formatMoney(created.preco)}\nEstoque: ${created.estoque}`;
}

async function cmdReporEstoque(input) {
  const parts = splitByPipe(input);
  if (parts.length < 3) {
    return "Uso: estoque repor | produtoId | quantidade";
  }

  const produtoId = parseInteger(parts[1]);
  const quantidade = parseInteger(parts[2]);

  if (!produtoId || !quantidade || quantidade <= 0) {
    return "Valores invalidos. Exemplo: estoque repor | 2 | 15";
  }

  const updated = await api.patch(`/api/produtos/${produtoId}/estoque`, {
    quantidade,
  });

  return `Estoque atualizado.\nProduto: ${updated.nome}\nNovo estoque: ${updated.estoque}`;
}

async function cmdVendas() {
  const vendas = await api.get("/api/vendas");
  if (!Array.isArray(vendas) || vendas.length === 0) {
    return "Nenhuma venda registrada.";
  }

  const linhas = ["*Ultimas vendas*"];

  vendas.slice(0, 5).forEach((venda) => {
    const itens = Array.isArray(venda.itens)
      ? venda.itens.map((item) => `${item.produtoNome} x${item.quantidade}`).join(", ")
      : "";
    linhas.push(
      `#${venda.id} | cliente ${venda.clienteNome} | total ${formatMoney(venda.total)}`
    );
    if (itens) {
      linhas.push(`Itens: ${itens}`);
    }
  });

  return linhas.join("\n");
}

async function cmdNovaVenda(input) {
  const parts = splitByPipe(input);
  if (parts.length < 3) {
    return "Uso: venda nova | clienteId | produtoId:quantidade,produtoId:quantidade";
  }

  const clienteId = parseInteger(parts[1]);
  const itens = parseVendaItens(parts[2]);

  if (!clienteId || !itens) {
    return "Dados invalidos. Exemplo: venda nova | 1 | 2:3,4:1";
  }

  const venda = await api.post("/api/vendas", {
    clienteId,
    itens,
  });

  return `Venda criada com sucesso.\nId: ${venda.id}\nData: ${venda.data}\nTotal: ${formatMoney(venda.total)}`;
}

async function handleCommand(text) {
  const input = normalizeText(text);
  if (!input) {
    return null;
  }

  const lowerInput = input.toLowerCase();

  try {
    if (["menu", "ajuda", "help", "comandos", "oi", "olá", "ola"].includes(lowerInput)) {
      return HELP_TEXT;
    }

    if (lowerInput === "dashboard") {
      return await cmdDashboard();
    }

    if (lowerInput === "clientes") {
      return await cmdClientes();
    }

    if (lowerInput.startsWith("cliente novo")) {
      return await cmdNovoCliente(input);
    }

    if (lowerInput === "produtos") {
      return await cmdProdutos();
    }

    if (lowerInput.startsWith("produto novo")) {
      return await cmdNovoProduto(input);
    }

    if (lowerInput.startsWith("estoque repor")) {
      return await cmdReporEstoque(input);
    }

    if (lowerInput === "vendas") {
      return await cmdVendas();
    }

    if (lowerInput.startsWith("venda nova")) {
      return await cmdNovaVenda(input);
    }

    return "Nao entendi esse comando. Digite `menu` para ver as opcoes.";
  } catch (error) {
    return `Erro ao executar comando: ${error.message}`;
  }
}

module.exports = {
  handleCommand,
  HELP_TEXT,
};
