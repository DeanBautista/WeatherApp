export default function cloudConditionChecker(weathercode, cloudCover) {

    // Rain / drizzle / thunder
    if (
        (weathercode >= 51 && weathercode <= 67) || 
        (weathercode >= 80 && weathercode <= 99)
    ) return "Rainy";

    // Clear sky
    if (weathercode === 0) return "Sunny";

    if (cloudCover <= 20) return "Sunny";
    if (cloudCover <= 50) return "Partly cloudy";
    if (cloudCover <= 80) return "Mostly cloudy";

    return "Overcast";
}