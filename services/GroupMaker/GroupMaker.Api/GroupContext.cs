using GroupMaker.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GroupMaker.Api;

public class GroupContext(DbContextOptions<GroupContext> context) : DbContext(context)
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Book>().HasKey(book => book.Title);
    }
}
