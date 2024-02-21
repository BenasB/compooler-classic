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
    .Services.AddGroupMakerClient()
    .ConfigureHttpClient(client =>
        client.BaseAddress = new Uri(
            builder.Configuration.GetConnectionString("GroupMaker")
                ?? throw new InvalidOperationException("Missing URI to GroupMaker API")
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
