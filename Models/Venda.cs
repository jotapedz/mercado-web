namespace MercadoGerenciamento.Models;

public class Venda
{
    public int Id { get; set; }
    public DateTime Data { get; set; } = DateTime.Now;
    public Cliente Cliente { get; set; } = new();
    public List<ItemVenda> Itens { get; set; } = [];
    public decimal Total => Itens.Sum(i => i.Subtotal);
}
