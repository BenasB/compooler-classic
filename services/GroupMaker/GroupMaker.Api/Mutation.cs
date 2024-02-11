using GroupMaker.Data;
using GroupMaker.Data.Entities;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace GroupMaker.Api;

[Authorize]
public class Mutation
{
    public async Task<Group> CreateGroup(
        TimeOnly startTime,
        DaysOfWeek days,
        Coordinates startLocation,
        Coordinates endLocation,
        int totalSeats,
        GroupContext context,
        CancellationToken cancellationToken
    )
    {
        var group = new Group()
        {
            StartTime = startTime,
            Days = days,
            StartLocation = startLocation,
            EndLocation = endLocation,
            TotalSeats = totalSeats,
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
