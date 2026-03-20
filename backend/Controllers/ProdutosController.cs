using MercadoApi.Data;
using MercadoApi.Dtos.Requests;
using MercadoApi.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MercadoApi.Controllers;

[ApiController]
[Route("api/produtos")]
public class ProdutosController : ControllerBase
{
    private readonly MercadoDbContext _context;

    public ProdutosController(MercadoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var produtos = await _context.Produtos
            .AsNoTracking()
            .OrderBy(p => p.Id)
            .ToListAsync();
        return Ok(produtos);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CreateProdutoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nome) || request.Preco <= 0 || request.Estoque < 0)
        {
            return BadRequest("Dados do produto inválidos.");
        }

        var produto = new Produto
        {
            Nome = request.Nome.Trim(),
            Preco = request.Preco,
            Estoque = request.Estoque
        };

        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Listar), new { id = produto.Id }, produto);
    }

    [HttpPatch("{id:int}/estoque")]
    public async Task<IActionResult> ReporEstoque(int id, [FromBody] ReporEstoqueRequest request)
    {
        if (request.Quantidade <= 0)
        {
            return BadRequest("Quantidade deve ser maior que zero.");
        }

        var produto = await _context.Produtos.FirstOrDefaultAsync(p => p.Id == id);
        if (produto is null)
        {
            return NotFound("Produto não encontrado.");
        }

        produto.Estoque += request.Quantidade;
        await _context.SaveChangesAsync();
        return Ok(produto);
    }
}
