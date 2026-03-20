namespace MercadoApi.Entities;

public class Venda
{
    public int Id { get; set; }
    public DateTime Data { get; set; } = DateTime.UtcNow;
    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public List<ItemVenda> Itens { get; set; } = [];
    public decimal Total { get; set; }
}
