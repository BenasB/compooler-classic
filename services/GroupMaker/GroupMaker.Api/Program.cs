using GroupMaker.Api;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GroupContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Sql"))
);

builder
    .Services.AddGraphQLServer()
    .RegisterDbContext<GroupContext>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddQueryType<Query>();

var app = builder.Build();

app.MapGraphQL();
app.MapBananaCakePop("/")
    .WithOptions(
        new()
        {
            ServeMode = HotChocolate.AspNetCore.GraphQLToolServeMode.Embedded,
            Title = "GroupMaker API"
        }
    );

app.Run();
