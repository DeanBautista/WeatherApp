export default async function getAirQualityAPI(latitude, longitude) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm2_5,pm10,ozone,us_aqi&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
}