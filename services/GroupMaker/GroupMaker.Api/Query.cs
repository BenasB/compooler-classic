using GroupMaker.Api.Entities;

namespace GroupMaker.Api;

public class Query
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Group> GetGroups(GroupContext groupContext) => groupContext.Groups;

    [UseProjection]
    public Group? GetGroupById(int id, GroupContext groupContext) =>
        groupContext.Groups.FirstOrDefault(g => g.Id == id);
}
