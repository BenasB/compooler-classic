using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Rides.Api;
using Rides.Api.Options;
using Rides.Clients;
using Rides.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RideContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Sql"),
        options => options.MigrationsAssembly("Rides.Data")
    )
);

builder
    .Services.AddHttpContextAccessor()
    .AddGroupMakerClient(StrawberryShake.ExecutionStrategy.NetworkOnly)
    .ConfigureHttpClient(
        (sp, client) =>
        {
            var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
            var authHeader = httpContextAccessor
                .HttpContext?.Request.Headers.Authorization[0]
                ?.Split(" ");
            if (authHeader != null && authHeader.Length == 2)
                client.DefaultRequestHeaders.Authorization = new(authHeader[0], authHeader[1]);

            client.BaseAddress = new Uri(
                builder.Configuration.GetConnectionString("GroupMaker")
                    ?? throw new InvalidOperationException("Missing URI to GroupMaker API")
            );
        }
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

builder
    .Services.AddGraphQLServer()
    .AddAuthorization()
    .RegisterDbContext<RideContext>()
    .RegisterService<IGroupMakerClient>()
    .AddFiltering()
    .AddSorting()
    .AddProjections()
    .AddMutationConventions(applyToAllMutations: true)
    .AddDefaultTransactionScopeHandler()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();

app.Run();
