using Microsoft.EntityFrameworkCore;
using Rides.Data.Entities;

namespace Rides.Data;

public class RideContext(DbContextOptions<RideContext> context) : DbContext(context)
{
    public DbSet<Ride> Rides { get; set; }
    public DbSet<RidePassenger> Passengers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        var groupEntity = builder.Entity<Ride>();
        groupEntity.HasKey(ride => ride.Id);
        groupEntity.HasMany(ride => ride.Passengers).WithOne(passenger => passenger.Ride);

        var userEntity = builder.Entity<RidePassenger>();
        userEntity.HasKey(passenger => passenger.Id);
    }
}
