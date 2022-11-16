export const API_TRIVIA_CATEGORIES = "https://opentdb.com/api_category.php";
export const API_TRIVIA_BASE_URL = "https://opentdb.com/api.php?";
export const API_URL_CITIES = "https://avancera.app/cities";
const WEATHER_API_KEY = "3340cbe473b3001d4487c919d349bee2";

export function API_URL_WEATHER_TODAY(city) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&APPID=${WEATHER_API_KEY}`;
}

export function API_URL_WEATHER_FORECAST(city) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${WEATHER_API_KEY}`;
}
