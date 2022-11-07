const form = document.getElementById('form');
const fillColorInput = document.getElementById('fillColor');
const strokeColorInput = document.getElementById('strokeColor');
const countInput = document.getElementById('countRatio');
const angleInput = document.getElementById('angleRatio');
const maxCountInput = document.getElementById('maxCount');
const elementSizeInput = document.getElementById('elementSize');
const elementShapeInput = document.getElementById('elementShape');
const maxCountLabel = document.getElementById('maxCountLabel');
const angleLabel = document.getElementById('angleLabel');
const countLabel = document.getElementById('countLabel');
const elementSizeLabel = document.getElementById('elementSizeLabel');
const randomButton = document.getElementById('submitRandom');
const MAX_COUNT = 1000;
const MAX_COUNT_RATIO = 5;
const MAX_ANGLE = 3;
const MAX_ELEMENT_SIZE = 12;
let timerId;
function debounce(func, delay) {
  clearTimeout(timerId);

  timerId = setTimeout(func, delay);
}

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
  const chars = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += getRandom(chars);
  }
  return color;
};

const setDefaultRandom = (field, value) => {
  if (!store.inStore(field)) store.set(field, value);
};

setDefaultRandom('fillColor', getRandomColor());
setDefaultRandom('strokeColor', getRandomColor());
setDefaultRandom('maxCount', Number((Math.random() * MAX_COUNT).toFixed(0)));
setDefaultRandom('count', Number((Math.random() * MAX_COUNT_RATIO).toFixed(2)));
setDefaultRandom('angle', Number((Math.random() * MAX_ANGLE).toFixed(2)));
setDefaultRandom('elementSize', Number((Math.random() * MAX_ELEMENT_SIZE).toFixed(0)));
setDefaultRandom('elementShape', 'circle');

fillColorInput.value = store.get('fillColor');
strokeColorInput.value = store.get('strokeColor');
maxCountInput.value = Number(store.get('maxCount'));
angleInput.value = Number(store.get('angle'));
countInput.value = Number(store.get('count'));
elementSizeInput.value = Number(store.get('elementSize'));

maxCountLabel.innerText = 'Max Count: ' + maxCountInput.value;
maxCountLabel.innerText = 'Max Count: ' + maxCountInput.value;
countLabel.innerText = 'Count Ratio: ' + countInput.value;
angleLabel.innerText = 'Angle Ratio: ' + angleInput.value;
elementSizeLabel.innerText = 'Element Size: ' + elementSizeInput.value;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const fillColor = store.get('fillColor');
const strokeColor = store.get('strokeColor');
ctx.fillStyle = fillColor;
ctx.strokeStyle = strokeColor;
let count = 0;
let scale = 10;

function drawElement() {
  let angle = count * Number(store.get('angle'));
  let radius = scale * Math.sqrt(count);
  const elementSize = store.get('elementSize');
  const elementShape = store.get('elementShape');
  let positionX = radius * Math.sin(angle) + canvas.width / 2;
  let positionY = radius * Math.cos(angle) + canvas.height / 2;

  ctx.beginPath();
  elementShape === 'circle'
    ? ctx.arc(positionX, positionY, elementSize, 0, Math.PI * 2)
    : ctx.rect(positionX, positionY, elementSize, elementSize);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  count += Number(store.get('count'));
}
function drawSpiral(fromListener) {
  if (count >= Number(store.get('maxCount'))) return;
  drawElement();
  drawSpiral();
  if (fromListener) {
    ctx.fillStyle = store.get('fillColor');
    ctx.strokeStyle = store.get('strokeColor');
  }
}
function animate() {
  if (count >= Number(store.get('maxCount'))) return;
  drawElement();
  window.requestAnimationFrame(animate);
}

function clearCanvas() {
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function formSubmitHandler() {
  //e.preventDefault();
  clearCanvas();
  const data = {
    maxCount: maxCountInput.value,
    fillColor: fillColorInput.value,
    strokeColor: strokeColorInput.value,
    count: countInput.value,
    angle: angleInput.value,
    elementSize: elementSizeInput.value,
    elementShape: elementShapeInput.value,
  };
  store.groupSet(data);
  drawSpiral();
}

form.onsubmit = (e) => {
  e.preventDefault();
  formSubmitHandler();
};

randomButton.onclick = (e) => {
  e.preventDefault();
  const randomObj = {
    maxCount: Number((Math.random() * MAX_COUNT).toFixed(0)),
    fillColor: getRandomColor(),
    strokeColor: getRandomColor(),
    count: Number((Math.random() * MAX_COUNT_RATIO).toFixed(2)),
    angle: Number((Math.random() * MAX_ANGLE).toFixed(2)),
    elementSize: Number((Math.random() * MAX_ELEMENT_SIZE).toFixed(0)),
  };
  store.groupSet(randomObj);
  location.reload();
};

maxCountInput.oninput = () => {
  maxCountLabel.innerText = 'Max Count: ' + maxCountInput.value;
  debounce(formSubmitHandler, 10);
};

countInput.oninput = () => {
  countLabel.innerText = 'Count Ratio: ' + countInput.value;
  debounce(formSubmitHandler, 10);
};

angleInput.oninput = () => {
  angleLabel.innerText = 'Angle Ratio: ' + angleInput.value;
  debounce(formSubmitHandler, 10);
};
elementSizeInput.oninput = () => {
  elementSizeLabel.innerText = 'Element Size: ' + elementSizeInput.value;
  debounce(formSubmitHandler, 10);
};
elementShapeInput.onchange = formSubmitHandler;

colorChangeHandler = (e) => {
  clearCanvas();
  e.target === fillColorInput
    ? (ctx.fillStyle = e.target.value)
    : (ctx.strokeStyle = e.target.value);
  drawSpiral();
};

// fillColorInput.onchange = (e) => {
//   ctx.fillStyle = fillColorInput.value;
//   console.log('element: ', e.target);
//   console.log(e.target === fillColorInput);
//   clearCanvas();
//   drawSpiral();
//   //formSubmitHandler();
// };

fillColorInput.oninput = (e) => {
  debounce(colorChangeHandler.bind(null, e), 10);
};
strokeColorInput.oninput = (e) => {
  debounce(colorChangeHandler.bind(null, e), 10);
};
window.addEventListener('resize', () => {
  clearCanvas();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawSpiral(true);
  // ctx.fillStyle = store.get('fillColor');
  console.log('fillColor', ctx.fillStyle);
  console.log('strokeColor', ctx.strokeStyle);
});
drawSpiral();
