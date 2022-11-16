import {
  addClassToElement,
  appendChildToElement,
  createElement,
  getElementById,
  removeNodesFrom,
} from "./helperFunctions.js";

let wrapper = createElement("div");
let div1 = createElement("div");
let div2 = createElement("div");
let div3 = createElement("div");
let div4 = createElement("div");
let gameBoard = getElementById("game-board");

export function startLoading() {
  addClassToElement(wrapper)(
    "la-ball-climbing-dot",
    "la-dark",
    "la-2x",
    "center"
  );
  appendChildToElement(wrapper)(div1, div2, div3, div4);
  appendChildToElement(gameBoard)(wrapper);
}

export function stopLoading() {
  let gameBoard = getElementById("game-board");
  removeNodesFrom(gameBoard)(wrapper);
}
