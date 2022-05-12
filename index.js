const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const inputCols = document.getElementById("inp-cols");
const inputRows = document.getElementById("inp-rows");

const COLS = Number(inputCols.value);
const ROWS = Number(inputRows.value);
const resolution = 20;

canvas.width = COLS * resolution;
canvas.height = ROWS * resolution;

function buildMatrix() {
  return new Array(COLS)
    .fill(null)
    .map(() =>
      new Array(ROWS).fill(null).map(() => Math.floor(Math.random() * 2))
    );
}

let matrix = buildMatrix();

function cycle(i, n) {
  return i < 0 ? n + i : i % n;
}

function computeNextGeneration(prevGen) {
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
      if (cell === 1 && neighboursCount < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && neighboursCount > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && neighboursCount === 3) {
        nextGen[col][row] = 1;
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
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
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
  matrix = computeNextGeneration(matrix);
  render(matrix);
}

let interval;

playBtn.onclick = () => {
  interval = setInterval(update, 500);
  playBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.disabled = true;

stopBtn.onclick = () => {
  stopBtn.disabled = true;
  playBtn.disabled = false;
  clearInterval(interval);
};
