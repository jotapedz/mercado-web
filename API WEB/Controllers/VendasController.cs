using MercadoApi.Data;
using MercadoApi.Dtos.Requests;
using MercadoApi.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MercadoApi.Controllers;

[ApiController]
[Route("api/vendas")]
public class VendasController : ControllerBase
{
    private readonly MercadoDbContext _context;

    public VendasController(MercadoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var vendas = await _context.Vendas
            .AsNoTracking()
            .Include(v => v.Cliente)
            .Include(v => v.Itens)
            .ThenInclude(i => i.Produto)
            .OrderByDescending(v => v.Id)
            .Select(v => new
            {
                v.Id,
                v.Data,
                v.Total,
                ClienteId = v.ClienteId,
                ClienteNome = v.Cliente!.Nome,
                Itens = v.Itens.Select(i => new
                {
                    i.ProdutoId,
                    ProdutoNome = i.Produto!.Nome,
                    i.Quantidade,
                    i.PrecoUnitario,
                    i.Subtotal
                })
            })
            .ToListAsync();

        return Ok(vendas);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CreateVendaRequest request)
    {
        if (request.Itens.Count == 0)
        {
            return BadRequest("A venda precisa ter ao menos um item.");
        }

        var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == request.ClienteId);
        if (cliente is null)
        {
            return BadRequest("Cliente não encontrado.");
        }

        var produtoIds = request.Itens.Select(i => i.ProdutoId).Distinct().ToList();
        var produtos = await _context.Produtos
            .Where(p => produtoIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        foreach (var item in request.Itens)
        {
            if (item.Quantidade <= 0)
            {
                return BadRequest("Quantidade inválida.");
            }

            if (!produtos.TryGetValue(item.ProdutoId, out var produto))
            {
                return BadRequest($"Produto {item.ProdutoId} não encontrado.");
            }

            if (produto.Estoque < item.Quantidade)
            {
                return BadRequest($"Estoque insuficiente para {produto.Nome}.");
            }
        }

        var venda = new Venda
        {
            ClienteId = cliente.Id,
            Data = DateTime.UtcNow
        };

        foreach (var item in request.Itens)
        {
            var produto = produtos[item.ProdutoId];
            produto.Estoque -= item.Quantidade;

            venda.Itens.Add(new ItemVenda
            {
                ProdutoId = produto.Id,
                Quantidade = item.Quantidade,
                PrecoUnitario = produto.Preco,
                Subtotal = item.Quantidade * produto.Preco
            });
        }

        venda.Total = venda.Itens.Sum(i => i.Subtotal);

        _context.Vendas.Add(venda);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            venda.Id,
            venda.Data,
            venda.Total
        });
    }
}
