using GroupMaker.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGraphQLServer().AddQueryType<Query>();

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
