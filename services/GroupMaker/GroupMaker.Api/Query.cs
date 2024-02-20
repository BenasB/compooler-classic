using GroupMaker.Data;
using GroupMaker.Data.Entities;
using HotChocolate.Authorization;

namespace GroupMaker.Api;

[Authorize]
public class Query
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Group> GetGroups(GroupContext groupContext) => groupContext.Groups;

    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Group> GetGroupById(int id, GroupContext groupContext) =>
        groupContext.Groups.Where(g => g.Id == id);

    [UseProjection]
    [UseFiltering]
    public IQueryable<Group> GetNearestGroups(
        Coordinates userStartLocation,
        Coordinates userEndLocation,
        GroupContext groupContext
    ) =>
        groupContext
            .Groups.Select(x => new
            {
                Group = x,
                // Calculate distances from where the user prefers to start/end to where the group starts/ends
                // Since these distances will only be used for comparison, they can be kept squared
                // https://stackoverflow.com/a/5548877/13135665
                StartDistanceSquared = Math.Pow(
                    69.1 * (x.StartLocation.Latitude - userStartLocation.Latitude),
                    2
                )
                    + Math.Pow(
                        69.1
                            * (userStartLocation.Longitude - x.StartLocation.Longitude)
                            * Math.Cos(x.StartLocation.Latitude / 57.3),
                        2
                    ),
                EndDistanceSquared = Math.Pow(
                    69.1 * (x.EndLocation.Latitude - userEndLocation.Latitude),
                    2
                )
                    + Math.Pow(
                        69.1
                            * (userEndLocation.Longitude - x.EndLocation.Longitude)
                            * Math.Cos(x.EndLocation.Latitude / 57.3),
                        2
                    )
            })
            // Order by the sum of the overall walking needed for the user
            .OrderBy(x => x.StartDistanceSquared + x.EndDistanceSquared)
            .Select(x => x.Group);
}
