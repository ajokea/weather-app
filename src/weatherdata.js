const WEATHER_API_KEY = 'PSMLFGRWQW9GDZ6Z5ZHMKZYCR';
const WEATHER_API_BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

async function getWeatherData (location) {
    const responseF = await fetch(`${WEATHER_API_BASE_URL}${location}?key=${WEATHER_API_KEY}`, {mode: 'cors'});
    const weatherDataF = await responseF.json();
    const responseC = await fetch(`${WEATHER_API_BASE_URL}${location}?key=${WEATHER_API_KEY}&unitGroup=metric`, {mode: 'cors'});
    const weatherDataC = await responseC.json();
    const address = weatherDataF['resolvedAddress'];
    return { address, weatherDataF, weatherDataC }
}

function processWeatherData (dataF, dataC) {
    const days = []
    for (let i = 0; i <= 7; i++) {
        let dayF = dataF.days[i];
        let dayC = dataC.days[i];

        let day = {
            'day': getDayString((new Date().getDay() + i) % 7),
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
            'precip': dayF['precipprob'],
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
        };
        
        if (i === 0) {
            day = {
                ...day,
                'time': [getTime('US'), getTime('metric')],
                'alerts': [
                    dataF['alerts'].map((alert) => [alert.headline, alert.description]), 
                    dataC['alerts'].map((alert) => [alert.headline, alert.description])
                ],
                'temp': [dataF['currentConditions']['temp'], dataC['currentConditions']['temp']]
            };
            console.log(day.alerts)
        }

        days.push(day);
    }

    return days;
}

function getDayString (day) {
    const daysOfTheWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    return daysOfTheWeek[day];
}

function getTime (units) {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let suffix = ''

    if (units === 'US') {
        if (hours < 12) {
            suffix = 'AM';
        } else {
            hours %= 12;
            suffix = 'PM';
        }

        if (hours === 0) hours = 12;
    }

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${suffix}`.trim();
}

export { getWeatherData, processWeatherData };