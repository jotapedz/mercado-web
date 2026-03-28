import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

export default function Dashboard({ clientes, produtos, vendas }) {
  const estoqueTotal = produtos.reduce((acc, p) => acc + p.estoque, 0);
  const faturamento = vendas.reduce((acc, v) => acc + v.total, 0);

  const cards = [
    { label: "Clientes", value: clientes.length, icon: <PeopleAltOutlinedIcon /> },
    { label: "Produtos", value: produtos.length, icon: <Inventory2OutlinedIcon /> },
    { label: "Itens em estoque", value: estoqueTotal, icon: <SellOutlinedIcon /> },
    {
      label: "Faturamento total",
      value: `R$ ${faturamento.toFixed(2)}`,
      icon: <TrendingUpOutlinedIcon />
    }
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              height: "100%",
              background:
                "linear-gradient(145deg, rgba(9,13,24,0.96) 0%, rgba(17,27,46,0.94) 100%)"
            }}
          >
            <CardContent>
              <Box
                sx={{
                  mb: 2,
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(20,184,166,0.18)",
                  color: "primary.main"
                }}
              >
                {card.icon}
              </Box>
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
