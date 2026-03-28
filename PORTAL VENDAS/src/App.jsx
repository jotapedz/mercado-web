import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
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

  const editarCliente = async (clienteId, nome, documento) => {
    const atualizado = await api.atualizarCliente(clienteId, { nome, documento });
    setClientes((prev) =>
      prev.map((cliente) => (cliente.id === clienteId ? atualizado : cliente))
    );
  };

  const excluirCliente = async (clienteId) => {
    await api.excluirCliente(clienteId);
    setClientes((prev) => prev.filter((cliente) => cliente.id !== clienteId));
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
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 10% 10%, rgba(20,184,166,0.18), transparent 35%), radial-gradient(circle at 90% 25%, rgba(245,158,11,0.16), transparent 40%), #070b14"
      }}
    >
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, letterSpacing: 0.2 }}>
            Sistema de Gerenciamento de Mercado
          </Typography>
          <Chip
            label="Online"
            color="primary"
            size="small"
            sx={{ color: "#042c2a", fontWeight: 700 }}
          />
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            mb: 3,
            background:
              "linear-gradient(145deg, rgba(13,18,32,0.92) 0%, rgba(13,30,47,0.92) 100%)"
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            Controle completo do seu mercado
          </Typography>
          <Typography color="text.secondary">
            Visualize vendas, estoque e clientes em uma interface escura moderna com foco em leitura e produtividade.
          </Typography>
        </Paper>

        {carregando && <CircularProgress sx={{ mb: 2, color: "primary.main" }} />}
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <Paper sx={{ p: 1.5, mb: 2.5 }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Dashboard" />
            <Tab label="Clientes" />
            <Tab label="Produtos" />
            <Tab label="Vendas" />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <Dashboard
            clientes={clientes}
            produtos={produtos}
            vendas={vendas}
            onCardClick={(targetTab) => setTab(targetTab)}
          />
        )}
        {tab === 1 && (
          <ClientesTab
            clientes={clientes}
            onAddCliente={addCliente}
            onEditarCliente={editarCliente}
            onExcluirCliente={excluirCliente}
          />
        )}
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
