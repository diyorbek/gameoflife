const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const inputCols = document.getElementById("inp-cols");
const inputRows = document.getElementById("inp-rows");
const inputSurvive = document.getElementById("inp-survive");
const inputAlive = document.getElementById("inp-alive");

const cellSize = 40;
let COLS = Number(inputCols.value);
let ROWS = Number(inputRows.value);
let SURVIVE_NEIGBOUR_COUNT = inputSurvive.value.split("-").map(Number);
let ALIVE_NEIGBOUR_COUNT = Number(inputAlive.value);

canvas.width = COLS * cellSize;
canvas.height = ROWS * cellSize;

function buildMatrix(randomize) {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS)
        .fill(null)
        .map(() => (randomize ? Math.floor(Math.random() * 1.3) : 0))
    );
}

let matrix = buildMatrix();

function cycle(i, n) {
  return i < 0 ? n + i : i % n;
}

function computeNextGeneration(prevGen, surviveCounts, aliveCount) {
  const nextGen = prevGen.map((row) => [...row]);

  for (let col = 0; col < prevGen.length; col++) {
    for (let row = 0; row < prevGen[col].length; row++) {
      const cell = prevGen[col][row];
      let neighboursCount = 0;

      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          // ignore the current cell
          if (i === 0 && j === 0) {
            continue;
          }

          const x = cycle(col + i, COLS);
          const y = cycle(row + j, ROWS);

          const currentNeighbour = prevGen[x][y];
          neighboursCount += currentNeighbour;
        }
      }

      // rules
      if (cell === 1) {
        if (!surviveCounts.some((n) => n === neighboursCount)) {
          nextGen[col][row] = 0;
        }
      } else {
        if (neighboursCount === aliveCount) {
          nextGen[col][row] = 1;
        }
      }
    }
  }

  return nextGen;
}

function render(matrix) {
  for (let col = 0; col < matrix.length; col++) {
    for (let row = 0; row < matrix[col].length; row++) {
      const cell = matrix[col][row];

      ctx.beginPath();
      ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.fillStyle = cell ? "black" : "white";
      ctx.fill();

      if (!cell) {
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    }
  }
}

function update() {
  matrix = computeNextGeneration(
    matrix,
    SURVIVE_NEIGBOUR_COUNT,
    ALIVE_NEIGBOUR_COUNT
  );
  render(matrix);
}

let interval;

playBtn.onclick = () => {
  interval = setInterval(update, 500);
  randomizeBtn.disabled = true;
  playBtn.disabled = true;
  inputCols.disabled = true;
  inputRows.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.disabled = true;

stopBtn.onclick = () => {
  stopBtn.disabled = true;
  randomizeBtn.disabled = false;
  playBtn.disabled = false;
  inputCols.disabled = false;
  inputRows.disabled = false;
  clearInterval(interval);
  interval = undefined;
};

canvas.onclick = ({ offsetX, offsetY }) => {
  if (!interval) {
    const row = Math.floor(offsetX / cellSize);
    const col = Math.floor(offsetY / cellSize);
    matrix[row][col] = matrix[row][col] ? 0 : 1;

    render(matrix);
  }
};

randomizeBtn.onclick = () => {
  matrix = buildMatrix(true);
  render(matrix);
};

inputRows.onchange = ({ target }) => {
  ROWS = Number(target.value);
  matrix = buildMatrix();
  canvas.width = COLS * cellSize;
  canvas.height = ROWS * cellSize;
  render(matrix);
};
inputCols.onchange = ({ target }) => {
  COLS = Number(target.value);
  matrix = buildMatrix();
  canvas.width = COLS * cellSize;
  canvas.height = ROWS * cellSize;
  render(matrix);
};
inputSurvive.onchange = ({ target }) => {
  SURVIVE_NEIGBOUR_COUNT = target.value.split("-").map(Number);
};
inputAlive.onchange = ({ target }) => {
  ALIVE_NEIGBOUR_COUNT = Number(target.value);
};

render(matrix);
