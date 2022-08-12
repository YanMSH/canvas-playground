const form = document.getElementById("form");
const fillColorInput = document.getElementById("fillColor");
const strokeColorInput = document.getElementById("strokeColor");
const countInput = document.getElementById("countRatio");
const angleInput = document.getElementById("angleRatio");
const maxCountInput = document.getElementById("maxCount");
const maxCountLabel = document.getElementById("maxCountLabel");
const angleLabel = document.getElementById("angleLabel");
const countLabel = document.getElementById("countLabel");
const randomButton = document.getElementById("submitRandom");
const MAX_MAX_COUNT = 1000;
const MAX_COUNT = 5;
const MAX_ANGLE = 3;

class Storage {
  inStore(item) {
    return localStorage.getItem(item) !== null;
  }

  get(item) {
    return localStorage.getItem(item);
  }
  set(item, value) {
    localStorage.setItem(item, value);
  }

  groupSet(object) {
    for (const key in object) {
      this.set(key, object[key].toString());
    }
  }
}

const stor = new Storage();
const getRandom = (sample) => {
  const randomPart = sample[Math.floor(Math.random() * sample.length)];
  return randomPart;
};
const getRandomColor = () => {
  const chars = "0123456789abcdef";
  let color = "#";
  for (let i = 0; i < 6; i += 1) {
    color += getRandom(chars);
  }
  return color;
};
function labelRefresher(rangeLabel, rangeInput) {
  const oldLabel = rangeLabel.innerText;
  rangeLabel.innerText =
    oldLabel.replace(/([0-9]+\.+[0-9])/g, "") + rangeInput.value;
}
const setDefaultRandom = (field, value) => {
  if (!stor.inStore(field)) stor.set(field, value);
};

setDefaultRandom("fillColor", getRandomColor());
setDefaultRandom("strokeColor", getRandomColor());
setDefaultRandom(
  "maxCount",
  Number((Math.random() * MAX_MAX_COUNT).toFixed(0)),
);
setDefaultRandom("count", Number((Math.random() * MAX_COUNT).toFixed(2)));
setDefaultRandom("angle", Number((Math.random() * MAX_ANGLE).toFixed(2)));

maxCountInput.oninput = () => {
  maxCountLabel.innerText = "Max Count: " + maxCountInput.value;
};

countInput.oninput = () => {
  labelRefresher(countLabel, countInput);
};

angleInput.oninput = () => {
  labelRefresher(angleLabel, angleInput);
};

fillColorInput.value = stor.get("fillColor");
strokeColorInput.value = stor.get("strokeColor");
maxCountInput.value = Number(stor.get("maxCount"));
angleInput.value = Number(stor.get("angle"));
countInput.value = Number(stor.get("count"));

maxCountLabel.innerText = "Max Count: " + maxCountInput.value;
maxCountLabel.innerText = "Max Count: " + maxCountInput.value;
countLabel.innerText = "Count Ratio:" + countInput.value;
angleLabel.innerText = "Angle Ratio:" + angleInput.value;

form.onsubmit = (e) => {
  const data = {
    maxCount: maxCountInput.value,
    fillColor: fillColorInput.value,
    strokeColor: strokeColorInput.value,
    count: countInput.value,
    angle: angleInput.value,
  };
  stor.groupSet(data);
};

randomButton.onclick = (e) => {
  e.preventDefault();
  const randomObj = {
    maxCount: Number((Math.random() * MAX_MAX_COUNT).toFixed(0)),
    fillColor: getRandomColor(),
    strokeColor: getRandomColor(),
    count: Number((Math.random() * MAX_COUNT).toFixed(2)),
    angle: Number((Math.random() * MAX_ANGLE).toFixed(2)),
  };
  stor.groupSet(randomObj);
  location.reload();
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = stor.get("fillColor");
ctx.strokeStyle = stor.get("strokeColor");
let count = 0;
let scale = 10;

function draw() {
  let angle = count * Number(stor.get("angle"));
  let radius = scale * Math.sqrt(count);
  let positionX = radius * Math.sin(angle) + canvas.width / 2;
  let positionY = radius * Math.cos(angle) + canvas.height / 2;

  ctx.beginPath();
  ctx.arc(positionX, positionY, 5, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  count += Number(stor.get("count"));
}

function animate() {
  if (count >= Number(stor.get("maxCount"))) return;
  draw();
  window.requestAnimationFrame(animate);
}

animate();
