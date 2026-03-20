using MercadoApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace MercadoApi.Data;

public class MercadoDbContext : DbContext
{
    public MercadoDbContext(DbContextOptions<MercadoDbContext> options) : base(options)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Venda> Vendas => Set<Venda>();
    public DbSet<ItemVenda> ItensVenda => Set<ItemVenda>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>()
            .Property(c => c.Nome)
            .HasMaxLength(120)
            .IsRequired();

        modelBuilder.Entity<Cliente>()
            .Property(c => c.Documento)
            .HasMaxLength(30)
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
}
