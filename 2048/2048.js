const boardSize = 4;
let board = [];
let score = 0;

const tileSize = 80;
const tileGap = 5;

const gameBoard = document.getElementById("game-board");
const status = document.getElementById("game-status");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart");

function initBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    updateScore(0);
    status.textContent = "";
    addRandomTile();
    addRandomTile();
    drawBoard();
    document.addEventListener("keydown", handleKey);
}

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `Счёт: ${score}`;
}

function drawBoard() {
    gameBoard.innerHTML = "";
    for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
        const value = board[r][c];
        if (value !== 0) {
        const tile = document.createElement("div");
        tile.className = "tile new";
        tile.textContent = value;
        tile.dataset.value = value;

        tile.style.top = `${r * (tileSize + tileGap)}px`;
        tile.style.left = `${c * (tileSize + tileGap)}px`;

        gameBoard.appendChild(tile);
        }
    }
    }
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
        if (board[r][c] === 0) emptyCells.push([r, c]);
    }
    }
    if (emptyCells.length === 0) return;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function compress(row) {
    let newRow = row.filter(v => v !== 0);
    while (newRow.length < boardSize) newRow.push(0);
    return newRow;
}

function merge(row) {
    for (let i = 0; i < boardSize - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        updateScore(row[i]);
    }
    }
    return row;
}

function moveLeft() {
    let changed = false;
    for (let r = 0; r < boardSize; r++) {
    let row = board[r];
    let compressed = compress(row);
    let merged = merge(compressed);
    let newRow = compress(merged);
    if (row.toString() !== newRow.toString()) changed = true;
    board[r] = newRow;
    }
    return changed;
}

function rotateClockwise(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function rotateCounterClockwise(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[row.length - 1 - i]));
}

function move(direction) {
    let changed = false;

    if (direction === "left" ) {
    changed = moveLeft();
    } else if (direction === "right") {
    board = board.map(row => row.reverse());
    changed = moveLeft();
    board = board.map(row => row.reverse());
    } else if (direction === "down") {
    board = rotateClockwise(board);
    changed = moveLeft();
    board = rotateCounterClockwise(board);
    } else if (direction === "up") {
    board = rotateCounterClockwise(board);
    changed = moveLeft();
    board = rotateClockwise(board);
    }

    if (changed) {
    addRandomTile();
    drawBoard();
    if (GameOver()) {
        status.textContent = "Игра окончена, начните заново.";
        document.removeEventListener("keydown", handleKey);
    }
    }
}

function GameOver() {
    for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
        if (board[r][c] === 0) return false;
        if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
        if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
    }
    }
    return true;
}

function handleKey(e) {
    switch (e.key) {
    case "ArrowLeft":
    case "ф":
    case "Ф":
    case "a":
    case "A": move("left"); break;
    case "ArrowRight":
    case "в":
    case "В": 
    case "d":
    case "D": move("right"); break;
    case "ArrowUp":
    case "ц":
    case "Ц":
    case "w":
    case "W": move("up"); move("up"); break;
    case "ArrowDown":
    case "ы":
    case "Ы":
    case "s":
    case "S": move("down"); break;
    }
}

restartBtn.addEventListener("click", () => {
    initBoard();
});

initBoard();