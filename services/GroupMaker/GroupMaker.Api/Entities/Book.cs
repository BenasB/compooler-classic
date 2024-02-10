namespace GroupMaker.Api.Entities;

public class Book
{
    public required string Title { get; init; }

    public required Author Author { get; init; }
}

public class Author
{
    public int Id { get; set; }
    public required string Name { get; init; }
}
