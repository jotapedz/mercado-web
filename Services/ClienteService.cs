using MercadoGerenciamento.Models;

namespace MercadoGerenciamento.Services;

public class ClienteService
{
    private readonly List<Cliente> _clientes = [];
    private int _proximoId = 1;

    public Cliente Cadastrar(string nome, string documento)
    {
        var cliente = new Cliente
        {
            Id = _proximoId++,
            Nome = nome.Trim(),
            Documento = documento.Trim()
        };

        _clientes.Add(cliente);
        return cliente;
    }

    public IReadOnlyCollection<Cliente> Listar() => _clientes;

    public Cliente? BuscarPorId(int id) => _clientes.FirstOrDefault(c => c.Id == id);
}
