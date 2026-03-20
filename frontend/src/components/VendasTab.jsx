import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";

export default function VendasTab({ clientes, produtos, vendas, onRegistrarVenda }) {
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState("");

  const totalPreview = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade * item.preco, 0),
    [itens]
  );

  const addItem = () => {
    setErro("");
    const pId = Number(produtoId);
    const qtd = Number(quantidade);
    const produto = produtos.find((p) => p.id === pId);

    if (!produto || qtd <= 0) {
      setErro("Selecione um produto e uma quantidade válida.");
      return;
    }

    if (qtd > produto.estoque) {
      setErro("Quantidade maior que o estoque disponível.");
      return;
    }

    setItens((prev) => [...prev, { produtoId: produto.id, nome: produto.nome, quantidade: qtd, preco: produto.preco }]);
    setProdutoId("");
    setQuantidade("");
  };

  const finalizarVenda = async () => {
    setErro("");
    const cId = Number(clienteId);
    if (cId <= 0 || itens.length === 0) {
      setErro("Selecione um cliente e adicione ao menos um item.");
      return;
    }

    try {
      const ok = await onRegistrarVenda(cId, itens);
      if (!ok) {
        setErro("Falha ao registrar venda. Verifique estoque e cliente.");
        return;
      }
      setClienteId("");
      setItens([]);
    } catch (error) {
      setErro(error.message || "Falha ao registrar venda.");
      return;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Nova venda
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={clienteId}
                label="Cliente"
                onChange={(e) => setClienteId(e.target.value)}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    #{cliente.id} - {cliente.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Produto</InputLabel>
              <Select
                value={produtoId}
                label="Produto"
                onChange={(e) => setProdutoId(e.target.value)}
              >
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    #{produto.id} - {produto.nome} (estoque: {produto.estoque})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantidade"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
            <Button variant="outlined" onClick={addItem}>
              Adicionar item
            </Button>

            {erro && <Alert severity="error">{erro}</Alert>}

            <Typography variant="subtitle1" fontWeight={700}>
              Total parcial: R$ {totalPreview.toFixed(2)}
            </Typography>
            <Button variant="contained" onClick={finalizarVenda}>
              Finalizar venda
            </Button>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Itens da venda atual
          </Typography>
          <Stack spacing={1}>
            {itens.length === 0 && <Typography color="text.secondary">Nenhum item adicionado.</Typography>}
            {itens.map((item, index) => (
              <Paper key={`${item.produtoId}-${index}`} variant="outlined" sx={{ p: 1.5 }}>
                <Typography>
                  {item.nome} x{item.quantidade} - R$ {(item.quantidade * item.preco).toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Histórico de vendas
          </Typography>
          <Stack spacing={1}>
            {vendas.length === 0 && <Typography color="text.secondary">Nenhuma venda registrada.</Typography>}
            {vendas.map((venda) => (
              <Paper key={venda.id} variant="outlined" sx={{ p: 1.5 }}>
                <Typography fontWeight={600}>
                  Venda #{venda.id} - Cliente: {venda.clienteNome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {new Date(venda.data).toLocaleString("pt-BR")} | Total: R$ {venda.total.toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
