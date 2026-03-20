import { Card, CardContent, Grid, Typography } from "@mui/material";

export default function Dashboard({ clientes, produtos, vendas }) {
  const estoqueTotal = produtos.reduce((acc, p) => acc + p.estoque, 0);
  const faturamento = vendas.reduce((acc, v) => acc + v.total, 0);

  const cards = [
    { label: "Clientes", value: clientes.length },
    { label: "Produtos", value: produtos.length },
    { label: "Itens em estoque", value: estoqueTotal },
    { label: "Faturamento total", value: `R$ ${faturamento.toFixed(2)}` }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
