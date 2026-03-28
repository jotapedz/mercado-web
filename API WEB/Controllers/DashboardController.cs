using MercadoApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MercadoApi.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly MercadoDbContext _context;

    public DashboardController(MercadoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        var clientes = await _context.Clientes.CountAsync();
        var produtos = await _context.Produtos.CountAsync();
        var estoqueTotal = await _context.Produtos.SumAsync(p => (int?)p.Estoque) ?? 0;
        var faturamentoTotal = await _context.Vendas.SumAsync(v => (decimal?)v.Total) ?? 0m;
        var faturamentoPorDia = await _context.Vendas
            .GroupBy(v => v.Data.Date)
            .Select(g => new
            {
                dia = g.Key,
                quantidadeVendas = g.Count(),
                total = g.Sum(v => v.Total)
            })
            .OrderBy(x => x.dia)
            .ToListAsync();

        return Ok(new
        {
            clientes,
            produtos,
            estoqueTotal,
            faturamentoTotal,
            faturamentoPorDia = faturamentoPorDia.Select(x => new
            {
                dia = x.dia.ToString("yyyy-MM-dd"),
                x.quantidadeVendas,
                x.total
            })
        });
    }
}
