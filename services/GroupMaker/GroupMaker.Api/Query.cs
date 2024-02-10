using GroupMaker.Api.Entities;

namespace GroupMaker.Api;

public class Query
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Group> GetGroups(GroupContext groupContext) => groupContext.Groups;
}
