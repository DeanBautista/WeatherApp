import cloudConditionIcons from "../utils/cloudConditionIcons.js"
import cloudConditionChecker from "../utils/cloudConditionChecker.js"
import precipitationToChanceOfRain from "../utils/precipitationToChanceOfRain.js"
import convertCelsiusToFahrenheit from "../utils/convertCelsiusToFarenheit.js"

const hourlyForecastCards = document.querySelector('.forecast-cards')

export default function hourlyForecastCard(hourlyData, index, indexTime, currentTemp, unit) {

    const weatherData = hourlyData

    const divContainer = document.createElement('div')
    const foreCastTimeSpan = document.createElement('span')
    const forecastIcon = document.createElement('span')
    const forecastTemperature = document.createElement('span')
    const forecastChanceOfRain = document.createElement('span')

    forecastIcon.textContent = cloudConditionIcons(
        cloudConditionChecker(hourlyData.weather_code[index], hourlyData.cloud_cover[index])
    )
    forecastIcon.classList.add('forecast-icon')


    if (index === indexTime) {
        foreCastTimeSpan.textContent = "Now"

        if (unit === 'farenheit') {
            forecastTemperature.textContent = convertCelsiusToFahrenheit(currentTemp, unit).toFixed(0) + "°"
        } else {
            forecastTemperature.textContent = currentTemp.toFixed(0) + "°"
        }
        
    } else {
        if (unit === 'farenheit') {
            forecastTemperature.textContent = convertCelsiusToFahrenheit(hourlyData.temperature_2m[index], unit).toFixed(0) + "°"
        } else {
            forecastTemperature.textContent = hourlyData.temperature_2m[index].toFixed(0) + "°"
        }
        
        foreCastTimeSpan.textContent = weatherData.time[index].split("T")[1].slice(0, 2)
    }

    foreCastTimeSpan.classList.add('forecast-time')
    
    forecastTemperature.classList.add('forecast-temperature')

    forecastChanceOfRain.textContent = precipitationToChanceOfRain(hourlyData.precipitation[index]) + "%"
    forecastChanceOfRain.classList.add('forecast-chance-of-rain')

    divContainer.appendChild(foreCastTimeSpan)
    divContainer.appendChild(forecastIcon)
    divContainer.appendChild(forecastTemperature)
    divContainer.appendChild(forecastChanceOfRain)

    hourlyForecastCards.appendChild(divContainer)
}