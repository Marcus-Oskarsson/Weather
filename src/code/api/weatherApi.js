"use strict";
import {
  API_URL_WEATHER_TODAY as WEATHER_TODAY,
  API_URL_WEATHER_FORECAST as WEATHER_FORECAST,
} from "./reusables.js";

export function getWeatherAndForecast(city) {
  const weather = getWeather(city);
  const weatherForecast = getWeatherForecast(city);
  return { weather, weatherForecast };
}

async function getWeather(city) {
  try {
    let weather = await fetch(WEATHER_TODAY(city));
    if (weather.status !== 200) throw new Error(weather.statusText);
    return onSuccess(weather);
  } catch (error) {
    if (location.href.includes("cities.html")) return;
    // Sätter om sparade staden så man inte laddar om och försöker hämta samma fel igen.
    return onError(error);
  }
}

async function getWeatherForecast(city) {
  try {
    let response = await fetch(WEATHER_FORECAST(city));
    let forecast = await response.json();
    if (forecast?.cod === "404") throw new Error(forecast?.message);
    return await forecast;
  } catch (error) {
    return { list: [] };
  }
}

async function onSuccess(weather) {
  return await weather.json();
}

function onError(error) {
  localStorage.setItem("weather-city", "Göteborg");
  document
    .getElementById("city-search")
    .setAttribute("placeholder", String(error).slice(7));
  return {
    name: "Terra incognita",
    main: {
      temp: 0,
      feels_like: 0,
    },
    weather: [
      {
        main: "unknown",
        description: "Here be dragons",
        icon: "None",
      },
    ],
  };
}
