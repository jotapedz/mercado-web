namespace MercadoApi.Dtos.Requests;

public class CreateVendaRequest
{
    public int ClienteId { get; set; }
    public List<CreateVendaItemRequest> Itens { get; set; } = [];
}

public class CreateVendaItemRequest
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
}
