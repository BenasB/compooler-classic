using HotChocolate.Authorization;
using Rides.Data;
using Rides.Data.Entities;

namespace Rides.Api;

[Authorize]
public class Query
{
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Ride> GetRides(RideContext rideContext) => rideContext.Rides;

    [UseFirstOrDefault]
    [UseProjection]
    public IQueryable<Ride> GetRideById(int id, RideContext rideContext) =>
        rideContext.Rides.Where(r => r.Id == id);

    [UseProjection]
    public IQueryable<Ride> GetRidesById(IEnumerable<int> ids, RideContext rideContext) =>
        rideContext.Rides.Where(r => ids.Contains(r.Id));
}
