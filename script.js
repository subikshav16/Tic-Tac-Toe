const cells = document.querySelectorAll(".cell");

const playerScoreElement = document.getElementById("playerScore");
const aiScoreElement = document.getElementById("aiScore");
const drawScoreElement = document.getElementById("drawScore");

const gameStatus = document.getElementById("gameStatus");
const statusMessage = document.getElementById("statusMessage");
const statusIcon = document.getElementById("statusIcon");

const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const thinkingStatus = document.getElementById("thinkingStatus");
const thinkingProgress = document.getElementById("thinkingProgress");

let board = ["", "", "", "", "", "", "", ""];
let playerScore = 0;
let aiScore = 0;
let drawScore = 0;
let gameOver = false;
let playerTurn = true;

const wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function getWinner() {

    for (let combo of wins) {

        let a = combo[0];
        let b = combo[1];
        let c = combo[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}

function isFull() {
    return board.every(cell => cell !== "");
}

function availableMoves(state) {

    let moves = [];

    for (let i = 0; i < 9; i++) {

        if (state[i] === "") {
            moves.push(i);
        }
    }

    return moves;
}

function minimax(state, maximizing) {

    let winner = checkWinner(state);

    if (winner === "O") return 10;
    if (winner === "X") return -10;

    if (state.every(cell => cell !== "")) return 0;

    if (maximizing) {

        let best = -Infinity;

        for (let move of availableMoves(state)) {

            state[move] = "O";

            let score = minimax(state, false);

            state[move] = "";

            best = Math.max(best, score);
        }

        return best;

    } else {

        let best = Infinity;

        for (let move of availableMoves(state)) {

            state[move] = "X";

            let score = minimax(state, true);

            state[move] = "";

            best = Math.min(best, score);
        }

        return best;
    }
}

function checkWinner(state) {

    for (let combo of wins) {

        let [a,b,c] = combo;

        if (
            state[a] !== "" &&
            state[a] === state[b] &&
            state[a] === state[c]
        ) {
            return state[a];
        }
    }

    return null;
}

function findBestMove() {

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let move of availableMoves(board)) {

        board[move] = "O";

        let score = minimax(board, false);

        board[move] = "";

        if (score > bestScore) {

            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

function updateCell(index, symbol) {

    cells[index].textContent = symbol;

    cells[index].classList.remove("x", "o");

    if (symbol === "X") {
        cells[index].classList.add("x");
    } else {
        cells[index].classList.add("o");
    }
}

function playerMove(index) {

    if (gameOver) return;

    if (!playerTurn) return;

    if (board[index] !== "") return;

    board[index] = "X";

    updateCell(index, "X");

    let winner = getWinner();

    if (winner) {

        endGame(winner);
        return;
    }

    if (isFull()) {

        endGame("draw");
        return;
    }

    playerTurn = false;

    gameStatus.textContent = "AI Thinking...";
    statusMessage.textContent = "Min-Max is analyzing the best move";
    statusIcon.textContent = "🧠";

    thinkingStatus.textContent = "Analyzing...";
    thinkingProgress.style.width = "60%";

    cells.forEach(cell => {
        cell.disabled = true;
    });

    setTimeout(aiMove, 600);
}

function aiMove() {

    if (gameOver) return;

    let move = findBestMove();

    if (move === -1) return;

    board[move] = "O";

    updateCell(move, "O");

    let winner = getWinner();

    if (winner) {

        endGame(winner);
        return;
    }

    if (isFull()) {

        endGame("draw");
        return;
    }

    playerTurn = true;

    cells.forEach((cell, index) => {

        cell.disabled = board[index] !== "";

    });

    gameStatus.textContent = "Your Turn";
    statusMessage.textContent = "Choose an empty cell";
    statusIcon.textContent = "🎮";

    thinkingStatus.textContent = "Waiting...";
    thinkingProgress.style.width = "0%";
}

function endGame(result) {

    gameOver = true;

    cells.forEach(cell => {
        cell.disabled = true;
    });

    if (result === "X") {

        playerScore++;

        playerScoreElement.textContent = playerScore;

        gameStatus.textContent = "You Win! 🎉";
        statusMessage.textContent = "You defeated the AI!";
        statusIcon.textContent = "🏆";

    } else if (result === "O") {

        aiScore++;

        aiScoreElement.textContent = aiScore;

        gameStatus.textContent = "AI Wins 🤖";
        statusMessage.textContent = "Min-Max found the winning move.";
        statusIcon.textContent = "🧠";

    } else {

        drawScore++;

        drawScoreElement.textContent = drawScore;

        gameStatus.textContent = "It's a Draw!";
        statusMessage.textContent = "Nobody won this round.";
        statusIcon.textContent = "🤝";
    }

    thinkingStatus.textContent = "Game Complete";
    thinkingProgress.style.width = "100%";
}

function newGame() {

    board = ["", "", "", "", "", "", "", ""];

    gameOver = false;
    playerTurn = true;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x", "o", "win");

        cell.disabled = false;
    });

    gameStatus.textContent = "Your Turn";
    statusMessage.textContent = "Choose an empty cell to make your move";
    statusIcon.textContent = "🎮";

    thinkingStatus.textContent = "Waiting...";
    thinkingProgress.style.width = "0%";
}

function resetScores() {

    playerScore = 0;
    aiScore = 0;
    drawScore = 0;

    playerScoreElement.textContent = "0";
    aiScoreElement.textContent = "0";
    drawScoreElement.textContent = "0";

    newGame();
}

cells.forEach(cell => {

    cell.addEventListener("click", function() {

        let index = Number(this.dataset.index);

        playerMove(index);

    });

});

newGameBtn.addEventListener("click", newGame);

resetScoreBtn.addEventListener("click", resetScores);

newGame();