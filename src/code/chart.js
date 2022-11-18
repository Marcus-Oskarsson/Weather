import {
  addClassToElement,
  appendChildToElement,
  createElement,
  getElementById,
} from "./helperFunctions.js";
import { getCategories, getTotalScore } from "./api/quizApi.js";

export async function showChart(score) {
  let chart = createElement("canvas");
  addClassToElement(chart)("canvas");
  let categories = await getCategories();

  let ctx = chart.getContext("2d");

  let totalOldScore = await getTotalScore();
  let oldStats = Object.values(totalOldScore).map((category) => {
    return (category.points / category.totalQuestions || 0) * 100;
  });

  // Build startingScore object
  let startingScore = {};
  categories.forEach((c) => {
    startingScore[c.name] = {
      points: 0,
      totalQuestions: 0,
    };
  });

  let totalScore = JSON.parse(localStorage.getItem("score")) || startingScore;
  // If chart is called after game it has score otherwise not
  if (score) {
    totalScore[score.name].points += score.points;
    totalScore[score.name].totalQuestions += score.totalQuestions;
  }
  localStorage.setItem("score", JSON.stringify(totalScore));

  let stats = Object.values(totalScore).map((category) => {
    return (category.points / category.totalQuestions || 0) * 100;
  });

  let data = {
    labels: [...Object.keys(totalScore)],
    datasets: [
      {
        label: "Your score",
        data: [...stats],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "Other people's score",
        data: [...oldStats],
        fill: true,
        backgroundColor: "rgba(111, 99, 132, 0.2)",
        borderColor: "rgb(111, 99, 132)",
        pointBackgroundColor: "rgb(111, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  let options = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    elements: {
      line: {},
      point: {
        pointStyle: "crossRot",
      },
    },
  };

  new Chart(ctx, {
    type: "radar",
    data,
    options,
  });

  let gameBoard = getElementById("game-board") || getElementById("stats-board");
  let wrapper = createElement("div");
  appendChildToElement(wrapper)(chart);
  addClassToElement(wrapper)("chart-wrapper");
  appendChildToElement(gameBoard)(wrapper);
}
