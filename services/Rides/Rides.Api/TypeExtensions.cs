using HotChocolate.Data.Filters;
using Rides.Data.Entities;

namespace Rides.Api;

public class RideObjectTypeExtension : ObjectTypeExtension<Ride>
{
    protected override void Configure(IObjectTypeDescriptor<Ride> descriptor)
    {
        descriptor
            .Field(ride => ride.StartTime)
            .Description(
                "This datetime will always be represented as UTC+0 but treat it as local (to the group's location) when consuming"
            )
            .Use(next =>
                async context =>
                {
                    await next(context);

                    if (context.Result is DateTime dt)
                    {
                        // Treat all outgoing date times as UTC
                        // because otherwise Hot Chocolate will add the API's timezone
                        context.Result = DateTime.SpecifyKind(dt, DateTimeKind.Utc);
                    }
                }
            );
    }
}
