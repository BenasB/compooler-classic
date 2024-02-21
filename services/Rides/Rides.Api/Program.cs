using Rides.Api;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddGraphQLServer()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddQueryType<Query>();

var app = builder.Build();

app.MapGraphQL();

app.Run();
