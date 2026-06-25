export default async function getLocationListAPI(location) {
    // const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(location)}&limit=5&apiKey=20b9cd678614412b85a19bccedeb2db8`)
    const data = await response.json()
    return data;
}