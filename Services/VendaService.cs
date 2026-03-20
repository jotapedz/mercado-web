using MercadoGerenciamento.Models;

namespace MercadoGerenciamento.Services;

public class VendaService
{
    private readonly EstoqueService _estoqueService;
    private readonly List<Venda> _vendas = [];
    private int _proximoId = 1;

    public VendaService(EstoqueService estoqueService)
    {
        _estoqueService = estoqueService;
    }

    public (bool sucesso, string mensagem, Venda? venda) RegistrarVenda(Cliente cliente, List<(int produtoId, int quantidade)> itens)
    {
        if (itens.Count == 0)
        {
            return (false, "Nenhum item informado para a venda.", null);
        }

        var itensVenda = new List<ItemVenda>();

        foreach (var (produtoId, quantidade) in itens)
        {
            var produto = _estoqueService.BuscarProdutoPorId(produtoId);
            if (produto is null)
            {
                return (false, $"Produto ID {produtoId} não encontrado.", null);
            }

            if (quantidade <= 0)
            {
                return (false, $"Quantidade inválida para o produto {produto.Nome}.", null);
            }

            if (produto.QuantidadeEstoque < quantidade)
            {
                return (false, $"Estoque insuficiente para {produto.Nome}. Disponível: {produto.QuantidadeEstoque}.", null);
            }

            itensVenda.Add(new ItemVenda
            {
                ProdutoId = produto.Id,
                NomeProduto = produto.Nome,
                Quantidade = quantidade,
                PrecoUnitario = produto.Preco
            });
        }

        foreach (var item in itensVenda)
        {
            _estoqueService.BaixarEstoque(item.ProdutoId, item.Quantidade);
        }

        var venda = new Venda
        {
            Id = _proximoId++,
            Data = DateTime.Now,
            Cliente = cliente,
            Itens = itensVenda
        };

        _vendas.Add(venda);
        return (true, "Venda registrada com sucesso.", venda);
    }

    public IReadOnlyCollection<Venda> ListarVendas() => _vendas;
}
