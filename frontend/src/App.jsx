import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from "@mui/material";
import Dashboard from "./components/Dashboard";
import ClientesTab from "./components/ClientesTab";
import ProdutosTab from "./components/ProdutosTab";
import VendasTab from "./components/VendasTab";
import { api } from "./api";

export default function App() {
  const [tab, setTab] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setErro("");
        const [clientesData, produtosData, vendasData] = await Promise.all([
          api.listarClientes(),
          api.listarProdutos(),
          api.listarVendas()
        ]);
        setClientes(clientesData);
        setProdutos(produtosData);
        setVendas(vendasData);
      } catch (error) {
        setErro(error.message || "Falha ao carregar dados da API.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const addCliente = async (nome, documento) => {
    const novo = await api.criarCliente({ nome, documento });
    setClientes((prev) => [...prev, novo]);
  };

  const addProduto = async (nome, preco, estoque) => {
    const novo = await api.criarProduto({ nome, preco, estoque });
    setProdutos((prev) => [...prev, novo]);
  };

  const reporEstoque = async (produtoId, quantidade) => {
    const atualizado = await api.reporEstoque(produtoId, quantidade);
    setProdutos((prev) =>
      prev.map((p) => (p.id === produtoId ? atualizado : p))
    );
  };

  const registrarVenda = async (clienteId, itens) => {
    await api.criarVenda({
      clienteId,
      itens: itens.map((item) => ({ produtoId: item.produtoId, quantidade: item.quantidade }))
    });

    const [produtosData, vendasData] = await Promise.all([api.listarProdutos(), api.listarVendas()]);
    setProdutos(produtosData);
    setVendas(vendasData);
    return true;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gerenciamento de Mercado
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        {carregando && <CircularProgress sx={{ mb: 2 }} />}
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
          <Tab label="Dashboard" />
          <Tab label="Clientes" />
          <Tab label="Produtos" />
          <Tab label="Vendas" />
        </Tabs>

        {tab === 0 && <Dashboard clientes={clientes} produtos={produtos} vendas={vendas} />}
        {tab === 1 && <ClientesTab clientes={clientes} onAddCliente={addCliente} />}
        {tab === 2 && (
          <ProdutosTab produtos={produtos} onAddProduto={addProduto} onReporEstoque={reporEstoque} />
        )}
        {tab === 3 && (
          <VendasTab
            clientes={clientes}
            produtos={produtos}
            vendas={vendas}
            onRegistrarVenda={registrarVenda}
          />
        )}
      </Container>
    </Box>
  );
}
