import { showChart } from "./chart.js";
import { getElementById } from "./helperFunctions.js";
// import categories from "./api/categories.json.js";

printStatistics();

function printStatistics() {
  let statsWrapper = getElementById("stats-board");
  let playerScore = JSON.parse(localStorage.getItem("score"));
  //   console.log(categories);

  let tableStr = `
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th>Points</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
  `;

  Object.keys(playerScore).forEach(function (category) {
    let name = category;
    let points = playerScore[category].points;
    let total = playerScore[category].totalQuestions;

    tableStr += `
        <tr>
            <td>${name}</td>
            <td>${points}</td>
            <td>${total}</td>
        </tr>
    `;
  });

  tableStr += `
    </tbody>
  </table>
  `;

  statsWrapper.innerHTML += tableStr;
  showChart();
}
