using System.Security.Authentication;
using System.Security.Claims;
using GeoTimeZone;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using Rides.Clients;
using Rides.Data;
using Rides.Data.Entities;
using StrawberryShake;
using TimeZoneConverter;

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
            .Cast<DateTime?>()
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        var startTime = latestStartTime.HasValue switch
        {
            false
                => GetNextStartDateTime(
                    GetGroupCurrentLocalDateTime(
                        group.StartLocation.Latitude,
                        group.StartLocation.Longitude
                    ),
                    group.Days,
                    group.StartTime
                ),
            true => GetNextStartDateTime(latestStartTime.Value, group.Days, group.StartTime)
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
            startTime = GetNextStartDateTime(startTime, group.Days, group.StartTime);
        }

        await context.Rides.AddRangeAsync(newRides, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return context.Rides.Where(x => newRides.Contains(x));
    }

    private static DateTime GetGroupCurrentLocalDateTime(double latitude, double longitude)
    {
        var tzIana = TimeZoneLookup.GetTimeZone(latitude, longitude).Result;
        var tzInfo = TZConvert.GetTimeZoneInfo(tzIana);
        return TimeZoneInfo.ConvertTime(DateTime.UtcNow, TimeZoneInfo.Utc, tzInfo);
    }

    private static DateTime GetNextStartDateTime(
        DateTime latest, // Calculations assumed to be done in the group's local time
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
            var nextStartDateTime = new DateTime(
                nextStartDate.Year,
                nextStartDate.Month,
                nextStartDate.Day,
                startTime.Hours,
                startTime.Minutes,
                0
            );

            if (daysToAdd == 0)
            {
                // Today's commute time already passed
                if (nextStartDateTime <= latest)
                {
                    var dayAfterLatest = latest.AddDays(1);
                    var dayAfterLatestMidnight = new DateTime(
                        dayAfterLatest.Year,
                        dayAfterLatest.Month,
                        dayAfterLatest.Day,
                        0,
                        0,
                        0
                    );

                    // Calculate the next commute time starting from the next midnight
                    return GetNextStartDateTime(dayAfterLatestMidnight, days, startTime);
                }
                else
                {
                    return nextStartDateTime;
                }
            }

            return nextStartDateTime;
        }

        throw new ArgumentException("No days specified", nameof(days));
    }
}
