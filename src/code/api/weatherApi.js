"use strict";
import {
  API_URL_WEATHER_TODAY as WEATHER_TODAY,
  API_URL_WEATHER_FORECAST as WEATHER_FORECAST,
} from "./reusables.js";

export async function getWeather(city) {
  try {
    let weather = await fetch(WEATHER_TODAY(city));
    if (weather.status !== 200) throw new Error(weather.statusText);
    return onSuccess(weather);
  } catch (error) {
    // Just nu hinner jag inte generalisera returnha det såhär så att det fungerar med cities till efter inlämningen. Just nu hanteras det som innan i cities.js, kanske rimligt att göra likadant för weather.js?
    if (location.href.includes("cities.html")) return;
    // Sätter om sparade staden så man inte laddar om och försöker hämta samma fel igen.
    localStorage.setItem("weather-city", "Göteborg");
    document.getElementById("city-search").setAttribute("placeholder", error);
  }
}

export async function getWeatherForecast(city) {
  return await (await fetch(WEATHER_FORECAST(city))).json();
}

async function onSuccess(weather) {
  return await weather.json();
}
