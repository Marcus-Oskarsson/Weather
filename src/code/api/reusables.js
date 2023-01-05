const WEATHER_API_KEY = "3340cbe473b3001d4487c919d349bee2";
const CITY_API_KEY = "a23e764e9e6349999ac28bac3a94788f";

export function API_URL_WEATHER_TODAY(city) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&APPID=${WEATHER_API_KEY}`;
}

export function API_URL_WEATHER_FORECAST(city) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${WEATHER_API_KEY}`;
}

export function CITY_URL(long, lat) {
  return `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${CITY_API_KEY}`;
}
