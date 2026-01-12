const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let gameActive = true;

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handlePlayerMove(cell, index));
});

function handlePlayerMove(cell, index) {
    if (!gameActive || cell.textContent !== "") return;

    makeMove(cell, "X");

    if (checkWin("X")) {
        endGame("Player wins!");
        return;
    }

    if (isDraw()) {
        endGame("It's a draw!");
        return;
    }

    statusText.textContent = "Computer's turn...";
    setTimeout(computerMove, 500); // delay for realism
}

function computerMove() {
    if (!gameActive) return;

    let emptyCells = [];
    cells.forEach((cell, index) => {
        if (cell.textContent === "") emptyCells.push(index);
    });

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(cells[randomIndex], "O");

    if (checkWin("O")) {
        endGame("Computer wins!");
        return;
    }

    if (isDraw()) {
        endGame("It's a draw!");
        return;
    }

    statusText.textContent = "Player X's turn";
}

function makeMove(cell, player) {
    cell.textContent = player;
    cell.classList.add("played");
}

function checkWin(player) {
    return winPatterns.some(pattern =>
        pattern.every(index => cells[index].textContent === player)
    );
}

function isDraw() {
    return [...cells].every(cell => cell.textContent !== "");
}

function endGame(message) {
    statusText.textContent = message;
    gameActive = false;
}

function restartGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("played");
    });
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";
}
