function getAQILabel(aqi) {
    if (aqi <= 50)  return { label: 'Good',                    color: '#4CAF7D' }
    if (aqi <= 100) return { label: 'Moderate',                color: '#C8D44A' }
    if (aqi <= 150) return { label: 'Unhealthy for Some',      color: '#F5A623' }
    if (aqi <= 200) return { label: 'Unhealthy',               color: '#E84040' }
    if (aqi <= 300) return { label: 'Very Unhealthy',          color: '#9B59B6' }
    return          { label: 'Hazardous',                      color: '#7B241C' }
}

export default function updateAirQuality(aqi, pm25, pm10, ozone) {
    const parsed = isNaN(parseFloat(aqi)) ? 0 : Math.round(parseFloat(aqi))
    const { label, color } = getAQILabel(parsed)

    // AQI number + label
    document.getElementById('aqi-value').textContent = parsed
    document.getElementById('aqi-value').style.color = color
    document.getElementById('aqi-label').textContent = label
    document.getElementById('aqi-label').style.color = color

    // Pollutant readings
    document.getElementById('aqi-pm25').textContent  = isNaN(pm25)  ? '--' : parseFloat(pm25).toFixed(1)
    document.getElementById('aqi-pm10').textContent  = isNaN(pm10)  ? '--' : parseFloat(pm10).toFixed(1)
    document.getElementById('aqi-ozone').textContent = isNaN(ozone) ? '--' : Math.round(parseFloat(ozone))

    // Slider dot position (AQI 0–300+ clamped to 500)
    const MAX = 500
    const pct = Math.min(parsed / MAX, 1) * 100
    document.getElementById('aqi-dot').style.left = `calc(${pct}% - 8px)`
}