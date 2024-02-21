using Rides.Api.Clients;
using Rides.Data;
using Rides.Data.Entities;
using StrawberryShake;

namespace Rides.Api;

public class Mutation
{
    [UseFirstOrDefault]
    [UseProjection]
    [Error<GraphQLClientException>]
    public async Task<IQueryable<Ride>> CreateNextRide(
        int groupId,
        RideContext context,
        GroupMakerClient groupMakerClient,
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

        // TODO: Check if user sending the request is the driver
        // TODO: Determine the start time

        var newRide = new Ride()
        {
            Passengers = groupInfoResult
                .Data.GroupById.Passengers.Select(groupPassenger => new RidePassenger()
                {
                    ParticipationStatus = RideParticipationStatus.Participate,
                    PassengerId = groupPassenger.Id
                })
                .ToList(),
            GroupId = groupId,
            StartTime = DateTime.UtcNow, // Data from group
            Status = RideStatus.Upcoming
        };

        await context.Rides.AddAsync(newRide, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return context.Rides.Where(r => r == newRide);
    }
}
