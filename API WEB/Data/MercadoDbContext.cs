using MercadoApi.Entities;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MercadoApi.Data;

public class MercadoDbContext : DbContext
{
    private readonly IDataProtector _cpfProtector;

    public MercadoDbContext(
        DbContextOptions<MercadoDbContext> options,
        IDataProtectionProvider dataProtectionProvider) : base(options)
    {
        _cpfProtector = dataProtectionProvider.CreateProtector("MercadoApi.Cliente.Documento.v1");
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Venda> Vendas => Set<Venda>();
    public DbSet<ItemVenda> ItensVenda => Set<ItemVenda>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var documentoConverter = new ValueConverter<string, string>(
            documento => ProtegerDocumento(documento),
            documentoProtegido => DesprotegerDocumento(documentoProtegido));

        modelBuilder.Entity<Cliente>()
            .Property(c => c.Nome)
            .HasMaxLength(120)
            .IsRequired();

        modelBuilder.Entity<Cliente>()
            .Property(c => c.Documento)
            .HasMaxLength(512)
            .HasConversion(documentoConverter)
            .IsRequired();

        modelBuilder.Entity<Produto>()
            .Property(p => p.Nome)
            .HasMaxLength(120)
            .IsRequired();

        modelBuilder.Entity<Produto>()
            .Property(p => p.Preco)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<Venda>()
            .Property(v => v.Total)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<ItemVenda>()
            .Property(i => i.PrecoUnitario)
            .HasColumnType("numeric(12,2)");

        modelBuilder.Entity<ItemVenda>()
            .Property(i => i.Subtotal)
            .HasColumnType("numeric(12,2)");
    }

    private string ProtegerDocumento(string documento)
    {
        if (string.IsNullOrWhiteSpace(documento))
        {
            return documento;
        }

        return _cpfProtector.Protect(documento);
    }

    private string DesprotegerDocumento(string documentoProtegido)
    {
        if (string.IsNullOrWhiteSpace(documentoProtegido))
        {
            return documentoProtegido;
        }

        try
        {
            return _cpfProtector.Unprotect(documentoProtegido);
        }
        catch
        {
            // Mantem compatibilidade com dados legados ainda nao criptografados.
            return documentoProtegido;
        }
    }
}
