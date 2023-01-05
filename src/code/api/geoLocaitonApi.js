"use strict";
import { CITY_URL } from "./reusables.js";

export async function getCity(long, lat) {
  try {
    let data = await (await fetch(CITY_URL(long, lat))).json();
    let city = data?.results[0]?.components?.city;
    if (!city) throw new Error("City not found");
    return city;
  } catch (error) {
    console.error(error);
  }
}
