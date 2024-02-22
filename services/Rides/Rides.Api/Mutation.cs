using System.Security.Authentication;
using System.Security.Claims;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Rides.Clients;
using Rides.Data;
using Rides.Data.Entities;
using StrawberryShake;

namespace Rides.Api;

[Authorize]
public class Mutation
{
    [UseFirstOrDefault]
    [UseProjection]
    [Error<ArgumentException>]
    [Error<AuthenticationException>]
    public async Task<IQueryable<Ride>> CreateNextRide(
        int groupId,
        RideContext context,
        IGroupMakerClient groupMakerClient,
        ClaimsPrincipal principal,
        CancellationToken cancellationToken
    )
    {
        var groupInfoResult = await groupMakerClient.GetGroupForRideCreation.ExecuteAsync(
            groupId,
            cancellationToken
        );
        groupInfoResult.EnsureNoErrors();

        if (groupInfoResult.Data?.GroupById == null)
        {
            throw new ArgumentException("Group does not exist", nameof(groupId));
        }

        var group = groupInfoResult.Data.GroupById;

        if (group.Driver.Id != principal.Identity?.Name)
        {
            throw new AuthenticationException("User is not the driver");
        }

        var latestStartTime = await context
            .Rides.Where(x => x.GroupId == groupId)
            .OrderByDescending(x => x.StartTime)
            .Select(x => x.StartTime)
            .Cast<DateTimeOffset?>()
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        var startTime = latestStartTime.HasValue switch
        {
            false => GetNextStartDateTimeOffset(DateTimeOffset.Now, group.Days, group.StartTime),
            true => GetNextStartDateTimeOffset(latestStartTime.Value, group.Days, group.StartTime)
        };

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

        await context.Rides.AddAsync(newRide, cancellationToken);
        await context.SaveChangesAsync(cancellationToken); // TODO: Figure something out with timezone passing

        return context.Rides.Where(r => r == newRide);
    }

    private static DateTimeOffset GetNextStartDateTimeOffset(
        DateTimeOffset latest,
        int days, // 7 bit number, LSB is Monday, MSB is Sunday, e. g. 0111011 means the group is commuting on Mon, Tues, Thur, Fri and Sat
        TimeSpan startTime
    )
    {
        // Rotate the bits by one position to the left to align with .NET's DayOfWeek
        // X11101Y -> 11101Y0 | 000000X = 11101YX
        int rotatedDays = (days << 1) | (days >> 6);

        for (var i = 0; i < 7; i++)
        {
            // Check the days starting from the latest's day of week
            var day = (DayOfWeek)(((int)latest.DayOfWeek + i) % 7);

            if ((rotatedDays & (1 << (int)day)) == 0)
                continue; // Skip days on which the group does not commute

            int daysToAdd = ((int)day - (int)latest.DayOfWeek + 7) % 7;

            var nextStartDate = latest.AddDays(daysToAdd);
            var nextStartDateTimeOffset = new DateTimeOffset(
                nextStartDate.Year,
                nextStartDate.Month,
                nextStartDate.Day,
                startTime.Hours,
                startTime.Minutes,
                0,
                nextStartDate.Offset
            );

            if (daysToAdd == 0)
            {
                // Today's commute time already passed
                if (nextStartDateTimeOffset <= latest)
                {
                    var dayAfterLatest = latest.AddDays(1);
                    var dayAfterLatestMidnight = new DateTimeOffset(
                        dayAfterLatest.Year,
                        dayAfterLatest.Month,
                        dayAfterLatest.Day,
                        0,
                        0,
                        0,
                        dayAfterLatest.Offset
                    );

                    // Calculate the next commute time starting from the next midnight
                    return GetNextStartDateTimeOffset(dayAfterLatestMidnight, days, startTime);
                }
                else
                {
                    return nextStartDateTimeOffset;
                }
            }

            return nextStartDateTimeOffset;
        }

        throw new ArgumentException("No days specified", nameof(days));
    }
}
