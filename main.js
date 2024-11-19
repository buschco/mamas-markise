import "./style.css";
import * as d3 from "d3";
const bottom = 60;

const svg = d3
  .create("svg")
  .attr("height", window.innerHeight)
  .attr("width", window.innerWidth)
  .attr("viewBox", [0, 0, 120, 90])
  .attr("stroke", "black")
  .attr("stroke-width", 1 / 640)
  .attr("style", "max-width: 100%; height: auto;");

const houseHeight = 30;

svg
  .append("rect")
  .attr("x", 54)
  .attr("y", bottom - houseHeight)
  .attr("width", 42)
  .attr("height", houseHeight)
  .attr("stroke", "black")
  .attr("fill", "#fff");

const dach = d3.path();

dach.moveTo(50, bottom - houseHeight);

function toRad(a) {
  return a * (Math.PI / 180);
}

function toAng(a) {
  return a / (Math.PI / 180);
}

const dachAng = 30;

const dachHyp = 25 / Math.cos(toRad(dachAng));

const dachH = Math.sin(toRad(dachAng)) * dachHyp;

dach.lineTo(75, bottom - houseHeight - dachH);
dach.lineTo(100, bottom - houseHeight);
dach.closePath();

svg.append("path").attr("d", dach.toString()).attr("fill", "red");

const markise = d3.path();

markise.moveTo(54, bottom - 27.4);

let anglMarGrad = 90;
let anglMar = toRad(anglMarGrad);
const markHyp = 30;

let markLength = Math.sin(anglMar) * markHyp;
let markHeight = Math.cos(anglMar) * markHyp;

markise.lineTo(54 - markLength, bottom - 27.5 + markHeight);
markise.lineTo(54 - markLength, bottom - 27.5 + markHeight);

svg
  .append("path")
  .attr("d", markise.toString())
  .attr("id", "markise")
  .attr("stroke", "orange")
  .attr("stroke-width", "2px");

svg
  .append("circle")
  .attr("cx", 54 - markLength)
  .attr("cy", bottom - 27.5 + markHeight)
  .attr("r", "2px")
  .attr("stroke-width", "1px")
  .attr("id", "control")
  .attr("stroke", "#fff")
  .attr("fill", "orange")
  .call(
    d3.drag().on("drag", function (event) {
      const y = event.y;
      const dy = y - (bottom - 27.5);

      if (dy < -houseHeight || dy > houseHeight) return;

      updateMarkise(dy);
    }),
  );

function updateMarkise(nextmarkHeight) {
  const cos = nextmarkHeight / markHyp;
  const nextAngleRad = Math.acos(cos);
  const nextMarkLength = Math.sin(nextAngleRad) * markHyp;

  const newPath = d3.path();
  newPath.moveTo(54, bottom - 27.4);
  newPath.lineTo(54 - nextMarkLength, bottom - 27.5 + nextmarkHeight);

  d3.select("#markise").attr("d", newPath.toString());
  d3.select("#control")
    .attr("cx", 54 - nextMarkLength)
    .attr("cy", bottom - 27.5 + nextmarkHeight);

  d3.select("#meters").text(`${((27.5 - nextmarkHeight) / 10).toFixed(2)}m`);
  d3.select("#grad").text(`${toAng(nextAngleRad).toFixed(0)}°`);

  d3.select("#percent").text(
    `${((nextmarkHeight / nextMarkLength) * 100).toFixed(0)}%`,
  );
}

svg
  .append("text")
  .attr("x", 20)
  .attr("y", 50)
  .attr("fill", "#fff")
  .attr("id", "meters")
  .text(`${((27.5 - markHeight) / 10).toFixed(2)}m`)
  .attr("font-size", "0.5em");

svg
  .append("text")
  .attr("x", 70)
  .attr("y", 50)
  .attr("fill", "#000")
  .text(`${anglMarGrad.toFixed(0)}°`)
  .attr("id", "grad")
  .attr("font-size", "0.5em");

svg
  .append("text")
  .attr("x", 70)
  .attr("y", 40)
  .attr("fill", "#000")
  .text(`${(Math.tan(90 - anglMarGrad) * 100).toFixed(0)}%`)
  .attr("id", "percent")
  .attr("font-size", "0.5em");

svg
  .append("rect")
  .attr("x", 89)
  .attr("y", 32)
  .attr("rx", 1)
  .attr("width", 5)
  .attr("height", 5)
  .attr("fill", "blue");

svg
  .append("text")
  .attr("x", 89 + 2.5)
  .attr("y", 32 + 2.7)
  .attr("fill", "#fff")
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("font-size", "0.2em")
  .attr("font-weight", "800")
  .text("6");

document.getElementById("app").append(svg.node());
