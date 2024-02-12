using GroupMaker.Api;
using GroupMaker.Data.Entities;

namespace GroupMaker.Data;

public static class Seeder
{
    public static async Task SeedAsync(GroupContext context)
    {
        var users = new List<User>()
        {
            new() { Id = "fake-seeded-user" },
            new() { Id = "another-fake-seeded-user" }
        };

        await context.Users.AddRangeAsync(users);

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
                TotalSeats = 4,
                Driver = users[0]
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
                TotalSeats = 3,
                Driver = users[1],
                Passengers = { users[0] }
            }
        );

        await context.SaveChangesAsync();
    }
}
