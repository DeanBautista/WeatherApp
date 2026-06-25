    import getWeatherAPI from "../api/getWeatherAPI.js";
    import getLocationInfo from "../api/getLocationInfo.js";
    import getLocationListAPI from "../api/getLocationListAPI.js";
    import getLocationAPI from "../api/getLocationAPI.js";
    import cloudConditionChecker from "../utils/cloudConditionChecker.js";
    import cloudConditionIcons from "../utils/cloudConditionIcons.js";
    import hourlyForecastCard from "../components/hourlyForecastCard.js";
    import formatLocationName from "../utils/formatLocationName.js";
    import covertCelsiusToFarenheit from "../utils/convertCelsiusToFarenheit.js";
    import updateUVGauge from "../components/updateUvGauge.js";
    import updateSunTracker from "../components/updateSunTracker.js";
    import getAirQualityAPI from "../api/getAirQualityAPI.js";
    import updateAirQuality from "../components/updateAirQuality.js";
    import render7DayForecast from "../components/render7DayForecast.js";

    // header
    const searchInput = document.querySelector('.searchInput');
    const searchBtn = document.querySelector('#search-btn');
    const searchResults = document.querySelector('.search-result')

    const unitToggleInline = document.querySelector('.unitToggleInline')
    const unitToggle = document.querySelector('.unitToggle')

    // main
    const location1 = document.querySelector('.weather-location > span:nth-of-type(2)')
    const location2 = document.querySelector('.weather-location > h2')

    const temperatureValue = document.querySelector('.temperature-value')
    const temperatureUnit = document.querySelector('.temperature-unit')

    const weatherIcon = document.querySelector('.weather-icon')
    const cloudConditionName = document.querySelector('.cloud-condition-name')
    const feelsLike = document.querySelector('.feels-like')

    const humidity = document.querySelector('.humidity > .metadata-value')
    const visibility = document.querySelector('.visibility > .metadata-value')
    const windSpeed = document.querySelector('.wind-speed > .metadata-value')
    const pressure = document.querySelector('.pressure > .metadata-value')

    let searchMemo = false;
    const getLocations = []
    const todayTimes = []
    let indexTime = null
    let unit = "celsius"

    const NUMBER_OF_HOURLY_CARD = 24

    let currentArrowSearchIndex = -1;
    let lastIndexOfGetLocations = 0;

    let locations = null;

    let loading = false; 
    let lastDailyData = null

    function handleUnitToggle(e, sourceToggle, otherToggle) {
        const forecastCards = document.querySelectorAll('.forecast-temperature')
        const feelsLikeValue = feelsLike.textContent.split("°")[0]

        if (e.target.classList.contains('celsius') && unit === 'farenheit') {
            unit = "celsius"

            sourceToggle.querySelector('.celsius').classList.add('active')
            sourceToggle.querySelector('.farenheit').classList.remove('active')
            otherToggle.querySelector('.celsius').classList.add('active')
            otherToggle.querySelector('.farenheit').classList.remove('active')

            temperatureValue.textContent = covertCelsiusToFarenheit(temperatureValue.textContent, unit).toFixed(0)
            temperatureUnit.textContent = '°C'
            feelsLike.textContent = "Feels like " + covertCelsiusToFarenheit(
                feelsLikeValue.slice(feelsLikeValue.length - 3), unit
            ).toFixed(0) + "°"
            forecastCards.forEach(item => {
                item.textContent = covertCelsiusToFarenheit(item.textContent.split('°')[0], unit).toFixed(0) + "°"
            })

            if (lastDailyData) render7DayForecast(lastDailyData, unit) // ✅

        } else if (e.target.classList.contains('farenheit') && unit === 'celsius') {
            unit = "farenheit"

            sourceToggle.querySelector('.farenheit').classList.add('active')
            sourceToggle.querySelector('.celsius').classList.remove('active')
            otherToggle.querySelector('.farenheit').classList.add('active')
            otherToggle.querySelector('.celsius').classList.remove('active')

            temperatureValue.textContent = covertCelsiusToFarenheit(temperatureValue.textContent, unit).toFixed(0)
            temperatureUnit.textContent = '°F'
            feelsLike.textContent = "Feels like " + covertCelsiusToFarenheit(
                feelsLikeValue.slice(feelsLikeValue.length - 3), unit
            ).toFixed(0) + "°"
            forecastCards.forEach(item => {
                item.textContent = covertCelsiusToFarenheit(item.textContent.split('°')[0], unit).toFixed(0) + "°"
            })

            if (lastDailyData) render7DayForecast(lastDailyData, unit) // ✅
        }
    }

    unitToggleInline.addEventListener('click', (e) => handleUnitToggle(e, unitToggleInline, unitToggle))
    unitToggle.addEventListener('click',       (e) => handleUnitToggle(e, unitToggle, unitToggleInline))

    document.addEventListener('DOMContentLoaded', async (e) => {

        const currentDate = new Date()
        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const hour = currentDate.getHours()

        const fullDate = year + "-" + String(month).padStart(2, '0') + "-" + String(day).padStart(2, '0')

        getInfoOnPageLoad(fullDate, hour)
    })

    async function searchLocationAndItsWeather(fullDate, hour) {

        let uvIndexVal = 0
        const forecastCardsContaner = document.querySelector('.forecast-cards')
        forecastCardsContaner.innerHTML = ""

        searchResults.style.display = "none"

        const locData = await getLocationInfo(searchInput.value)

        const weatherData = await getWeatherAPI(locData.latitude, locData.longitude)
        console.log('weather data: ', weatherData)

        const locationInfo = await getLocationAPI(searchInput.value)

        const address1Index = formatLocationName(locationInfo.features[0]).indexOf(',')

        const address1 = formatLocationName(locationInfo.features[0]).slice(address1Index + 2)
        const address2 = formatLocationName(locationInfo.features[0]).split(',')[0]      

        // const address1 = locationInfo.features[0].properties.address_line1
        // const address2 = locationInfo.features[0].properties.address_line2

        let temperatureVal = weatherData.current.temperature_2m
        const weatherCode = weatherData.current.weather_code
        const cloudCover = weatherData.current.cloud_cover

        const feelsLikeVal = weatherData.current.apparent_temperature

        // 
        const cloudCondition = cloudConditionChecker(weatherCode, cloudCover)

        // hero first section
        location1.textContent = address1
        location2.textContent = address2

        if (unit === "farenheit") {
            temperatureValue.textContent = covertCelsiusToFarenheit(temperatureVal, unit).toFixed(0)
            feelsLike.textContent = "Feels like " + covertCelsiusToFarenheit(feelsLikeVal, unit).toFixed(0) + "°"
        } else {
            temperatureValue.textContent = temperatureVal.toFixed(0)
            feelsLike.textContent = "Feels like " + feelsLikeVal.toFixed(0) + "°"
        }
        
        cloudConditionName.textContent = cloudCondition
        weatherIcon.textContent = cloudConditionIcons(cloudCondition)

        // hero second section
        humidity.textContent = weatherData.current.relative_humidity_2m + "%"
        visibility.textContent = weatherData.current.visibility + " km"
        windSpeed.textContent = weatherData.current.wind_speed_10m + " km/h"
        pressure.textContent = weatherData.current.pressure_msl + " hPa"

        console.log('getLocationAPI: ', await getLocationAPI(searchInput.value))

        // weatherData.hourly.time.forEach((item, index) => {
        //     const getHour = item.split("T")[1].slice(0, 2)
        //     if (item.startsWith(fullDate) && String(hour).padStart(2, '0') === getHour) {
        //         indexTime = index;
        //         break;
        //     }
        // })

        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            const getHour = weatherData.hourly.time[i].split("T")[1].slice(0, 2)

            if (weatherData.hourly.time[i].startsWith(fullDate) && String(hour).padStart(2, '0') === getHour) {
                indexTime = i;
                break;
            }
        }

        for (let i = indexTime; i < indexTime + NUMBER_OF_HOURLY_CARD; i++) {
            hourlyForecastCard(weatherData.hourly, i, indexTime, temperatureVal, unit)
        }

        uvIndexVal = weatherData.hourly.uv_index[0]
        updateUVGauge(uvIndexVal)

        const sunriseISO = weatherData.daily.sunrise[0]
        const sunsetISO  = weatherData.daily.sunset[0]
        updateSunTracker(sunriseISO, sunsetISO)

        // grab lat/lon — in searchLocationAndItsWeather use locData, in getInfoOnPageLoad use currentData
        const airData = await getAirQualityAPI(locData.latitude, locData.longitude)
        const airIndex = airData.hourly.us_aqi[indexTime]
        const airPM25  = airData.hourly.pm2_5[indexTime]
        const airPM10  = airData.hourly.pm10[indexTime]
        const airOzone = airData.hourly.ozone[indexTime]

        console.log('air data: ', airData)
        updateAirQuality(airIndex, airPM25, airPM10, airOzone)

        lastDailyData = weatherData.daily
        render7DayForecast(weatherData.daily, unit)
        console.log('time index: ', indexTime)
        console.log('all time today: ', todayTimes)
    }

    async function getInfoOnPageLoad(fullDate, hour) {

        const currentData = await fetch("https://ipapi.co/json/").then(r => r.json());

        const weatherData = await getWeatherAPI(currentData.latitude, currentData.longitude)
        console.log('weather data: ', weatherData)

        const locationInfo = await getLocationAPI(null, currentData.latitude, currentData.longitude)
        console.log('latitude info in getInfoOnPageLoad: ', currentData.latitude)
        console.log('longitude info in getInfoOnPageLoad: ', currentData.longitude)
        console.log('location info in getInfoOnPageLoad: ', locationInfo)

        const address1Index = formatLocationName(locationInfo.features[0]).indexOf(',')

        const address1 = formatLocationName(locationInfo.features[0]).slice(address1Index + 2)
        const address2 = formatLocationName(locationInfo.features[0]).split(',')[0]      

        let temperatureVal = weatherData.current.temperature_2m
        const weatherCode = weatherData.current.weather_code
        const cloudCover = weatherData.current.cloud_cover

        const feelsLikeVal = weatherData.current.apparent_temperature

        // 
        const cloudCondition = cloudConditionChecker(weatherCode, cloudCover)

        // hero first section
        location1.textContent = address1
        location2.textContent = address2

        if (unit === "farenheit") {
            temperatureValue.textContent = covertCelsiusToFarenheit(temperatureVal, unit).toFixed(0)
            feelsLike.textContent = "Feels like " + covertCelsiusToFarenheit(feelsLikeVal, unit).toFixed(0) + "°"
        } else {
            temperatureValue.textContent = temperatureVal.toFixed(0)
            feelsLike.textContent = "Feels like " + feelsLikeVal.toFixed(0) + "°"
        }

        cloudConditionName.textContent = cloudCondition
        weatherIcon.textContent = cloudConditionIcons(cloudCondition)

        // hero second section
        humidity.textContent = weatherData.current.relative_humidity_2m + "%"
        visibility.textContent = weatherData.current.visibility + " km"
        windSpeed.textContent = weatherData.current.wind_speed_10m + " km/h"
        pressure.textContent = weatherData.current.pressure_msl + " hPa"

        console.log('getLocationAPI: ', await getLocationAPI(null, currentData.latitude, currentData.longitude))

        // weatherData.hourly.time.forEach((item, index) => {
        //     const getHour = item.split("T")[1].slice(0, 2)
        //     if (item.startsWith(fullDate) && String(hour).padStart(2, '0') === getHour) {
        //         indexTime = index;
        //         break;
        //     }
        // })

        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            const getHour = weatherData.hourly.time[i].split("T")[1].slice(0, 2)

            if (weatherData.hourly.time[i].startsWith(fullDate) && String(hour).padStart(2, '0') === getHour) {
                indexTime = i;
                break;
            }
        }

        for (let i = indexTime; i < indexTime + NUMBER_OF_HOURLY_CARD; i++) {
            hourlyForecastCard(weatherData.hourly, i, indexTime, temperatureVal)
        }

        const uvIndexVal = weatherData.hourly.uv_index[0]
        updateUVGauge(uvIndexVal)

        console.log('time index: ', indexTime)
        console.log('all time today: ', todayTimes)

        const sunriseISO = weatherData.daily.sunrise[0]
        const sunsetISO  = weatherData.daily.sunset[0]
        updateSunTracker(sunriseISO, sunsetISO)

        // grab lat/lon — in searchLocationAndItsWeather use locData, in getInfoOnPageLoad use currentData
        const airData = await getAirQualityAPI(currentData.latitude, currentData.longitude)
        const airIndex = airData.hourly.us_aqi[indexTime]
        const airPM25  = airData.hourly.pm2_5[indexTime]
        const airPM10  = airData.hourly.pm10[indexTime]
        const airOzone = airData.hourly.ozone[indexTime]
        updateAirQuality(airIndex, airPM25, airPM10, airOzone)

        lastDailyData = weatherData.daily
        render7DayForecast(weatherData.daily, unit)

        loading = false;
    }

    async function searchLocation() {
        // -----------------------------------------
        // Will be used to compare to ISO Date
        const currentDate = new Date()
        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const hour = currentDate.getHours()

        const fullDate = year + "-" + String(month).padStart(2, '0') + "-" + String(day).padStart(2, '0')
        //---------------------------------------

        await searchLocationAndItsWeather(fullDate, hour)
    
    }

    searchInput.addEventListener('keydown', async (e) => {
        lastIndexOfGetLocations = getLocations.length - 1;
        const searchItemList = searchResults.children
        
        if (e.key === "Enter") {
        await searchLocation()
        }

        if (e.key === "ArrowUp" && getLocations.length > 0) {
            console.log('arrow up')
            if (currentArrowSearchIndex === 0) {
                currentArrowSearchIndex = lastIndexOfGetLocations
                if (currentArrowSearchIndex - 1 !== -1) {
                    searchItemList[0].style.background = "none"
                }
                console.log("current Arrow Search Index: ", currentArrowSearchIndex)
                searchItemList[currentArrowSearchIndex].style.background = "blue"
            } else if (currentArrowSearchIndex === 1) {
                currentArrowSearchIndex--;
                searchItemList[currentArrowSearchIndex + 1].style.background = "none"
                searchItemList[currentArrowSearchIndex].style.background = "blue"
            }
            else {
                currentArrowSearchIndex--;
                if (currentArrowSearchIndex - 1 !== -1) {
                    searchItemList[currentArrowSearchIndex + 1].style.background = "none"
                }
                searchItemList[currentArrowSearchIndex].style.background = "blue"
            }

            searchInput.value = searchItemList[currentArrowSearchIndex].textContent
        }


        if (e.key === "ArrowDown" && getLocations.length > 0) {
            console.log('arrow down')
            if (currentArrowSearchIndex === lastIndexOfGetLocations) {
                searchItemList[lastIndexOfGetLocations].style.background = "none"
                currentArrowSearchIndex = 0
                if (currentArrowSearchIndex - 1 !== -1) {
                    searchItemList[currentArrowSearchIndex - 1].style.background = "none"
                }
                searchItemList[currentArrowSearchIndex].style.background = "blue"
            } else if (currentArrowSearchIndex === -1) {
                currentArrowSearchIndex++;
                searchItemList[currentArrowSearchIndex].style.background = "blue"
            }
            else {
                currentArrowSearchIndex++;
                if (currentArrowSearchIndex !== -1) {
                    searchItemList[currentArrowSearchIndex - 1].style.background = "none"
                }
                searchItemList[currentArrowSearchIndex].style.background = "blue"
            }

            searchInput.value = searchItemList[currentArrowSearchIndex].textContent
        }

    })

    searchInput.addEventListener('input', async (e) => {

        currentArrowSearchIndex = -1

        clearTimeout(searchMemo)
        getLocations.length = 0
        
        const input = e.target.value

        searchMemo = setTimeout( async() => {
            locations = null
            searchResults.innerHTML = ""
        
            locations = await getLocationListAPI(input)
            console.log("locations: ", locations)

            if (locations.length <= 0) return;

            locations.features?.forEach(location => {
                getLocations.push(formatLocationName(location))        
            })

            if (getLocations.length > 0) {

                searchResults.style.display = "flex"

                getLocations.forEach(location => {
                    const liEl = document.createElement('li')
                    liEl.textContent = location
                    searchResults.appendChild(liEl)
                })

            } else {
                searchResults.style.display = "none"

            }

        }, 700)


    })  


    searchBtn.addEventListener('click', async (e) => {

        if (searchInput.value.length > 0) {
            await searchLocation()
        }
    })

    searchResults.addEventListener('click', async (e) => {

        if (e.target.tagName === 'LI') {
            searchInput.value = e.target.textContent
            getLocations.length = 0;
            
            await searchLocation()

            e.stopPropagation();
        }
    })


