const WEATHER_API_KEY = 'PSMLFGRWQW9GDZ6Z5ZHMKZYCR';
const WEATHER_API_BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

async function getWeather(location) {
    try {
        const responseF = await fetch(`${WEATHER_API_BASE_URL}${location}?key=${WEATHER_API_KEY}`);
        const weatherDataF = await responseF.json();
        const responseC = await fetch(`${WEATHER_API_BASE_URL}${location}?key=${WEATHER_API_KEY}&unitgroup=metric`);
        const weatherDataC = await responseC.json();
        const address = weatherDataF['resolvedAddress'];
        //console.log(weatherDataF, weatherDataC);
        return { address, weatherDataF, weatherDataC }
    } catch (error) {
        console.error(error);
    }
}

function getWeatherToday (weatherDataF, weatherDataC) {
    try {
        const dataF = weatherDataF.currentConditions;
        const dataC = weatherDataC.currentConditions;
        const today = {
            'conditons': dataF['conditions'],
            'alerts': [
                weatherDataF['alerts'], 
                weatherDataC['alerts']
            ],
            'temp': [
                dataF['temp'], 
                dataC['temp']
            ],
            'humidity': dataF['humidity'],
            'precip': [
                dataF['precip'],
                dataC['precip']
            ],
            'wind': [
                dataF['windspeed'],
                dataC['windspeed']
            ],
            'hours': [
                weatherDataF.days[0]['hours'].map(hour => ({
                    'temp': hour['temp'],
                    'precip': hour['precipprob'],
                    'wind': hour['windspeed']
                })),
                weatherDataC.days[0]['hours'].map(hour => ({
                    'temp': hour['temp'],
                    'precip': hour['precipprob'],
                    'wind': hour['windspeed']
                })),
            ]
        };
        console.log(today)
        return today;
    } catch (error) {
        console.error(error);
    }
}

function getLaterWeather (dataF, dataC) {
    const days = []
    for (let i = 1; i < 7; i++) {
        let dayF = dataF.days[i];
        let dayC = dataC.days[i];
        days.push({
            'conditions': dayF['conditions'],
            'maxTemp': [
                dayF['tempmax'],
                dayC['tempmax']
            ],
            'minTemp': [
                dayF['tempmin'],
                dayC['tempmin']
            ],
            'humidity': dayF['humidity'],
            'precip': [
                dayF['precipprob'],
                dayC['precipprob']
            ],
            'wind': [
                dayF['windspeed'],
                dayC['windspeed']
            ],
            'hours': [
                dayF['hours'].map(hour => ({
                    'temp': hour['temp'],
                    'precip': hour['precipprob'],
                    'wind': hour['windspeed']
                })),
                dayC['hours'].map(hour => ({
                    'temp': hour['temp'],
                    'precip': hour['precipprob'],
                    'wind': hour['windspeed']
                }))
            ]
        })
    }
    console.log(days)
    return days;
}