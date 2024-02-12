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
    [UseFirstOrDefault]
    [UseProjection]
    [Error<AuthenticationException>]
    public async Task<IQueryable<Group>> CreateGroup(
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
            cancellationToken
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

        return context.Groups.Where(x => x == group);
    }

    [Error<AuthenticationException>]
    [Error<ArgumentException>]
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> DeleteGroup(
        int id,
        GroupContext context,
        ClaimsPrincipal claimsPrincipal,
        CancellationToken cancellationToken
    )
    {
        var userId =
            claimsPrincipal.Identity?.Name
            ?? throw new AuthenticationException("Failed to determine the current user's name");

        var user =
            await context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new ArgumentException("User does not exist");

        var group =
            await context.Groups.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new ArgumentException("Group does not exist", nameof(id));

        if (group.Driver != user)
            throw new ArgumentException("User is not the driver");

        context.Groups.Remove(group);
        await context.SaveChangesAsync(cancellationToken);

        return group.Id;
    }

    [UseFirstOrDefault]
    [UseProjection]
    [Error<AuthenticationException>]
    [Error<ArgumentException>]
    public async Task<IQueryable<Group>> JoinGroup(
        int id,
        GroupContext context,
        ClaimsPrincipal claimsPrincipal,
        CancellationToken cancellationToken
    )
    {
        var userId =
            claimsPrincipal.Identity?.Name
            ?? throw new AuthenticationException("Failed to determine the current user's name");

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            user = new User { Id = userId };
            await context.Users.AddAsync(user, cancellationToken);
        }

        var group =
            await context
                .Groups.Include(group => group.Driver)
                .Include(group => group.Passengers)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new ArgumentException("Group does not exist", nameof(id));

        if (user == group.Driver)
            throw new ArgumentException("User is the driver");

        if (group.Passengers.Any(passenger => passenger == user))
            throw new ArgumentException("User is already one of the passengers");

        if (group.Passengers.Count + 1 > group.TotalSeats)
            throw new ArgumentException("There are no more seats left");

        group.Passengers.Add(user);
        await context.SaveChangesAsync(cancellationToken);

        return context.Groups.Where(x => x.Id == id);
    }

    [UseFirstOrDefault]
    [UseProjection]
    [Error<AuthenticationException>]
    [Error<ArgumentException>]
    public async Task<IQueryable<Group>> AbandonGroup(
        int id,
        GroupContext context,
        ClaimsPrincipal claimsPrincipal,
        CancellationToken cancellationToken
    )
    {
        var userId =
            claimsPrincipal.Identity?.Name
            ?? throw new AuthenticationException("Failed to determine the current user's name");

        var user =
            await context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new ArgumentException("User does not exist");

        var group =
            await context
                .Groups.Include(group => group.Driver)
                .Include(group => group.Passengers)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new ArgumentException("Group does not exist", nameof(id));

        if (user == group.Driver)
            throw new ArgumentException("User is the driver");

        if (!group.Passengers.Any(passenger => passenger == user))
            throw new ArgumentException("User is not one of the passengers");

        group.Passengers.Remove(user);
        await context.SaveChangesAsync(cancellationToken);

        return context.Groups.Where(x => x.Id == id);
    }
}
