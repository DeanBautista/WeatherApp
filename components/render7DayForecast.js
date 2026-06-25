import cloudConditionChecker from "../utils/cloudConditionChecker.js";
import cloudConditionIcons from "../utils/cloudConditionIcons.js";
import covertCelsiusToFarenheit from "../utils/convertCelsiusToFarenheit.js";

function getDayLabel(dateStr, index) {
    if (index === 0) return 'Today'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export default function render7DayForecast(daily, unit) {
    const container = document.querySelector('.seven-day-forecast-list')
    if (!container) return
    container.innerHTML = ''

    // global min/max across all 7 days for bar scaling
    const globalMin = Math.min(...daily.temperature_2m_min)
    const globalMax = Math.max(...daily.temperature_2m_max)
    const globalRange = globalMax - globalMin || 1

    daily.time.forEach((dateStr, i) => {
        if (i >= 7) return

        let tempMin = daily.temperature_2m_min[i]
        let tempMax = daily.temperature_2m_max[i]

        if (unit === 'farenheit') {
            tempMin = (tempMin * 9/5) + 32
            tempMax = (tempMax * 9/5) + 32
        }

        const weatherCode = daily.weather_code[i]
        const condition   = cloudConditionChecker(weatherCode, 0)
        const icon        = cloudConditionIcons(condition)
        const dayLabel    = getDayLabel(dateStr, i)

        // bar: left offset = how far min is from globalMin, width = range of this day
        const rawMin   = daily.temperature_2m_min[i]
        const rawMax   = daily.temperature_2m_max[i]
        const barLeft  = ((rawMin - globalMin) / globalRange) * 100
        const barWidth = ((rawMax - rawMin)    / globalRange) * 100

        const row = document.createElement('div')
        row.className = 'forecast-row'
        row.innerHTML = `
            <span class="forecast-day">${dayLabel}</span>
            <span class="forecast-icon-daily">${icon}</span>
            <span class="forecast-min">${Math.round(tempMin)}°</span>
            <div class="forecast-bar-track">
                <div class="forecast-bar" style="margin-left:${barLeft}%; width:${barWidth}%"></div>
            </div>
            <span class="forecast-max">${Math.round(tempMax)}°</span>
        `
        container.appendChild(row)
    })
}