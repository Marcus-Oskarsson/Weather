import { API_TRIVIA_BASE_URL } from "./reusables.js";
import { API_TRIVIA_CATEGORIES } from "./reusables.js";
import categories from "./categories.json.js";
import stats from "./statsServer.json.js";
import { startLoading, stopLoading } from "../loading.js";
import { getElementsByClass } from "../helperFunctions.js";

export function getQuestions({
  amount = 1,
  category = 9,
  difficulty = "easy",
  type = "multiple",
} = {}) {
  return get(
    `amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
  );
}

export async function getCategories() {
  startLoader();
  try {
    let res = await fetch(API_TRIVIA_CATEGORIES);
    let data = await res.json();
    data = data.trivia_categories.slice(0, 15);

    let allCategories = data.map((category) => {
      let { image } = categories.find((o) => o.id === category.id);
      let newObj = {
        id: category.id,
        category: category.name,
        image,
      };
      newObj = addNameToCategory({ ...newObj, ...category });
      return newObj;
    });
    return allCategories;
  } catch (error) {
    onError(error);
  } finally {
    setTimeout(() => {
      let cards = getElementsByClass("card-image") || [];
      let p = cards.map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve("done");
          }
        });
      });
      Promise.all(p).then(stopLoader);
    }, 1000);
  }
}

async function get(url) {
  startLoader();
  try {
    let response = await fetch(API_TRIVIA_BASE_URL + url);
    let data = await response.json();
    checkForOtherErrors(data.response_code);
    return onSuccess(data);
  } catch (error) {
    onError(error);
  } finally {
    stopLoader();
  }
}

function addNameToCategory(category) {
  let findName = /[a-zA-Z]+:\s*([a-zA-Z\s]*)/i;
  let name = findName.test(category.category)
    ? findName.exec(category.category)[1]
    : category.category;
  return { ...category, name };
}

async function onSuccess(data) {
  for (let i = 0; i < data.results.length; i++) {
    data.results[i] = addNameToCategory(data.results[i]);
  }
  return data.results;
}

function checkForOtherErrors(code) {
  if (code !== 0) {
    let errorMsg = "";
    switch (code) {
      case 1:
        errorMsg = "No Results";
        break;
      case 2:
        errorMsg = "Invalid Parameter";
        break;
      default:
        errorMsg = "Error with token";
    }
    throw new Error(errorMsg);
  }
}

// extra
export async function getTotalScore() {
  try {
    // Om jag skulle hämta det från en riktig server
    var res = await fetch("http://localhost:3001/");
    var data = await res.json();
  } catch (error) {
    onError(error);
    // Just nu bara en fil
    var data = stats;
  }

  return data;
}

function onError(error) {
  console.log("Eget fångat fel: ", error); // eslint-disable-line no-console
}

function startLoader() {
  console.log("starting loader"); // eslint-disable-line no-console
  startLoading();
}

function stopLoader() {
  console.log("stopping loader"); // eslint-disable-line no-console
  stopLoading();
}
