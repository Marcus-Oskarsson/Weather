"use strict";
// Ville bara öva på att kaplsa in funktioner i varandra här.

import { API_URL_CITIES as API_URL } from "./reusables.js";

export async function getCities() {
  return handleErrorFromFetchFunction()(async function () {
    return (await fetch(API_URL)).json();
  });
}

export async function getCity(citySearchString) {
  return handleErrorFromFetchFunction()(async function () {
    return (await fetch(`${API_URL}?name=${citySearchString}`)).json();
  });
}

export async function deleteCity(cityId) {
  return handleErrorFromFetchFunction()(async function () {
    let options = buildHeader("DELETE");
    return fetch(`${API_URL}/${cityId}`, options);
  });
}

export async function createCity({ cityName, cityPopulation }) {
  return handleErrorFromFetchFunction()(async function () {
    let options = buildHeader("POST", cityName, cityPopulation);
    return (await fetch(`${API_URL}`, options)).json();
  });
}

export async function changeCity({ cityId, cityName, cityPopulation }) {
  return handleErrorFromFetchFunction()(
    async function () {
      let options = buildHeader("PATCH", cityName, cityPopulation);
      return (await fetch(`${API_URL}/${cityId}`, options)).json();
    },
    cityId,
    cityName,
    cityPopulation
  );
}

function buildHeader(methodName, cityName, cityPopulation) {
  let data = {};

  if (cityName && cityPopulation) {
    data = { name: cityName, population: Number(cityPopulation) };
  } else if (cityName || cityPopulation) {
    data = cityName
      ? { name: cityName }
      : { population: Number(cityPopulation) };
  }
  return {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: methodName,
  };
}

function handleErrorFromFetchFunction(errorHandleElement) {
  return async function fromFetchfunction(fn, ...rest) {
    try {
      let response = await fn(...rest);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };
}
