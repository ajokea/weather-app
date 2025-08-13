import "./style.css";
import { getWeatherData, processWeatherData } from "./weatherData";
import getWeatherIcon from "./weatherIcons";

const body = document.body;

function displayErrorMessage () {
    let backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    
    let popup = document.createElement('div');
    popup.className = 'error';

    let pError = document.createElement('p');
    pError.textContent = 'Please enter a valid location.';

    let cancelButton = document.createElement('button');
    cancelButton.textContent = "X";
    cancelButton.addEventListener('click', () => {
        body.removeChild(popup);
        body.removeChild(backdrop);
    })

    popup.append(cancelButton, pError);
    body.append(backdrop, popup);
}

async function newSearch (location) {
    try {
        let result = await getWeatherData(location);
        displayWeather(result.address, [result.weatherDataF, result.weatherDataC]);
    } catch (error) {
        displayErrorMessage(error);
    }
}

const searchForm = document.createElement('form');
const searchInput = document.createElement('input');
searchInput.type = "search";
searchInput.placeholder = "Enter an address, a US zip code, or coordinates...";
const searchButton = document.createElement('button');
searchButton.type = "submit"
searchButton.textContent = "SEARCH!"
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    newSearch(searchInput.value);
});
searchForm.append(searchInput, searchButton);
body.appendChild(searchForm);

let weatherDiv = document.createElement('div');
weatherDiv.className = "weather-div";

let footer = document.createElement('footer');

