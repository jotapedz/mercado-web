import { useState } from "react";
import { Alert, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

export default function ProdutosTab({ produtos, onAddProduto, onReporEstoque }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [qtdReposicao, setQtdReposicao] = useState("");
  const [erro, setErro] = useState("");

  const submitProduto = async (event) => {
    event.preventDefault();
    const precoNum = Number(preco);
    const estoqueNum = Number(estoque);
    if (!nome.trim() || precoNum <= 0 || estoqueNum < 0) return;
    try {
      setErro("");
      await onAddProduto(nome, precoNum, estoqueNum);
      setNome("");
      setPreco("");
      setEstoque("");
    } catch (error) {
      setErro(error.message || "Falha ao cadastrar produto.");
    }
  };

  const submitReposicao = async (event) => {
    event.preventDefault();
    const id = Number(produtoId);
    const qtd = Number(qtdReposicao);
    if (id <= 0 || qtd <= 0) return;
    try {
      setErro("");
      await onReporEstoque(id, qtd);
      setProdutoId("");
      setQtdReposicao("");
    } catch (error) {
      setErro(error.message || "Falha ao repor estoque.");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Novo produto
          </Typography>
          <Stack component="form" spacing={2} onSubmit={submitProduto}>
            {erro && <Alert severity="error">{erro}</Alert>}
            <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            <TextField
              label="Preço"
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
            <TextField
              label="Estoque inicial"
              type="number"
              value={estoque}
              onChange={(e) => setEstoque(e.target.value)}
              required
            />
            <Button type="submit" variant="contained">
              Cadastrar produto
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Reposição de estoque
          </Typography>
          <Stack component="form" spacing={2} onSubmit={submitReposicao}>
            <TextField
              label="ID do produto"
              type="number"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
            />
            <TextField
              label="Quantidade"
              type="number"
              value={qtdReposicao}
              onChange={(e) => setQtdReposicao(e.target.value)}
            />
            <Button type="submit" variant="outlined">
              Repor estoque
            </Button>
          </Stack>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lista de produtos
          </Typography>
          <Stack spacing={1}>
            {produtos.length === 0 && <Typography color="text.secondary">Nenhum produto cadastrado.</Typography>}
            {produtos.map((produto) => (
              <Paper key={produto.id} variant="outlined" sx={{ p: 1.5 }}>
                <Typography fontWeight={600}>
                  #{produto.id} - {produto.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Preço: R$ {produto.preco.toFixed(2)} | Estoque: {produto.estoque}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
