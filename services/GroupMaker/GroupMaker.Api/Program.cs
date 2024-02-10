using GroupMaker.Api;
using GroupMaker.Data;
using GroupMaker.Data.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GroupContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Sql"),
        options => options.MigrationsAssembly("GroupMaker.Data")
    )
);

builder
    .Services.AddGraphQLServer()
    .RegisterDbContext<GroupContext>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .BindRuntimeType<DaysOfWeek, IntType>()
    .AddTypeConverter<DaysOfWeek, int>(source => (int)source)
    .AddQueryType<Query>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<GroupContext>();

    if (!context.Groups.Any())
    {
        await Seeder.SeedAsync(context);
    }
}

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
