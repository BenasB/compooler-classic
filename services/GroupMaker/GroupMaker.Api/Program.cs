using GroupMaker.Api;
using GroupMaker.Api.Options;
using GroupMaker.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GroupContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Sql"),
        options => options.MigrationsAssembly("GroupMaker.Data")
    )
);

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var authOptions =
            builder.Configuration.GetSection(AuthOptions.Key).Get<AuthOptions>()
            ?? throw new InvalidOperationException("Could not find authentication options");

        options.Authority = authOptions.Issuer;
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = authOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = authOptions.Audience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            RequireSignedTokens = !builder.Environment.IsDevelopment(),

            NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        };

        options.Events = new()
        {
            OnAuthenticationFailed = context =>
            {
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder
    .Services.AddGraphQLServer()
    .AddAuthorization()
    .RegisterDbContext<GroupContext>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .BindRuntimeType<DaysOfWeek, IntType>()
    .AddTypeConverter<DaysOfWeek, int>(source => (int)source)
    .AddTypeConverter<int, DaysOfWeek>(source => (DaysOfWeek)source)
    .AddMutationConventions(applyToAllMutations: true)
    .AddDefaultTransactionScopeHandler()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<GroupContext>();

    if (!context.Groups.Any())
    {
        await Seeder.SeedAsync(context);
    }
}

app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();

app.Run();
