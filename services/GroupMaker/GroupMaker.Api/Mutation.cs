using System.Security.Authentication;
using System.Security.Claims;
using GroupMaker.Data;
using GroupMaker.Data.Entities;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace GroupMaker.Api;

[Authorize]
public class Mutation
{
    [Error<AuthenticationException>]
    public async Task<Group> CreateGroup(
        TimeOnly startTime,
        DaysOfWeek days,
        Coordinates startLocation,
        Coordinates endLocation,
        int totalSeats,
        GroupContext context,
        ClaimsPrincipal claimsPrincipal,
        CancellationToken cancellationToken
    )
    {
        var driverId =
            claimsPrincipal.Identity?.Name
            ?? throw new AuthenticationException("Failed to determine the current user's name");

        var driverUser = await context.Users.FirstOrDefaultAsync(
            u => u.Id == driverId,
            cancellationToken: cancellationToken
        );

        if (driverUser == null)
        {
            driverUser = new User { Id = driverId };
            await context.Users.AddAsync(driverUser, cancellationToken);
        }

        var group = new Group()
        {
            StartTime = startTime,
            Days = days,
            StartLocation = startLocation,
            EndLocation = endLocation,
            TotalSeats = totalSeats,
            Driver = driverUser
        };

        await context.Groups.AddAsync(group, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return group;
    }

    [Error<ArgumentException>]
    public async Task<Group?> DeleteGroup(
        int id,
        GroupContext context,
        CancellationToken cancellationToken
    )
    {
        var group =
            await context.Groups.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new ArgumentException("Group does not exist", nameof(id));

        context.Groups.Remove(group);
        await context.SaveChangesAsync(cancellationToken);

        return group;
    }
}
