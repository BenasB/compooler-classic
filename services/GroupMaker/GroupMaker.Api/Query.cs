using GroupMaker.Api.Entities;

namespace GroupMaker.Api;

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
}
