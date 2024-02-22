using System.Security.Authentication;
using System.Security.Claims;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Rides.Clients;
using Rides.Data;
using Rides.Data.Entities;
using StrawberryShake;
using static Rides.Data.GroupDateTime;

namespace Rides.Api;

[Authorize]
public class Mutation
{
    [UseProjection]
    [Error<ArgumentException>]
    [Error<AuthenticationException>]
    public async Task<IQueryable<Ride>> CreateNextRides(
        int groupId,
        RideContext context,
        IGroupMakerClient groupMakerClient,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken,
        int? count = 1
    )
    {
        var groupInfoResult = await groupMakerClient.GetGroupForRideCreation.ExecuteAsync(
            groupId,
            cancellationToken
        );
        groupInfoResult.EnsureNoErrors();

        if (groupInfoResult.Data?.GroupById == null)
            throw new ArgumentException("Group does not exist", nameof(groupId));

        var group = groupInfoResult.Data.GroupById;
        var startTimeOnly = TimeOnly.FromTimeSpan(group.StartTime);

        if (group.Driver.Id != principal.Identity?.Name)
            throw new AuthenticationException("User is not the driver");

        var latestStartTime = await context
            .Rides.Where(x => x.GroupId == groupId)
            .OrderByDescending(x => x.StartTime)
            .Select(x => x.StartTime)
            .Cast<DateTime?>()
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        // Maybe would make sense to choose the newer between the two: latestStartTime and current group's local time
        // That way we would guard against creating next ride that is in the past (if latest ride was long time ago)

        var startTime = latestStartTime.HasValue switch
        {
            false
                => GetNextStartDateTime(
                    GetGroupCurrentLocalDateTime(
                        group.StartLocation.Latitude,
                        group.StartLocation.Longitude
                    ).DateTime,
                    group.Days,
                    startTimeOnly
                ),
            true => GetNextStartDateTime(latestStartTime.Value, group.Days, startTimeOnly)
        };

        var newRides = new List<Ride>();
        for (int i = 0; i < count; i++)
        {
            var newRide = new Ride()
            {
                Passengers = group
                    .Passengers.Select(groupPassenger => new RidePassenger()
                    {
                        ParticipationStatus = RideParticipationStatus.Participate,
                        PassengerId = groupPassenger.Id
                    })
                    .ToList(),
                GroupId = groupId,
                StartTime = startTime,
                Status = RideStatus.Upcoming
            };

            newRides.Add(newRide);
            startTime = GetNextStartDateTime(startTime, group.Days, startTimeOnly);
        }

        await context.Rides.AddRangeAsync(newRides, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return context.Rides.Where(x => newRides.Contains(x));
    }

    [UseFirstOrDefault]
    [UseProjection]
    [Error<ArgumentException>]
    [Error<AuthenticationException>]
    [Error<InvalidOperationException>]
    public async Task<IQueryable<Ride>> ProgressRide(
        int id,
        RideStatus newStatus,
        RideContext context,
        IGroupMakerClient groupMakerClient,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken
    )
    {
        var ride =
            await context.Rides.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new ArgumentException("Ride not found", nameof(id));

        var groupInfoResult = await groupMakerClient.GetGroupForRideProgress.ExecuteAsync(
            ride.GroupId,
            cancellationToken
        );
        groupInfoResult.EnsureNoErrors();

        if (groupInfoResult.Data?.GroupById == null)
            throw new ArgumentException("Ride's group does not exist", nameof(id));

        var group = groupInfoResult.Data.GroupById;

        if (group.Driver.Id != principal.Identity?.Name)
            throw new AuthenticationException("User is not the driver of the ride");

        var isValidTransition = (ride.Status, newStatus) switch
        {
            (RideStatus.Upcoming, RideStatus.InProgress or RideStatus.Cancelled) => true,
            (RideStatus.InProgress, RideStatus.Done) => true,
            // Maybe Cancelled -> Upcoming should be possible
            (_, _) => false
        };

        if (!isValidTransition)
            throw new InvalidOperationException(
                $"Invalid transition from {ride.Status} to {newStatus}"
            );

        ride.Status = newStatus;

        await context.SaveChangesAsync(cancellationToken);

        return context.Rides.Where(x => x == ride);
    }

    [UseProjection]
    [Error<ArgumentException>]
    [Error<AuthenticationException>]
    public async Task<IQueryable<Ride>> JoinUpcomingRides(
        int groupId,
        RideContext context,
        IGroupMakerClient groupMakerClient,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken
    )
    {
        var groupInfoResult = await groupMakerClient.GetGroupForJoinUpcomingRides.ExecuteAsync(
            groupId,
            cancellationToken
        );
        groupInfoResult.EnsureNoErrors();

        if (groupInfoResult.Data?.GroupById == null)
            throw new ArgumentException("Group does not exist", nameof(groupId));

        var group = groupInfoResult.Data.GroupById;
        var userId = principal.Identity?.Name;

        if (userId == null || group.Passengers.All(x => x.Id != userId))
            throw new AuthenticationException("User is not one of the passengers");

        var rides = await context
            .Rides.Where(x => x.GroupId == groupId)
            .Where(x => x.Status == RideStatus.Upcoming)
            .Where(x => !x.Passengers.Any(p => p.PassengerId == userId)) // Skip the rides where the user is already a passenger
            .Where(x => x.Passengers.Count + 1 <= group.TotalSeats - 1) // Skip the rides where there are max amount of passengers already, 1 seat is reserved for the driver
            .ToListAsync(cancellationToken);

        foreach (var ride in rides)
        {
            ride.Passengers.Add(
                new()
                {
                    PassengerId = userId,
                    ParticipationStatus = RideParticipationStatus.Participate
                }
            );
        }

        await context.SaveChangesAsync(cancellationToken);

        return context.Rides.Where(x => rides.Contains(x));
    }

    [Error<ArgumentException>]
    [Error<AuthenticationException>]
    [UseMutationConvention(PayloadFieldName = "ids")]
    public async Task<IEnumerable<int>> LeaveUpcomingRides(
        int groupId,
        RideContext context,
        IGroupMakerClient groupMakerClient,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken
    )
    {
        var groupInfoResult = await groupMakerClient.GetGroupForLeaveUpcomingRides.ExecuteAsync(
            groupId,
            cancellationToken
        );
        groupInfoResult.EnsureNoErrors();

        if (groupInfoResult.Data?.GroupById == null)
            throw new ArgumentException("Group does not exist", nameof(groupId));

        var group = groupInfoResult.Data.GroupById;
        var userId = principal.Identity?.Name;

        if (group.Passengers.Any(x => x.Id == userId))
            throw new AuthenticationException("User is still one of the passengers in the group");

        var ridePassengers = await context
            .Rides.Where(x => x.GroupId == groupId)
            .Where(x => x.Status == RideStatus.Upcoming)
            .Where(x => x.Passengers.Any(p => p.PassengerId == userId)) // Take the rides where the user is a passenger
            .Select(x => new { x.Id, Passenger = x.Passengers.First(p => p.PassengerId == userId) })
            .ToListAsync(cancellationToken);

        context.Passengers.RemoveRange(ridePassengers.Select(x => x.Passenger));

        await context.SaveChangesAsync(cancellationToken);

        return ridePassengers.Select(x => x.Id);
    }

    [UseProjection]
    [Error<ArgumentException>]
    [Error<AuthenticationException>]
    [Error<InvalidOperationException>]
    public async Task<IQueryable<RidePassenger>> ChangeRideParticipationStatus(
        int rideId,
        RideParticipationStatus status,
        RideContext context,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken
    )
    {
        var userId = principal.Identity?.Name;
        var ride =
            await context
                .Rides.Where(x => x.Id == rideId)
                .Include(x => x.Passengers)
                .FirstOrDefaultAsync(cancellationToken)
            ?? throw new ArgumentException("Ride was not found", nameof(rideId));

        var ridePassenger =
            ride.Passengers.FirstOrDefault(x => x.PassengerId == userId)
            ?? throw new AuthenticationException("User is not a passenger in this group");

        if (ride.Status != RideStatus.Upcoming)
            throw new InvalidOperationException(
                "Participation status can only be changed for upcoming rides"
            );

        ridePassenger.ParticipationStatus = status;

        await context.SaveChangesAsync(cancellationToken);

        return context.Passengers.Where(x => x == ridePassenger);
    }
}
