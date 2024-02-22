namespace Rides.Api.Options;

public record CorsOptions(string[] AllowedOrigins)
{
    public static readonly string Key = "Cors";
    public static readonly string PolicyName = "CustomCorsPolicy";
}
