using GroupMaker.Api.Entities;

namespace GroupMaker.Api;

public class Query
{
    public Book GetBook() =>
        new()
        {
            Title = "C# in depth.",
            Author = new Author
            {
                Name = "Jon Skeet"
            }
        };
}

