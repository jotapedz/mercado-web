import { useState } from "react";
import { Alert, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

export default function ClientesTab({ clientes, onAddCliente }) {
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome.trim() || !documento.trim()) return;
    try {
      setErro("");
      await onAddCliente(nome, documento);
      setNome("");
      setDocumento("");
    } catch (error) {
      setErro(error.message || "Falha ao cadastrar cliente.");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Paper
          sx={{
            p: 2.5,
            background: "linear-gradient(145deg, rgba(10,16,30,0.95), rgba(19,33,56,0.9))"
          }}
        >
          <Typography variant="h6" gutterBottom>
            Novo cliente
          </Typography>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            {erro && <Alert severity="error">{erro}</Alert>}
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <TextField
              label="Documento (CPF/CNPJ)"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
            <Button type="submit" variant="contained">
              Cadastrar cliente
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="h6" gutterBottom>
            Lista de clientes
          </Typography>
          <Stack spacing={1}>
            {clientes.length === 0 && <Typography color="text.secondary">Nenhum cliente cadastrado.</Typography>}
            {clientes.map((cliente) => (
              <Paper
                key={cliente.id}
                variant="outlined"
                sx={{ p: 1.75, backgroundColor: "rgba(11,16,32,0.78)" }}
              >
                <Typography fontWeight={600}>{cliente.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Documento: {cliente.documento}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
