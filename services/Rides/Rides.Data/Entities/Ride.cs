namespace Rides.Data.Entities;

public class Ride
{
    public int Id { get; init; }

    public required DateTimeOffset StartTime { get; init; }

    public required int GroupId { get; init; }

    public List<RidePassenger> Passengers { get; init; } = [];

    public required RideStatus Status { get; init; }
}

public enum RideStatus
{
    Upcoming,
    InProgress,
    Done,
    Cancelled
}
