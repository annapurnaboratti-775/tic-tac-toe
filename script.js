const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const strike = document.getElementById("strike");

let currentPlayer = "X";
let gameActive = false;
let gameMode = "";

const winPatterns = [
    { combo: [0,1,2], line: "row1" },
    { combo: [3,4,5], line: "row2" },
    { combo: [6,7,8], line: "row3" },
    { combo: [0,3,6], line: "col1" },
    { combo: [1,4,7], line: "col2" },
    { combo: [2,5,8], line: "col3" },
    { combo: [0,4,8], line: "diag1" },
    { combo: [2,4,6], line: "diag2" }
];

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(cell, index));
});

function setMode(mode) {
    gameMode = mode;
    restartGame();
    gameActive = true;
    statusText.textContent = "Player X's turn";
}

function handleClick(cell, index) {
    if (!gameActive || cell.textContent !== "") return;

    makeMove(cell, currentPlayer);

    const winData = checkWin(currentPlayer);
    if (winData) {
        drawStrike(winData);
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let emptyCells = [];
    cells.forEach((cell, i) => {
        if (cell.textContent === "") emptyCells.push(i);
    });

    const index = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(cells[index], "O");

    const winData = checkWin("O");
    if (winData) {
        drawStrike(winData);
        statusText.textContent = "Computer Wins!";
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
}

function makeMove(cell, player) {
    cell.textContent = player;
    cell.classList.add("played");
}

function checkWin(player) {
    for (let pattern of winPatterns) {
        if (pattern.combo.every(i => cells[i].textContent === player)) {
            return pattern.line;
        }
    }
    return null;
}

function drawStrike(type) {
    const map = {
        row1: { width: "100%", top: "50px" },
        row2: { width: "100%", top: "155px" },
        row3: { width: "100%", top: "260px" },
        col1: { width: "300px", top: "150px", rotate: "90deg", left: "-100px" },
        col2: { width: "300px", top: "150px", rotate: "90deg", left: "5px" },
        col3: { width: "300px", top: "150px", rotate: "90deg", left: "110px" },
        diag1:{ width: "350px", rotate: "45deg" },
        diag2:{ width: "350px", rotate: "-45deg" }
    };

    Object.assign(strike.style, map[type], { width: map[type].width });
}

function isDraw() {
    return [...cells].every(cell => cell.textContent !== "");
}

function restartGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("played");
    });
    strike.style.width = "0";
    currentPlayer = "X";
    gameActive = false;
    statusText.textContent = "Choose a mode to start";
}
