import { addAttributeToElement, createElement } from "./helperFunctions.js";

export function createWeatherCanvas(weatherForecast) {
  let canvas = createElement("canvas");
  canvas.setAttribute("id", "weather-chart");

  weatherForecast.list = weatherForecast.list.filter(
    (weather) =>
      weather.dt_txt.includes("12:00:00") || weather.dt_txt.includes("18:00:00")
  );

  let labels = weatherForecast.list
    .map((weather) => `${weather.dt_txt.split(" ")[1].slice(0, 5)}`)
    .slice(0, 15);
  let data = {
    labels: labels,
    datasets: [
      {
        label: "Temp",
        data: weatherForecast.list
          .map((weather) => Math.round(weather.main.temp))
          .slice(0, 15),
        fill: true,
        borderColor: "rgb(236, 236, 236)",
        tension: 0.3,
      },
    ],
  };

  let options = {
    plugins: {
      title: {
        color: "white",
        display: true,
        text: "Forecast",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
        },
      },
    },
  };

  new Chart(canvas, {
    type: "line",
    data,
    options,
  });

  return canvas;
}
