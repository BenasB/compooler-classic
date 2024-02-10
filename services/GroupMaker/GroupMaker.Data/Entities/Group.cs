using GroupMaker.Data;

namespace GroupMaker.Api.Entities;

public class Group
{
    public int Id { get; init; }

    public required TimeOnly StartTime { get; init; }

    public required DaysOfWeek Days { get; init; }

    public required Coordinates StartLocation { get; init; }

    public required Coordinates EndLocation { get; init; }

    public required int TotalSeats { get; init; }
}
