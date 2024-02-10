using System.Security.Claims;
using GroupMaker.Api.Entities;
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

    public string? GetMe(ClaimsPrincipal principal)
    {
        return principal.Identity?.Name;
    }
}
