// Kände att jag ville öva på att skicka runt funktioner och sen gick det överstyr, men vissa är rätt användbara om man vill köra delar av funktionen. Skapar säkert mer förvirring än vad det hjälper att "skriva om" inbyggda metoder.

/**
 * Lägger till ett attribut till ett element
 * @function addAttributeToElement
 * @param {HTMLElement} element - Elementet som ska uppdateras
 */
function addAttributeToElement(element) {
  /**
   * @function updateAttribut
   * @param {string} attributeName - Vilket attribut som ska uppdateras
   */
  return function updateAttribut(attributeName) {
    /**
     * @function updateWithValue
     * @param {string} attributeValue - Värdet för attributet
     * @returns {HTMLElement} Nodelementet
     */
    return function updateWithValue(attributeValue) {
      element.setAttribute(attributeName, attributeValue);
      return element;
    };
  };
}

/**
 * Lägger till en/flera klasser till ett element
 * @function addClassToElement
 * @param {HTMLElement} element - Elementet som ska uppdateras
 */
function addClassToElement(element) {
  /**
   * @function addClass
   * @param {...String} classNames - Klassnamn som ska läggas till
   * @returns {HTMLElement} Nodelementet
   */
  return function addClass(...classNames) {
    element.classList.add(...classNames);
    return element;
  };
}

/**
 * Lägger till en klick-lyssnare och funktion till ett element
 * @function addActionToElement
 * @param {HTMLElement} elemenet - elementet som ska få en lyssnare
 */
function addActionToElement(elemenet) {
  /**
   * @function addAction
   * @param {function} action - action - Funktionen som ska triggas vid klick
   * @returns {HTMLElement}
   */
  return function addAction(action) {
    elemenet.addEventListener("click", action);
    return elemenet;
  };
}

/**
 * Lägger till barnnoder till en föräldranod
 * @function appendChildToElement
 * @param {HTMLElement} elementWrapper - Elementet vari barnelementen ska läggas
 */
function appendChildToElement(elementWrapper) {
  /**
   * @function appendChildren
   * @param {...HTMLElement} children - Elementen som ska läggas till
   */
  return function appendChildren(...children) {
    children.forEach(function (child) {
      elementWrapper.appendChild(child);
    });
  };
}

/**
 * Skapar endast en knapp, och kan alltså inte användas
 * för att skapa fler knappar med samma text men olika funktioner
 * @function createButtonWithTextAndAction
 * @param {string} text - Texten som ska stå på knappen
 */
function createButtonWithTextAndAction(text) {
  let button = createElementWithText("button")(text);
  return addActionToElement(button);
}

/**
 * @function createElement
 * @param {string} elementType - Typen av element som ska skapas
 * @returns {HTMLElement} Nodelementet
 */
function createElement(elementType) {
  return document.createElement(elementType);
}

/**
 * @function createElementWithText
 * @param {string} elementType - Typen av element som ska skapas
 */
function createElementWithText(elementType) {
  return function addText(text) {
    let element = createElement(elementType);
    element.textContent = text;
    return element;
  };
}

/**
 * @function createElementsWithText
 * @param {string} elementType
 */
function createElementsWithText(elementType) {
  /**
   * @function addText
   * @param {Array.<string>} text
   * @return {Array.<HTMLElement>}
   */
  return function addText(...text) {
    return text.map(function (str) {
      let element = createElement(elementType);
      element.textContent = str;
      return element;
    });
  };
}

/**
 * @function getElementsByClass
 * @param {string} className - Klass för elementen som ska hämtas
 * @returns {Array.<HTMLElement>} Nodelementen
 */
function getElementsByClass(className) {
  return [...document.getElementsByClassName(className)];
}

/**
 * @function getElementById
 * @param {string} elementId - Id för elementet som ska uppdateras
 * @returns {HTMLElement} Nodelementet
 */
function getElementById(elementId) {
  return document.getElementById(elementId);
}

function getElementAttributById(elementId) {
  return function getAttribute(attributeName) {
    let element = getElementById(elementId);
    return element[attributeName];
  };
}

/**
 * @function removeNodesFrom
 * @param {HTMLElement} parent - Noden vars barnnoder ska tas bort
 */
function removeNodesFrom(parent) {
  /**
   * @function removeNodes
   * @param {...HTMLElement} children - Noderna som ska tas bort
   */
  return function removeNodes(...children) {
    children.forEach(function (child) {
      parent.removeChild(child);
    });
  };
}

export {
  addActionToElement,
  addAttributeToElement,
  addClassToElement,
  appendChildToElement,
  createButtonWithTextAndAction,
  createElement,
  createElementWithText,
  createElementsWithText,
  getElementsByClass,
  getElementById,
  getElementAttributById,
  removeNodesFrom,
};
