using MercadoApi.Data;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5043");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDataProtection();
builder.Services.AddDbContext<MercadoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MercadoDbContext>();
    var dataProtectionProvider = scope.ServiceProvider.GetRequiredService<IDataProtectionProvider>();
    var cpfProtector = dataProtectionProvider.CreateProtector("MercadoApi.Cliente.Documento.v1");

    dbContext.Database.Migrate();

    var clientesParaAtualizar = dbContext.Clientes
        .AsNoTracking()
        .Select(c => new { c.Id, c.Documento })
        .ToList()
        .Where(c => !string.IsNullOrWhiteSpace(c.Documento) && !DocumentoJaProtegido(c.Documento, cpfProtector))
        .Select(c => new { c.Id, DocumentoProtegido = cpfProtector.Protect(c.Documento) })
        .ToList();

    foreach (var cliente in clientesParaAtualizar)
    {
        dbContext.Database.ExecuteSqlInterpolated(
            $@"UPDATE ""Clientes"" SET ""Documento"" = {cliente.DocumentoProtegido} WHERE ""Id"" = {cliente.Id}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();

static bool DocumentoJaProtegido(string valor, IDataProtector protector)
{
    try
    {
        protector.Unprotect(valor);
        return true;
    }
    catch
    {
        return false;
    }
}
