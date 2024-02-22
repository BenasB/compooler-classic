using Microsoft.EntityFrameworkCore;
using Rides.Data.Entities;

namespace Rides.Data;

public class RideContext(DbContextOptions<RideContext> context) : DbContext(context)
{
    public DbSet<Ride> Rides { get; set; }
    public DbSet<RidePassenger> Passengers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        var rideEntity = builder.Entity<Ride>();
        rideEntity.Property(ride => ride.StartTime).HasColumnType("timestamp without time zone");
        rideEntity.HasKey(ride => ride.Id);
        rideEntity.HasMany(ride => ride.Passengers).WithOne();
        rideEntity.HasIndex(ride => new { ride.GroupId, ride.StartTime }).IsUnique();

        var passengerEntity = builder.Entity<RidePassenger>();
        passengerEntity.HasKey(passenger => passenger.Id);
    }
}
