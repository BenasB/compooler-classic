using Rides.Data;
using Rides.Data.Entities;

namespace Rides.Api;

public class Mutation
{
    [UseFirstOrDefault]
    [UseProjection]
    public async Task<IQueryable<Ride>> CreateNextRide(int groupId, RideContext context)
    {
        // TODO: Retrieve data from groupmaker
        // Check if user sending the request is the driver
        // Determine the start time

        var newRide = new Ride()
        {
            Passengers =
            [
                new()
                {
                    PassengerId = "user-1-from-group",
                    ParticipationStatus = RideParticipationStatus.Participate,
                }
            ],
            GroupId = groupId,
            StartTime = DateTime.UtcNow, // Data from group
            Status = RideStatus.Upcoming
        };

        await context.Rides.AddAsync(newRide);
        await context.SaveChangesAsync();

        return context.Rides.Where(r => r == newRide);
    }
}
