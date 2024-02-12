using GroupMaker.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GroupMaker.Api;

public class GroupContext(DbContextOptions<GroupContext> context) : DbContext(context)
{
    public DbSet<Group> Groups { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        var groupEntity = builder.Entity<Group>();
        groupEntity.HasKey(group => group.Id);
        groupEntity.OwnsOne(x => x.StartLocation);
        groupEntity.OwnsOne(x => x.EndLocation);
        groupEntity.HasOne(x => x.Driver).WithMany(x => x.Driving);
        groupEntity.HasMany(x => x.Passengers).WithMany(x => x.Passengering);

        var userEntity = builder.Entity<User>();
        userEntity.HasKey(user => user.Id);
    }
}
