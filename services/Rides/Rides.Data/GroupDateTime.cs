using GeoTimeZone;
using TimeZoneConverter;

namespace Rides.Data;

public static class GroupDateTime
{
    /// <summary>
    /// Gets a the group's curent local time based on the timezone of the starting coordinates
    /// </summary>
    public static DateTimeOffset GetGroupCurrentLocalDateTime(double latitude, double longitude)
    {
        var tzIana = TimeZoneLookup.GetTimeZone(latitude, longitude).Result;
        var tzInfo = TZConvert.GetTimeZoneInfo(tzIana);
        return TimeZoneInfo.ConvertTime(DateTimeOffset.Now, tzInfo);
    }

    /// <param name="latest">Group's local time to start searching the next start datetime from</param>
    /// <param name="days">7 bit number, LSB is Monday, MSB is Sunday, e. g. 0111011 means the group is commuting on Mon, Tues, Thur, Fri and Sat</param>
    /// <param name="startTime">Group's local start time</param>
    /// <returns>Group's next commute start time</returns>
    /// <exception cref="ArgumentException"/>
    public static DateTime GetNextStartDateTime(DateTime latest, int days, TimeOnly startTime)
    {
        // Rotate the bits by one position to the left to align with .NET's DayOfWeek
        // X11101Y -> 11101Y0 | 000000X = 11101YX
        int rotatedDays = (days << 1) | (days >> 6);

        for (var i = 0; i < 7; i++)
        {
            // Check the days starting from the latest's day of week
            var day = (DayOfWeek)(((int)latest.DayOfWeek + i) % 7);

            if ((rotatedDays & (1 << (int)day)) == 0)
                continue; // Skip days on which the group does not commute

            int daysToAdd = ((int)day - (int)latest.DayOfWeek + 7) % 7;

            var nextStartDate = latest.AddDays(daysToAdd);
            var nextStartDateTime = new DateTime(
                nextStartDate.Year,
                nextStartDate.Month,
                nextStartDate.Day,
                startTime.Hour,
                startTime.Minute,
                0
            );

            if (daysToAdd == 0)
            {
                // Today's commute time already passed
                if (nextStartDateTime <= latest)
                {
                    var dayAfterLatest = latest.AddDays(1);
                    var dayAfterLatestMidnight = new DateTime(
                        dayAfterLatest.Year,
                        dayAfterLatest.Month,
                        dayAfterLatest.Day,
                        0,
                        0,
                        0
                    );

                    // Calculate the next commute time starting from the next midnight
                    return GetNextStartDateTime(dayAfterLatestMidnight, days, startTime);
                }
                else
                {
                    return nextStartDateTime;
                }
            }

            return nextStartDateTime;
        }

        throw new ArgumentException("No days specified", nameof(days));
    }
}
