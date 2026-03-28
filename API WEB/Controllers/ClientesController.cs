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

        var documento = ApenasDigitos(request.Documento);
        if (!CpfEhValido(documento))
        {
            return BadRequest("CPF inválido. Informe um CPF com 11 dígitos válidos.");
        }

        var cliente = new Cliente
        {
            Nome = request.Nome.Trim(),
            Documento = documento
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Listar), new { id = cliente.Id }, cliente);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] UpdateClienteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Documento))
        {
            return BadRequest("Nome e documento são obrigatórios.");
        }

        var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);
        if (cliente is null)
        {
            return NotFound("Cliente não encontrado.");
        }

        var documento = ApenasDigitos(request.Documento);
        if (!CpfEhValido(documento))
        {
            return BadRequest("CPF inválido. Informe um CPF com 11 dígitos válidos.");
        }

        cliente.Nome = request.Nome.Trim();
        cliente.Documento = documento;

        await _context.SaveChangesAsync();
        return Ok(cliente);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);
        if (cliente is null)
        {
            return NotFound("Cliente não encontrado.");
        }

        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static string ApenasDigitos(string valor)
    {
        return new string(valor.Where(char.IsDigit).ToArray());
    }

    private static bool CpfEhValido(string cpf)
    {
        if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
        {
            return false;
        }

        var numeros = cpf.Select(c => c - '0').ToArray();

        var soma1 = 0;
        for (var i = 0; i < 9; i++)
        {
            soma1 += numeros[i] * (10 - i);
        }

        var resto1 = soma1 % 11;
        var digito1 = resto1 < 2 ? 0 : 11 - resto1;
        if (numeros[9] != digito1)
        {
            return false;
        }

        var soma2 = 0;
        for (var i = 0; i < 10; i++)
        {
            soma2 += numeros[i] * (11 - i);
        }

        var resto2 = soma2 % 11;
        var digito2 = resto2 < 2 ? 0 : 11 - resto2;
        return numeros[10] == digito2;
    }
}
