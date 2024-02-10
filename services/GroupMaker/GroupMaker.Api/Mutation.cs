using GroupMaker.Api.Entities;
using GroupMaker.Data;

namespace GroupMaker.Api;

public class Mutation
{
    public async Task<Group> CreateGroup(
        TimeOnly startTime,
        DaysOfWeek days,
        Coordinates startLocation,
        Coordinates endLocation,
        int totalSeats,
        GroupContext context
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

        await context.Groups.AddAsync(group);
        await context.SaveChangesAsync();

        return group;
    }
}
