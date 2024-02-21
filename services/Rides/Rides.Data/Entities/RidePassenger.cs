namespace Rides.Data.Entities;

public class RidePassenger
{
    public int Id { get; init; }

    public required string PassengerId { get; init; }

    public required RideParticipationStatus ParticipationStatus { get; init; }
}

public enum RideParticipationStatus
{
    Participate,
    Skip
}
