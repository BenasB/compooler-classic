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
            ValidateLifetime = !builder.Environment.IsDevelopment(),
            ValidateIssuerSigningKey = true,
            RequireSignedTokens = !builder.Environment.IsDevelopment(),

            NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        };
    });

builder.Services.AddAuthorization();

var corsOptions = builder.Configuration.GetSection(CorsOptions.Key).Get<CorsOptions>();

if (corsOptions != null)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(
            CorsOptions.PolicyName,
            policy =>
            {
                policy.WithOrigins(corsOptions.AllowedOrigins).AllowAnyHeader().AllowAnyMethod();
            }
        );
    });
}

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

if (corsOptions != null)
    app.UseCors(CorsOptions.PolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();

app.Run();
