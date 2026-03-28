import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Grid,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

function somenteDigitos(valor) {
  return valor.replace(/\D/g, "").slice(0, 11);
}

function formatarCpf(cpf) {
  const digitos = somenteDigitos(cpf);
  return digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function ClientesTab({
  clientes,
  onAddCliente,
  onEditarCliente,
  onExcluirCliente
}) {
  const itensPorPagina = 5;
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [cpfEdicao, setCpfEdicao] = useState("");
  const [erro, setErro] = useState("");

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const termoDigitos = somenteDigitos(busca);

    if (!termo && !termoDigitos) {
      return clientes;
    }

    return clientes.filter((cliente) => {
      const nomeMatch = cliente.nome.toLowerCase().includes(termo);
      const cpfMatch = somenteDigitos(cliente.documento).includes(termoDigitos);
      return nomeMatch || cpfMatch;
    });
  }, [clientes, busca]);

  const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / itensPorPagina));

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas);
    }
  }, [pagina, totalPaginas]);

  const clientesPaginados = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    return clientesFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [clientesFiltrados, pagina]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome.trim()) {
      setErro("Nome é obrigatório.");
      return;
    }

    const cpf = somenteDigitos(documento);
    if (cpf.length !== 11) {
      setErro("CPF deve ter exatamente 11 dígitos.");
      return;
    }

    try {
      setErro("");
      await onAddCliente(nome, cpf);
      setNome("");
      setDocumento("");
    } catch (error) {
      setErro(error.message || "Falha ao cadastrar cliente.");
    }
  };

  const iniciarEdicao = (cliente) => {
    setErro("");
    setEditandoId(cliente.id);
    setNomeEdicao(cliente.nome);
    setCpfEdicao(cliente.documento);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNomeEdicao("");
    setCpfEdicao("");
  };

  const salvarEdicao = async () => {
    if (!nomeEdicao.trim()) {
      setErro("Nome é obrigatório.");
      return;
    }

    const cpf = somenteDigitos(cpfEdicao);
    if (cpf.length !== 11) {
      setErro("CPF deve ter exatamente 11 dígitos.");
      return;
    }

    try {
      setErro("");
      await onEditarCliente(editandoId, nomeEdicao, cpf);
      cancelarEdicao();
    } catch (error) {
      setErro(error.message || "Falha ao editar cliente.");
    }
  };

  const deletarCliente = async (cliente) => {
    const confirmou = window.confirm(
      `Deseja realmente excluir o cliente ${cliente.nome}?`
    );

    if (!confirmou) {
      return;
    }

    try {
      setErro("");
      await onExcluirCliente(cliente.id);
      if (editandoId === cliente.id) {
        cancelarEdicao();
      }
    } catch (error) {
      setErro(error.message || "Falha ao excluir cliente.");
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
              label="CPF"
              value={formatarCpf(documento)}
              onChange={(e) => setDocumento(somenteDigitos(e.target.value))}
              inputProps={{ maxLength: 14 }}
              helperText="Informe os 11 dígitos do CPF"
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
          <TextField
            label="Buscar por nome ou CPF"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Stack spacing={1}>
            {clientes.length === 0 && (
              <Typography color="text.secondary">Nenhum cliente cadastrado.</Typography>
            )}
            {clientes.length > 0 && clientesFiltrados.length === 0 && (
              <Typography color="text.secondary">Nenhum cliente encontrado para a busca.</Typography>
            )}
            {clientesPaginados.map((cliente) => (
              <Paper
                key={cliente.id}
                variant="outlined"
                sx={{ p: 1.75, backgroundColor: "rgba(11,16,32,0.78)" }}
              >
                {editandoId === cliente.id ? (
                  <Stack spacing={1.5}>
                    <TextField
                      label="Nome"
                      value={nomeEdicao}
                      onChange={(e) => setNomeEdicao(e.target.value)}
                      size="small"
                    />
                    <TextField
                      label="CPF"
                      value={formatarCpf(cpfEdicao)}
                      onChange={(e) => setCpfEdicao(somenteDigitos(e.target.value))}
                      inputProps={{ maxLength: 14 }}
                      size="small"
                    />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" size="small" onClick={salvarEdicao}>
                        Salvar
                      </Button>
                      <Button variant="outlined" size="small" onClick={cancelarEdicao}>
                        Cancelar
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <>
                    <Typography fontWeight={600}>{cliente.nome}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      CPF: {formatarCpf(cliente.documento)}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small" onClick={() => iniciarEdicao(cliente)}>
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => deletarCliente(cliente)}
                      >
                        Excluir
                      </Button>
                    </Stack>
                  </>
                )}
              </Paper>
            ))}
          </Stack>

          {clientesFiltrados.length > itensPorPagina && (
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPaginas}
                page={pagina}
                onChange={(_, value) => setPagina(value)}
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
