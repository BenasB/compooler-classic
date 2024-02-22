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
        {
            throw new ArgumentException("Ride's group does not exist", nameof(id));
        }

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
}
