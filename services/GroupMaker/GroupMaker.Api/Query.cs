using GroupMaker.Api.Entities;

namespace GroupMaker.Api;

public class Query
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Book> GetBooks(GroupContext groupContext) => groupContext.Books;
}
