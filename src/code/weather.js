import { getWeather, getWeatherForecast } from "./api/weatherApi.js";
import {
  addAttributeToElement,
  addClassToElement,
  appendChildToElement,
  createElement,
  createElementWithText,
  getElementAttributById,
  getElementById,
  createElementsWithText,
} from "./helperFunctions.js";
import { createWeatherCanvas } from "./weatherChart.js";

main();

function addVideoSrc(weatherName, element) {
  const weatherClasses = [
    "Clear",
    "Clouds",
    "Drizzle",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];

  if (weatherClasses.includes(weatherName)) {
    addAttributeToElement(element)("src")(
      `./assets/${weatherName.toLowerCase()}.mp4`
    );
  } else {
    addAttributeToElement(element)("src")("./assets/otherWeather.mp4");
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanWrapper(wrapper) {
  wrapper.innerHTML = "";
}

function getCityFromLocalStorage() {
  return localStorage.getItem("weather-city");
}

function getHourAndMinutes(date) {
  console.log("here");
  return `${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)}`;
}

function getTimeAndDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "long" });
  let time = getHourAndMinutes(date);
  return `${day} ${month}, ${time}`;
}

async function handleFormSubmit() {
  let cityName = getElementAttributById("city-search")("value");

  if (cityName) setCityToLocalStorage(cityName);
  location.reload();
}

async function main() {
  let city = getCityFromLocalStorage() || "Göteborg";
  let input = getElementById("city-search");
  input.value = "";
  input.focus();
  let cityCapitalized = capitalizeFirstLetter(city);
  addAttributeToElement(input)("placeholder")(cityCapitalized);
  fetchWeather(city);

  let form = getElementById("search-city");
  let main = getElementById("main");

  // Sets focus on content
  main.scrollIntoView({ behavior: "smooth" });
  form.addEventListener("submit", handleFormSubmit);
}

function fetchWeather(city) {
  let weather = getWeather(city);
  let weatherForecast = getWeatherForecast(city);

  Promise.all([weather, weatherForecast]).then((values) => {
    printWeather(...values);
    let i = setInterval(() => {
      printWeather(...values);
    }, 60000);
  });
}

async function printWeather(weather, weatherForecast) {
  let weatherWrapper = getElementById("weather-article");
  cleanWrapper(weatherWrapper);

  const weatherDescriptionFormated = capitalizeFirstLetter(
    weather.weather[0].description
  );
  const tempRoundedStr = `${Math.round(weather.main.temp)}°C`;
  const feelsLikeRoundedStr = `Feels like ${Math.round(
    weather.main.feels_like
  )}°C`;

  // Sets page title
  document.title = `Weather | ${weather.name} ${tempRoundedStr}`;

  let [weatherTitle, temp, feelsLike, todaysDate] = createElementsWithText("p")(
    weatherDescriptionFormated,
    tempRoundedStr,
    feelsLikeRoundedStr,
    getTimeAndDate()
  );

  let icon = createElement("img");
  let addAttributToIcon = addAttributeToElement(icon);

  const iconLink = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  addAttributToIcon("src")(iconLink);
  addAttributToIcon("alt")(weatherDescriptionFormated);

  let cityName = createElementWithText("h1")(weather.name);
  let leftWrapper = createElement("div");
  let rightWrapper = createElement("div");

  addClassToElement(leftWrapper)("left-wrapper");
  addClassToElement(rightWrapper)("right-wrapper");

  appendChildToElement(leftWrapper)(temp, feelsLike);
  appendChildToElement(rightWrapper)(icon, weatherTitle);
  appendChildToElement(weatherWrapper)(
    cityName,
    todaysDate,
    leftWrapper,
    rightWrapper
  );

  // Sätt bakgrund och klasser
  let video = getElementById("video");
  let source = createElement("source");

  const weatherName = weather.weather[0].main;
  addVideoSrc(weatherName, source);

  // Border redigera videon istället
  if (weatherName === "Clouds") video.playbackRate = 0.75;

  appendChildToElement(video)(source);

  let main = getElementById("main");
  appendChildToElement(main)(video);

  weatherWrapper.removeAttribute("class");
  addClassToElement(weatherWrapper)(weatherName.toLowerCase());

  let canvas = createWeatherCanvas(weatherForecast);

  appendChildToElement(weatherWrapper)(canvas);
}

function setCityToLocalStorage(cityName) {
  localStorage.setItem("weather-city", cityName);
}
