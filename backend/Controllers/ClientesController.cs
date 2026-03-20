using MercadoApi.Data;
using MercadoApi.Dtos.Requests;
using MercadoApi.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MercadoApi.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly MercadoDbContext _context;

    public ClientesController(MercadoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var clientes = await _context.Clientes
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .ToListAsync();

        return Ok(clientes);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CreateClienteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Documento))
        {
            return BadRequest("Nome e documento são obrigatórios.");
        }

        var cliente = new Cliente
        {
            Nome = request.Nome.Trim(),
            Documento = request.Documento.Trim()
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Listar), new { id = cliente.Id }, cliente);
    }
}
