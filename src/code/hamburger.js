import { addActionToElement, getElementById } from "./helperFunctions.js";

let hamburger = getElementById("hamburger");
addActionToElement(hamburger)(toggleHamburgerMeny);

function toggleHamburgerMeny() {
  let links = document.querySelector("nav");
  links.classList.toggle("nav-active");
}
