const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

export function API_URL_WEATHER_TODAY(city) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&APPID=${WEATHER_API_KEY}`;
}

export function API_URL_WEATHER_FORECAST(city) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${WEATHER_API_KEY}`;
}
