namespace GroupMaker.Data.Entities;

public class User
{
    public required string Id { get; init; }
    public List<Group> Driving { get; init; } = [];
    public List<Group> Passengering { get; init; } = [];
}
