"use strict";
import {
  getCities,
  changeCity,
  deleteCity,
  createCity,
  getCity,
} from "./api/citiesApi.js";
import { getWeather } from "./api/weatherApi.js";
import {
  addAttributeToElement,
  addClassToElement,
  appendChildToElement,
  createElement,
  createElementWithText,
  createElementsWithText,
  getElementById,
} from "./helperFunctions.js";

main();

/**
 * Lägger till väder för staden
 * @param {HTMLElement} elementWrapper
 */
function addWeatherToElement(elementWrapper) {
  /**
   * @param {string} cityName - namenet på staden
   */
  return async function addWeatherInCity(cityName) {
    let createParagraphsWithText = createElementsWithText("p");
    try {
      let weather = await fetchWeather(cityName);
      if (weather.cod !== 200) {
        throw new Error(weather.message);
      }

      let [header, feelsLike, temp, wind] = createParagraphsWithText(
        "Väder",
        `Känns som: ${weather?.main?.feels_like || "Ingen data"}°C.`,
        `Temperatur: ${weather?.main?.temp || "Ingen data"}°C.`,
        `Vind: ${weather?.wind?.speed || "Ingen data"} m/s.`
      );

      addClassToElement(header)("h3");
      appendChildToElement(elementWrapper)(header, feelsLike, temp, wind);
    } catch (error) {
      let [header, errorParagraph] = createParagraphsWithText(
        error,
        "Kontrollera stavningen på staden och ladda sedan om sidan för att försöka igen."
      );
      addClassToElement(header)("h3");
      appendChildToElement(elementWrapper)(header, errorParagraph);
    }
  };
}

/**
 * @function createCityCard
 * @param {HTMLElement} wrapperElement - Elementet vari alla element ska adderas
 */
function createCityCard(wrapperElement) {
  /**
   * @function createCard
   * @param {City} city
   */
  return function createCard(city) {
    let cityBtn = createElement("i");
    let cardHeader = createElement("div");
    let cardBody = createElement("div");
    let cityName = createElementWithText("span")(city.name);
    let cityPopulation = createElementWithText("p")(
      `Befolkning: ${city.population}`
    );
    let cityWrapper = createElement("article");
    let deleteCityBtn = createElement("i");
    let cityImage = createElement("img");
    let weatherContainer = createElement("div");
    let bodyTitle = createElementWithText("p")("Information");

    addWeatherToElement(weatherContainer)(city.name);

    addAttributeToElement(cityImage)("alt")(city.name);
    addAttributeToElement(cityImage)("src")(
      "https://www.businessregiongoteborg.se/sites/brg/files/2020-08/G%C3%B6teborg%20Sj%C3%B6manshustrun%201.JPG"
    );

    addClassToElement(cityImage)("card-img-top");
    addAttributeToElement(weatherContainer)("class")(`weather-${city.name}`);

    addClassToElement(cardHeader)("card-header");
    addClassToElement(cardBody)("card-body");

    addClassToElement(cityBtn)("bi", "bi-pencil-square");
    addClassToElement(deleteCityBtn)("bi", "bi-trash");

    addAttributeToElement(cityBtn)("data-bs-toggle")("modal");
    addAttributeToElement(cityBtn)("data-bs-target")("#updateCity");
    addAttributeToElement(cityBtn)("title")("Redigera");
    addAttributeToElement(deleteCityBtn)("title")("Radera");

    addClassToElement(cityName)("h2");
    addClassToElement(bodyTitle)("h3");

    appendChildToElement(cardHeader)(cityName, cityBtn, deleteCityBtn);
    appendChildToElement(cardBody)(bodyTitle, cityPopulation, weatherContainer);
    appendChildToElement(cityWrapper)(cityImage, cardHeader, cardBody);
    appendChildToElement(wrapperElement)(cityWrapper);

    addClassToElement(cityWrapper)("card");

    deleteCityBtn.addEventListener("click", function () {
      deleteCity(city.id).then(fetchCities);
    });

    cityBtn.addEventListener("click", function () {
      let cityTitle = getElementById("updateCityTitle");
      cityTitle.textContent = `Uppdatera ${city.name}`;

      let updateCityBtn = getElementById("updateCityBtn");
      updateCityBtn.addEventListener("click", function () {
        let newCity = {
          ...getModalData("updateCity")("update"),
          cityId: city.id,
        };
        changeCity(newCity).then(fetchCities);
      });
    });
  };
}

/**
 * Skapar en ny stad och uppdaterar
 */
async function createNewCity() {
  let city = getModalData("newCity")("create");
  let cities = await createCity(city);
  let citiesWrapper = getElementById("cities");
  displayCitiesAt(cities)(citiesWrapper);
}

/**
 * @function displayCitiesAt
 * @param {Array<City>} cities - Array med städer hämtade från server
 */
function displayCitiesAt(cities = []) {
  /**
   * @function displayInWrapper
   * @param {HTMLElement} wrapperElement - Elementet vari alla noder för städerna läggs till
   * @returns {void} Uppdaterar HTML
   */
  return function displayInWrapper(wrapperElement) {
    wrapperElement.innerHTML = "";
    addClassToElement(wrapperElement)("citiesContainer");
    let createCard = createCityCard(wrapperElement);
    console.log("typ: ", typeof cities, " cities: ", cities);
    cities.forEach(function (city) {
      createCard(city);
    });
  };
}

/**
 * Hämtar städer och uppdaterar
 * @function fetchCities
 * @returns {Array<City>} Array med städer
 */
async function fetchCities() {
  let cities = await getCities();
  console.log("cities: ", cities, " ", typeof cities);
  let citiesWrapper = getElementById("cities");
  displayCitiesAt(cities)(citiesWrapper);
  return cities;
}

async function fetchWeather(cityName) {
  return await getWeather(cityName);
}

/**
 * @function getModalData
 * @param {string} modalId - Id för modalen (popupen)
 */
function getModalData(modalId) {
  /**
   * @function idWithAction
   * @param {string} action - för att hitta rätt nod börjar id med create/update (action)
   * @returns {Partial<City>} En stad
   */
  return function idWithAction(action) {
    return {
      cityName: document.querySelector(`#${modalId} #${action}CityName`).value,
      cityPopulation: document.querySelector(
        `#${modalId} #${action}CityPopulation`
      ).value,
    };
  };
}

/**
 * @function main
 */
function main() {
  /**
   * @type {Array<City>} Array med städer
   */
  let cities = fetchCities();

  let citiesWrapper = getElementById("cities");
  let createNewCityBtn = getElementById("createCityBtn");
  let searchBtn = getElementById("searchCityBtn");
  createNewCityBtn.addEventListener("click", createNewCity);
  searchBtn.addEventListener("click", searchCities);

  displayCitiesAt(cities)(citiesWrapper);
}

async function searchCities() {
  let cityNameSearch = getElementById("cityNameSearch");
  let citySearchString = cityNameSearch.value;
  let cities = await getCity(citySearchString);
  let citiesWrapper = getElementById("cities");
  displayCitiesAt(cities)(citiesWrapper);
}

/**
 * @typedef {Object} City
 * @property {string} id Stadens id
 * @property {string} name Namnet på staden
 * @property {number} population Antalet invånare i staden
 */
