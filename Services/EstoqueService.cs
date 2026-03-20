using MercadoGerenciamento.Models;

namespace MercadoGerenciamento.Services;

public class EstoqueService
{
    private readonly List<Produto> _produtos = [];
    private int _proximoId = 1;

    public Produto CadastrarProduto(string nome, decimal preco, int quantidadeInicial)
    {
        var produto = new Produto
        {
            Id = _proximoId++,
            Nome = nome.Trim(),
            Preco = preco,
            QuantidadeEstoque = quantidadeInicial
        };

        _produtos.Add(produto);
        return produto;
    }

    public IReadOnlyCollection<Produto> ListarProdutos() => _produtos;

    public Produto? BuscarProdutoPorId(int id) => _produtos.FirstOrDefault(p => p.Id == id);

    public bool ReporEstoque(int produtoId, int quantidade)
    {
        var produto = BuscarProdutoPorId(produtoId);
        if (produto is null || quantidade <= 0)
        {
            return false;
        }

        produto.QuantidadeEstoque += quantidade;
        return true;
    }

    public bool BaixarEstoque(int produtoId, int quantidade)
    {
        var produto = BuscarProdutoPorId(produtoId);
        if (produto is null || quantidade <= 0 || produto.QuantidadeEstoque < quantidade)
        {
            return false;
        }

        produto.QuantidadeEstoque -= quantidade;
        return true;
    }
}
