using Microsoft.EntityFrameworkCore;
using Rides.Api;
using Rides.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RideContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Sql"),
        options => options.MigrationsAssembly("Rides.Data")
    )
);

builder
    .Services.AddGraphQLServer()
    .RegisterDbContext<RideContext>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddMutationConventions(applyToAllMutations: true)
    .AddDefaultTransactionScopeHandler()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

app.MapGraphQL();

app.Run();