function displayWeather (address, weatherData) {
    let weather = processWeatherData(...weatherData);
    let currentWeather = weather[0];

    let displayedWeather = currentWeather;

    let units = 'US';
    
    function refreshDisplay() {
        weatherDiv.innerHTML = '';
        footer.innerHTML = '';

        const iconCredits = [];

        let statsDiv = document.createElement('div');
        statsDiv.className = "stats-div"
        let displayedWeatherIcon = document.createElement('img');
        let iconImg = getWeatherIcon(displayedWeather.conditions.toLowerCase());
        displayedWeatherIcon.src = iconImg.img;
        if (!iconCredits.includes(iconImg.creditInfo)) {
            iconCredits.push(iconImg.creditInfo);
        }
        let displayedTempDiv = document.createElement('div');
        displayedTempDiv.className = "displayedTemp-div";
        let displayedTemp = document.createElement('h1');
        displayedTemp.textContent = displayedWeather === currentWeather ? displayedWeather.temp[units === 'US' ? 0 : 1] : displayedWeather.maxTemp[units === 'US' ? 0 : 1];
        let unitButtons = document.createElement('div');
        let fahrenheit = document.createElement('button');
        fahrenheit.textContent = `\u00B0F`;
        fahrenheit.style.fontWeight = units === 'US' ? 'bold' : 'normal';
        fahrenheit.style.color = units === 'US' ? 'white' : '';
        fahrenheit.addEventListener('click', () => {
            if (units !== 'US') {
                units = 'US';
                refreshDisplay();
            }
        });
        let celsius = document.createElement('button');
        celsius.textContent = `\u00B0C`;
        celsius.style.fontWeight = units === 'metric' ? 'bold' : 'normal';
        celsius.style.color = units === 'metric' ? 'white' : '';
        celsius.addEventListener('click', () => {
            if (units !== 'metric') {
                units = 'metric';
                refreshDisplay();
            }
        });
        unitButtons.append(fahrenheit, celsius);
        displayedTempDiv.append(displayedTemp, unitButtons);
        let stats = document.createElement('div');
        let displayedPrecip = document.createElement('p');
        displayedPrecip.textContent = `Precipitation: ${displayedWeather.precip}%`;
        let displayedHumid = document.createElement('p');
        displayedHumid.textContent = `Humidity: ${displayedWeather.humidity}%`
        let displayedWind = document.createElement('p');
        displayedWind.textContent = `Wind: ${displayedWeather.wind[units === 'US' ? 0 : 1]} ${units === 'US' ? 'mph' : 'km/h'}`;
        stats.append(displayedPrecip, displayedHumid, displayedWind);
        statsDiv.append(displayedWeatherIcon, displayedTempDiv, stats)

        let locationDiv = document.createElement('div');
        locationDiv.className = "location-div";
        let location = document.createElement('h2');
        location.textContent = address;
        let today = document.createElement('p');
        today.textContent = `${displayedWeather.day} ${displayedWeather === currentWeather ? currentWeather.time[units === 'US' ? 0 : 1] : ''}`;
        let conditions = document.createElement('p');
        conditions.textContent = displayedWeather.conditions;
        locationDiv.append(location, today, conditions);

        let displayedWeatherDiv = document.createElement('div');
        displayedWeatherDiv.className = 'displayedWeather-div';
        displayedWeatherDiv.append(statsDiv, locationDiv);

        let alertsDiv = document.createElement('div');
        if ('alerts' in displayedWeather) {
            displayedWeather.alerts[units === 'US' ? 0 : 1].forEach((value) => {
                let alert = document.createElement('h5');
                alert.textContent = `\u26A0 ${value}`;
                alert.style.color = 'white';
                alertsDiv.appendChild(alert);
            })
        }

        let hourlyWeatherDiv = document.createElement('div');
        hourlyWeatherDiv.className = "hourlyWeather-div";

        let hourlyWeatherButtons = document.createElement('div');
        let hourlyTempButton = document.createElement('button');
        hourlyTempButton.textContent = 'Temperature';
        hourlyTempButton.style.fontWeight = 'bold';
        let hourlyPrecipButton = document.createElement('button');
        hourlyPrecipButton.textContent = 'Precipitation';
        let hourlyWindButton = document.createElement('button');
        hourlyWindButton.textContent = 'Wind';
        hourlyWeatherButtons.append(hourlyTempButton, hourlyPrecipButton, hourlyWindButton);

        let hours = document.createElement('div');
        hours.className = 'hours-div';
        let hourlyTemp = [];
        let hourlyPrecip = [];
        let hourlyWind = [];
        displayedWeather.hours[units === 'US' ? 0 : 1].forEach((value, index) => {
            let hourDiv = document.createElement('div');
            let temp = document.createElement('p');
            temp.textContent = `${value['temp']}\u00B0`;
            hourlyTemp.push(temp);
            let precip = document.createElement('p');
            precip.textContent = `${value['precip']}%`;
            hourlyPrecip.push(precip);
            let wind = document.createElement('p');
            wind.textContent = `${value['wind']} ${units === 'US' ? 'mph' : 'km/h'}`;
            hourlyWind.push(wind);
            let hour = document.createElement('p');
            if (units === 'US') {
                if (index === 0) {
                    hour.textContent = '12 AM';
                } else if (index === 12) {
                    hour.textContent = '12 PM';
                } else if (index < 12) {
                    hour.textContent = `${index} AM`
                } else {
                    hour.textContent = `${index % 12} PM`
                }
            } else {
                hour.textContent = `${index}:00`;
            }
            hourDiv.append(temp, hour);
            hours.appendChild(hourDiv);
        });
        hourlyTempButton.addEventListener('click', () => {
            if (!hourlyTemp.includes(hours.firstChild.firstChild)) {
                hours.childNodes.forEach((hour, index) => {
                    hour.firstChild.remove();
                    hour.prepend(hourlyTemp[index])
                });
                hourlyWeatherDiv.firstChild.childNodes.forEach(btn => btn.style.fontWeight = 'normal');
                hourlyTempButton.style.fontWeight = 'bold';
            }
        });
        hourlyPrecipButton.addEventListener('click', () => {
            if (!hourlyPrecip.includes(hours.firstChild.firstChild)) {
                hours.childNodes.forEach((hour, index) => {
                    hour.firstChild.remove();
                    hour.prepend(hourlyPrecip[index])
                });
                hourlyWeatherDiv.firstChild.childNodes.forEach(btn => btn.style.fontWeight = 'normal');
                hourlyPrecipButton.style.fontWeight = 'bold';
            }
        });
        hourlyWindButton.addEventListener('click', () => {
            if (!hourlyWind.includes(hours.firstChild.firstChild)) {
                hours.childNodes.forEach((hour, index) => {
                    hour.firstChild.remove();
                    hour.prepend(hourlyWind[index])
                });
                hourlyWeatherDiv.firstChild.childNodes.forEach(btn => btn.style.fontWeight = 'normal');
                hourlyWindButton.style.fontWeight = 'bold';
            }
        });
        hourlyWeatherDiv.append(hourlyWeatherButtons, hours);

        let laterWeatherDiv = document.createElement('div');
        laterWeatherDiv.className = "laterWeather-div";
        weather.forEach(day => {
            let dayDiv = document.createElement('div');
            let weekday = document.createElement('h3');
            weekday.textContent = day.day.substring(0, 3);
            let icon = document.createElement('img');
            let iconImg = getWeatherIcon(day.conditions.toLowerCase());
            icon.src = getWeatherIcon(day.conditions.toLowerCase()).img;
            if (!iconCredits.includes(iconImg.creditInfo)) {
                iconCredits.push(iconImg.creditInfo);
            }
            let tempDiv = document.createElement('div');
            let maxTemp = document.createElement('p');
            maxTemp.textContent = `${day.maxTemp[units === 'US' ? 0 : 1]}\u00B0`;
            let minTemp = document.createElement('p');
            minTemp.textContent = `${day.minTemp[units === 'US' ? 0 : 1]}\u00B0`;
            tempDiv.append(maxTemp, minTemp);
            dayDiv.append(weekday, icon, tempDiv);
            if (day === displayedWeather) {
                dayDiv.className = 'displayedWeather';
            }
            dayDiv.addEventListener('click', () => {
                if (displayedWeather !== day) {
                    displayedWeather = day;
                    refreshDisplay();
                }
            })
            laterWeatherDiv.appendChild(dayDiv);
        });

        weatherDiv.append(displayedWeatherDiv, alertsDiv, hourlyWeatherDiv, laterWeatherDiv);
        body.appendChild(weatherDiv);
        
        iconCredits.forEach((credit) => {
            footer.innerHTML += credit;
        })
        body.appendChild(footer);
    }
    refreshDisplay();
}

getWeatherData('atlanta, georgia').then((result) => {
    displayWeather(result.address, [result.weatherDataF, result.weatherDataC])
}).catch((error) => console.error(error));