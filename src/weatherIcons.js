import clearWeatherIcon from "./images/sun.png";
import snowyWeatherIcon from "./images/snowflake.png";
import windyWeatherIcon from "./images/wind.png";
import partlyCloudyWeatherIcon from "./images/partly cloudy.png";
import cloudyWeatherIcon from "./images/clouds.png";
import rainyWeatherIcon from "./images/rain.png";
import stormyWeatherIcon from "./images/thunderstorm.png";

const icons = {
    clear : {
        img: clearWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/morning" title="morning icons">Morning icons created by Icon Place - Flaticon</a>`
    },
    snow: {
        img: snowyWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/snow" title="snow icons">Snow icons created by Freepik - Flaticon</a>`
    },
    wind: {
        img: windyWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/wind" title="wind icons">Wind icons created by Freepik - Flaticon</a>`
    },
    "partly cloudy": {
        img: partlyCloudyWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/cloudy" title="cloudy icons">Cloudy icons created by Georgiana_Lavinia - Flaticon</a>
`
    },
    cloudy: {
        img: cloudyWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/cloud" title="cloud icons">Cloud icons created by Freepik - Flaticon</a>`
    },
    rain: {
        img: rainyWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/water" title="water icons">Water icons created by Freepik - Flaticon</a>`
    },
    storm: {
        img: stormyWeatherIcon,
        creditInfo: `<a target="_blank" href="https://www.flaticon.com/free-icons/thunderstorm" title="thunderstorm icons">Thunderstorm icons created by Good Ware - Flaticon</a>`
    }
};

export default function getWeatherIcon (conditions) {
    if (conditions.startsWith('clear') || conditions.startsWith('sun')) {
        return icons.clear;
    } else if (conditions.startsWith('thunder') || conditions.startsWith('storm')) {
        return icons.storm;
    } else if (conditions.startsWith('rain') || conditions.startsWith('hail') || conditions.startsWith('sleet')) {
        return icons.rain;
    } else if (conditions.startsWith('partially cloudy')) {
        return icons['partly cloudy'];
    } else if (conditions.startsWith('cloud')) {
        return icons.cloudy;
    } else if (conditions.startsWith('snow')) {
        return icons.snow;
    } else if (conditions.startsWith('wind') || conditions.startsWith('fog') || conditions.startsWith('mist') || conditions.startsWith('dust')) {
        return icons.wind;
    } else {
        return icons.clear;
    }
};