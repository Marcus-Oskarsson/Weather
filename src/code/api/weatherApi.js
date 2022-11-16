"use strict";
import {
  API_URL_WEATHER_TODAY as WEATHER_TODAY,
  API_URL_WEATHER_FORECAST as WEATHER_FORECAST,
} from "./reusables.js";

export async function getWeather(city) {
  return await (await fetch(WEATHER_TODAY(city))).json();
}

export async function getWeatherForecast(city) {
  return await (await fetch(WEATHER_FORECAST(city))).json();
}
