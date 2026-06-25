export default async function getLocationAPI(location, latitude, longitude) {
    
    let response;
    if (location) {
        response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=20b9cd678614412b85a19bccedeb2db8`)
    } else {
        response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=20b9cd678614412b85a19bccedeb2db8`)
    }
    
    const data = await response.json()
    return data;
}