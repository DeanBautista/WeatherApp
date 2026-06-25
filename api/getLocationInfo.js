export default async function getLocationInfo(location, latitude, longitude) {

    let response;
    if (location !== undefined) {
        response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=20b9cd678614412b85a19bccedeb2db8`)
    } else {
        response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=20b9cd678614412b85a19bccedeb2db8`)
    }
    
    const data = await response.json()
    console.log('data from getLocationInfo.js: ', data)
    const properties = data.features[0].properties;

    return {
        latitude: properties.lat,
        longitude: properties.lon,
        city: properties.city,
        state: properties.state,
        country: properties.country,
        formatted: properties.formatted,
    };
}