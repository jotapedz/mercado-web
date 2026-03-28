const API_BASE_URL = "http://localhost:5043/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro na API.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  obterDashboard: () => request("/dashboard"),
  listarClientes: () => request("/clientes"),
  criarCliente: (payload) =>
    request("/clientes", { method: "POST", body: JSON.stringify(payload) }),
  atualizarCliente: (clienteId, payload) =>
    request(`/clientes/${clienteId}`, { method: "PUT", body: JSON.stringify(payload) }),
  excluirCliente: (clienteId) =>
    request(`/clientes/${clienteId}`, { method: "DELETE" }),
  listarProdutos: () => request("/produtos"),
  criarProduto: (payload) =>
    request("/produtos", { method: "POST", body: JSON.stringify(payload) }),
  reporEstoque: (produtoId, quantidade) =>
    request(`/produtos/${produtoId}/estoque`, {
      method: "PATCH",
      body: JSON.stringify({ quantidade })
    }),
  listarVendas: () => request("/vendas"),
  criarVenda: (payload) =>
    request("/vendas", { method: "POST", body: JSON.stringify(payload) })
};
