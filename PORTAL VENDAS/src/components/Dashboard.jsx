import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";

export default function Dashboard({ clientes, produtos, vendas, onCardClick }) {
  const estoqueTotal = produtos.reduce((acc, p) => acc + p.estoque, 0);
  const faturamento = vendas.reduce((acc, v) => acc + v.total, 0);

  const cards = [
    {
      label: "Clientes",
      value: clientes.length,
      icon: <PeopleAltOutlinedIcon />,
      targetTab: 1
    },
    {
      label: "Produtos",
      value: produtos.length,
      icon: <Inventory2OutlinedIcon />,
      targetTab: 2
    },
    {
      label: "Itens em estoque",
      value: estoqueTotal,
      icon: <SellOutlinedIcon />,
      targetTab: 2
    },
    {
      label: "Faturamento total",
      value: `R$ ${faturamento.toFixed(2)}`,
      icon: <TrendingUpOutlinedIcon />,
      targetTab: 3
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
                "linear-gradient(145deg, rgba(9,13,24,0.96) 0%, rgba(17,27,46,0.94) 100%)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 18px 36px rgba(2, 6, 23, 0.48)"
              }
            }}
          >
            <CardActionArea
              onClick={() => onCardClick?.(card.targetTab)}
              sx={{ height: "100%", cursor: "pointer" }}
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
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
