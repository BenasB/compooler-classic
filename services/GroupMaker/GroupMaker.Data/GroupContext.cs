using GroupMaker.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GroupMaker.Api;

public class GroupContext(DbContextOptions<GroupContext> context) : DbContext(context)
{
    public DbSet<Group> Groups { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        var groupEntity = builder.Entity<Group>();

        groupEntity.HasKey(group => group.Id);
        groupEntity.OwnsOne(x => x.StartLocation);
        groupEntity.OwnsOne(x => x.EndLocation);
    }
}
