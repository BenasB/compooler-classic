using GroupMaker.Api;
using GroupMaker.Data.Entities;

namespace GroupMaker.Data;

public static class Seeder
{
    public static async Task SeedAsync(GroupContext context)
    {
        await context.Groups.AddRangeAsync(
            new Group()
            {
                Id = 0,
                Days = DaysOfWeek.Monday | DaysOfWeek.Tuesday | DaysOfWeek.Friday,
                StartLocation = new()
                {
                    Latitude = 54.735040279783384,
                    Longitude = 25.216762707508387
                },
                EndLocation = new()
                {
                    Latitude = 54.70433069564355,
                    Longitude = 25.272272176425833
                },
                StartTime = new TimeOnly(8, 45),
                TotalSeats = 4
            },
            new Group()
            {
                Id = 1,
                Days = DaysOfWeek.Saturday | DaysOfWeek.Sunday,
                StartLocation = new()
                {
                    Latitude = 54.723054587247866,
                    Longitude = 25.34404337944772
                },
                EndLocation = new()
                {
                    Latitude = 54.68655898985771,
                    Longitude = 25.283379334720742
                },
                StartTime = new TimeOnly(7, 15),
                TotalSeats = 3
            }
        );

        await context.SaveChangesAsync();
    }
}
