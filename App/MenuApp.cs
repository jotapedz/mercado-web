using MercadoGerenciamento.Models;
using MercadoGerenciamento.Services;

namespace MercadoGerenciamento.App;

public class MenuApp
{
    private readonly ClienteService _clienteService = new();
    private readonly EstoqueService _estoqueService = new();
    private readonly VendaService _vendaService;

    public MenuApp()
    {
        _vendaService = new VendaService(_estoqueService);
    }

    public void Executar()
    {
        while (true)
        {
            ExibirMenu();
            var opcao = Console.ReadLine();

            switch (opcao)
            {
                case "1":
                    CadastrarCliente();
                    break;
                case "2":
                    CadastrarProduto();
                    break;
                case "3":
                    ReporEstoque();
                    break;
                case "4":
                    RegistrarVenda();
                    break;
                case "5":
                    ListarProdutos();
                    break;
                case "6":
                    ListarClientes();
                    break;
                case "7":
                    ListarVendas();
                    break;
                case "0":
                    Console.WriteLine("Encerrando sistema...");
                    return;
                default:
                    Console.WriteLine("Opção inválida.");
                    break;
            }

            Console.WriteLine("\nPressione ENTER para continuar...");
            Console.ReadLine();
            Console.Clear();
        }
    }

    private static void ExibirMenu()
    {
        Console.WriteLine("=== Sistema de Gerenciamento de Mercado ===");
        Console.WriteLine("1 - Cadastrar cliente");
        Console.WriteLine("2 - Cadastrar produto");
        Console.WriteLine("3 - Repor estoque");
        Console.WriteLine("4 - Registrar venda");
        Console.WriteLine("5 - Listar produtos");
        Console.WriteLine("6 - Listar clientes");
        Console.WriteLine("7 - Listar vendas");
        Console.WriteLine("0 - Sair");
        Console.Write("Escolha uma opção: ");
    }

    private void CadastrarCliente()
    {
        Console.Write("Nome do cliente: ");
        var nome = Console.ReadLine() ?? string.Empty;

        Console.Write("Documento (CPF/CNPJ): ");
        var documento = Console.ReadLine() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(nome) || string.IsNullOrWhiteSpace(documento))
        {
            Console.WriteLine("Nome e documento são obrigatórios.");
            return;
        }

        var cliente = _clienteService.Cadastrar(nome, documento);
        Console.WriteLine($"Cliente cadastrado com ID {cliente.Id}.");
    }

    private void CadastrarProduto()
    {
        Console.Write("Nome do produto: ");
        var nome = Console.ReadLine() ?? string.Empty;

        Console.Write("Preço: ");
        if (!decimal.TryParse(Console.ReadLine(), out var preco) || preco <= 0)
        {
            Console.WriteLine("Preço inválido.");
            return;
        }

        Console.Write("Quantidade inicial em estoque: ");
        if (!int.TryParse(Console.ReadLine(), out var quantidade) || quantidade < 0)
        {
            Console.WriteLine("Quantidade inválida.");
            return;
        }

        var produto = _estoqueService.CadastrarProduto(nome, preco, quantidade);
        Console.WriteLine($"Produto cadastrado com ID {produto.Id}.");
    }

    private void ReporEstoque()
    {
        ListarProdutos();
        Console.Write("Informe o ID do produto para reposição: ");
        if (!int.TryParse(Console.ReadLine(), out var id))
        {
            Console.WriteLine("ID inválido.");
            return;
        }

        Console.Write("Quantidade a adicionar: ");
        if (!int.TryParse(Console.ReadLine(), out var quantidade))
        {
            Console.WriteLine("Quantidade inválida.");
            return;
        }

        var sucesso = _estoqueService.ReporEstoque(id, quantidade);
        Console.WriteLine(sucesso ? "Estoque atualizado com sucesso." : "Não foi possível atualizar o estoque.");
    }

    private void RegistrarVenda()
    {
        ListarClientes();
        Console.Write("Informe o ID do cliente: ");
        if (!int.TryParse(Console.ReadLine(), out var clienteId))
        {
            Console.WriteLine("ID do cliente inválido.");
            return;
        }

        var cliente = _clienteService.BuscarPorId(clienteId);
        if (cliente is null)
        {
            Console.WriteLine("Cliente não encontrado.");
            return;
        }

        var itens = new List<(int produtoId, int quantidade)>();

        while (true)
        {
            ListarProdutos();
            Console.Write("Informe o ID do produto (0 para finalizar): ");
            if (!int.TryParse(Console.ReadLine(), out var produtoId))
            {
                Console.WriteLine("ID inválido.");
                continue;
            }

            if (produtoId == 0)
            {
                break;
            }

            Console.Write("Quantidade: ");
            if (!int.TryParse(Console.ReadLine(), out var quantidade))
            {
                Console.WriteLine("Quantidade inválida.");
                continue;
            }

            itens.Add((produtoId, quantidade));
        }

        var resultado = _vendaService.RegistrarVenda(cliente, itens);
        Console.WriteLine(resultado.mensagem);

        if (resultado.sucesso && resultado.venda is not null)
        {
            ExibirResumoVenda(resultado.venda);
        }
    }

    private void ListarProdutos()
    {
        var produtos = _estoqueService.ListarProdutos();
        Console.WriteLine("\n--- Produtos ---");

        if (produtos.Count == 0)
        {
            Console.WriteLine("Nenhum produto cadastrado.");
            return;
        }

        foreach (var p in produtos)
        {
            Console.WriteLine($"ID: {p.Id} | Nome: {p.Nome} | Preço: {p.Preco:C2} | Estoque: {p.QuantidadeEstoque}");
        }
    }

    private void ListarClientes()
    {
        var clientes = _clienteService.Listar();
        Console.WriteLine("\n--- Clientes ---");

        if (clientes.Count == 0)
        {
            Console.WriteLine("Nenhum cliente cadastrado.");
            return;
        }

        foreach (var c in clientes)
        {
            Console.WriteLine($"ID: {c.Id} | Nome: {c.Nome} | Documento: {c.Documento}");
        }
    }

    private void ListarVendas()
    {
        var vendas = _vendaService.ListarVendas();
        Console.WriteLine("\n--- Vendas ---");

        if (vendas.Count == 0)
        {
            Console.WriteLine("Nenhuma venda registrada.");
            return;
        }

        foreach (var venda in vendas)
        {
            Console.WriteLine($"Venda #{venda.Id} | Data: {venda.Data:g} | Cliente: {venda.Cliente.Nome} | Total: {venda.Total:C2}");
        }
    }

    private static void ExibirResumoVenda(Venda venda)
    {
        Console.WriteLine("\n--- Resumo da Venda ---");
        Console.WriteLine($"Venda #{venda.Id} - Cliente: {venda.Cliente.Nome}");
        foreach (var item in venda.Itens)
        {
            Console.WriteLine($"{item.NomeProduto} x{item.Quantidade} - {item.Subtotal:C2}");
        }

        Console.WriteLine($"Total: {venda.Total:C2}");
    }
}
