// import categories from "./categories.json.js";
import categories from "./api/categories.json.js";
import { getQuestions, getCategories } from "./api/quizApi.js";
import { showChart } from "./chart.js";
import {
  addActionToElement,
  addClickActionToElement,
  addAttributeToElement,
  addClassToElement,
  appendChildToElement,
  createButtonWithTextAndAction,
  createElement,
  createElementWithText,
  getElementsByClass,
  getElementById,
  removeNodesFrom,
} from "./helperFunctions.js";

createCategoryList();

function cleanCanvas() {
  let gameBoard = getElementById("game-board");
  gameBoard.innerHTML = "";
}

async function createCategoryList() {
  let gameBoard = getElementById("game-board");
  let appendToGameBoard = appendChildToElement(gameBoard);
  let categories = await getCategories();

  categories.forEach(function (category) {
    let categoryCard = createElement("div");
    let heading = createElementWithText("h3")(category.name);
    let image = createElement("img");
    addClassToElement(image)("card-image");

    addClickActionToElement(categoryCard)(() => {
      pickNumberOfQuestions(category.id);
    });
    addAttributeToElement(categoryCard)("id")(category.id);
    addAttributeToElement(categoryCard)("class")("card");
    addAttributeToElement(image)("src")(category.image);
    addAttributeToElement(image)("alt")(category.name);

    appendChildToElement(categoryCard)(image, heading);
    appendToGameBoard(categoryCard);
  });
}

function handleChooseNumberOfQuestions(e, options) {
  e.preventDefault();
  startQuizGame(options);
}

/**
 * Kontrollerar att antalet frågor är inom ramarna
 */
function handleInput(e) {
  let value = e.target.value;
  if (value < 1) {
    e.target.value = 1;
  }
  if (value > 10) {
    e.target.value = 10;
  }
}

function pickNumberOfQuestions(id) {
  cleanCanvas();

  let backGroundImage = createElement("img");
  let gameBoard = getElementById("game-board");
  let form = createElement("form");
  let label = createElementWithText("label")("How many questions?");
  let input = createElement("input");

  let currentCat = categories.find((cat) => cat.id === id);
  let addAttributeToImage = addAttributeToElement(backGroundImage);
  addAttributeToImage("src")(currentCat.image);
  addAttributeToImage("alt")(currentCat.name);
  addAttributeToImage("id")("background-hero-img");
  addClassToElement(backGroundImage)("background-hero-img");

  addClassToElement(form)("number-of-questions-form");

  let addAttributToInput = addAttributeToElement(input);
  addAttributeToElement(label)("for")("number-of-questions");
  addAttributToInput("type")("number");
  addAttributToInput("id")("number-of-questions");
  addAttributToInput("min")("1");
  addAttributToInput("value")("1");
  // input.value = 1;

  // input.addEventListener("change", handleInput);
  addActionToElement(input)("change")(handleInput);

  let btn = createButtonWithTextAndAction("Continue")((e) => {
    handleChooseNumberOfQuestions(e, {
      category: id,
      amount: Number(input.value),
    });
  });

  appendChildToElement(form)(label, input, btn);
  appendChildToElement(gameBoard)(form, backGroundImage);
}

function checkAnswer(correctAnswer, playerAnswer) {
  return decodeHTMLEntities(correctAnswer) === decodeHTMLEntities(playerAnswer);
}

function shuffle(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return [...newArray];
}

function createQuestionForm(question, nextQuestion) {
  let imageToKeepOnCanvas = getElementById("background-hero-img");
  let gameBoard = getElementById("game-board");
  let childrenToRemove = [...gameBoard.children];

  childrenToRemove = childrenToRemove.filter(
    (child) => child != imageToKeepOnCanvas
  );
  removeNodesFrom(gameBoard)(...childrenToRemove);

  let alternatives = getQuestionAnswerAlternatives(question);
  let questionWrapper = createElement("div");
  let questionCategoryHeader = createElementWithText("h2")(question.category);
  let questionParagraph = createElementWithText("p")(
    decodeHTMLEntities(question.question)
  );

  addClassToElement(questionWrapper)("game-question");

  let allAnswers = [];
  alternatives.forEach(function (alternative) {
    let button = createButtonWithTextAndAction(decodeHTMLEntities(alternative))(
      nextQuestion
    );
    addAttributeToElement(button)("class")("question-answer-btn");
    allAnswers.push(button);
  });

  appendChildToElement(questionWrapper)(
    questionCategoryHeader,
    questionParagraph,
    ...allAnswers
  );
  appendChildToElement(gameBoard)(questionWrapper);
}

function decodeHTMLEntities(text) {
  // Hämtad från:
  //  https://javascript.plainenglish.io/here-are-2-javascript-approaches-to-encode-decode-html-entities-52989bb12031
  let textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

function getQuestionAnswerAlternatives(question) {
  return shuffle([question.correct_answer, ...question.incorrect_answers]);
}

function roundWithUpdate(nextFn) {
  return function playRound(questionObject) {
    createQuestionForm(questionObject, nextFn);
  };
}

function questionFeedback(question, allBtns) {
  allBtns.forEach((btn) => {
    let addClassToBtn = addClassToElement(btn);
    if (checkAnswer(question.correct_answer, btn.textContent)) {
      addClassToBtn("correct");
    } else {
      addClassToBtn("incorrect");
    }
  });
}

function trackCurrent(result) {
  return function updateCurrentResult(points) {
    result["points"] += points;
    result["totalQuestions"] += 1;

    // Sets page title with current points
    document.title = `Quiz - Points: ${result.points} / ${result.totalQuestions}`;
    return result;
  };
}

function summarize(result) {
  cleanCanvas();
  let gameBoard = getElementById("game-board");
  let resultWrapper = createElement("div");
  let title = createElementWithText("h2")("Score");
  let score = createElementWithText("p")(
    `Points: ${result.points}/${result.totalQuestions}`
  );

  addClassToElement(resultWrapper)("result-wrapper");
  appendChildToElement(resultWrapper)(title, score);
  appendChildToElement(gameBoard)(resultWrapper);
}

function awardPoints(correctAnswer, playerAnswer) {
  return checkAnswer(correctAnswer, playerAnswer) ? 1 : 0;
}

async function startQuizGame(options = {}) {
  let questions = await getQuestions(options);
  let currentQuestionIdx = 0;
  let currentQuestion = questions[currentQuestionIdx];
  let playCurrentRound = roundWithUpdate(nextQuestion);

  let result = {
    points: 0,
    totalQuestions: 0,
    category: questions[0].category,
    name: questions[0].name,
  };
  let updateCurrentResult = trackCurrent(result);

  function nextQuestion(previousAnswer) {
    let points = awardPoints(
      currentQuestion.correct_answer,
      previousAnswer.target.textContent
    );

    let allBtns = getElementsByClass("question-answer-btn");
    questionFeedback(currentQuestion, allBtns);

    result = updateCurrentResult(points);
    currentQuestionIdx += 1;

    allBtns.forEach((btn) => {
      btn.removeEventListener("click", nextQuestion);
    });

    // Tid mellan frågorna så att min hinner få feedback på sitt svar.
    setTimeout(() => {
      if (currentQuestionIdx < questions.length) {
        playCurrentRound(currentQuestion);
      } else {
        summarize(result);
        showChart(result);
      }
    }, 2500);
    currentQuestion = questions[currentQuestionIdx];
  }

  playCurrentRound(currentQuestion);
}
