export default async function getWeatherAPI(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,pressure_msl,visibility,cloud_cover,precipitation,weather_code&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,uv_index&daily=sunrise,sunset,temperature_2m_min,temperature_2m_max,weather_code&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}