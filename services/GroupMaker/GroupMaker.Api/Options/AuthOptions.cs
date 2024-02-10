namespace GroupMaker.Api.Options;

public record AuthOptions(string Issuer, string Audience)
{
    public static readonly string Key = "Auth";
}
