import { addClickActionToElement, getElementById } from "./helperFunctions.js";

let hamburger = getElementById("hamburger");
addClickActionToElement(hamburger)(toggleHamburgerMeny);

function toggleHamburgerMeny() {
  let links = document.querySelector("nav");
  links.classList.toggle("nav-active");
}
