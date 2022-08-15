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
const MAX_COUNT = 1000;
const MAX_COUNT_RATIO = 5;
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

const store = new Storage();
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

const setDefaultRandom = (field, value) => {
  if (!store.inStore(field)) store.set(field, value);
};

setDefaultRandom("fillColor", getRandomColor());
setDefaultRandom("strokeColor", getRandomColor());
setDefaultRandom("maxCount", Number((Math.random() * MAX_COUNT).toFixed(0)));
setDefaultRandom("count", Number((Math.random() * MAX_COUNT_RATIO).toFixed(2)));
setDefaultRandom("angle", Number((Math.random() * MAX_ANGLE).toFixed(2)));

maxCountInput.oninput = () => {
  maxCountLabel.innerText = "Max Count: " + maxCountInput.value;
};

countInput.oninput = () => {
  countLabel.innerText = "Count Ratio: " + countInput.value;
};

angleInput.oninput = () => {
  angleLabel.innerText = "Angle Ratio: " + angleInput.value;
};

fillColorInput.value = store.get("fillColor");
strokeColorInput.value = store.get("strokeColor");
maxCountInput.value = Number(store.get("maxCount"));
angleInput.value = Number(store.get("angle"));
countInput.value = Number(store.get("count"));

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
  store.groupSet(data);
};

randomButton.onclick = (e) => {
  e.preventDefault();
  const randomObj = {
    maxCount: Number((Math.random() * MAX_COUNT).toFixed(0)),
    fillColor: getRandomColor(),
    strokeColor: getRandomColor(),
    count: Number((Math.random() * MAX_COUNT_RATIO).toFixed(2)),
    angle: Number((Math.random() * MAX_ANGLE).toFixed(2)),
  };
  store.groupSet(randomObj);
  location.reload();
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = store.get("fillColor");
ctx.strokeStyle = store.get("strokeColor");
let count = 0;
let scale = 10;

function draw() {
  let angle = count * Number(store.get("angle"));
  let radius = scale * Math.sqrt(count);
  let positionX = radius * Math.sin(angle) + canvas.width / 2;
  let positionY = radius * Math.cos(angle) + canvas.height / 2;

  ctx.beginPath();
  ctx.arc(positionX, positionY, 5, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  count += Number(store.get("count"));
}

function animate() {
  if (count >= Number(store.get("maxCount"))) return;
  draw();
  window.requestAnimationFrame(animate);
}

animate();
