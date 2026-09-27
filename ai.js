// ==========================================
// AI TIC-TAC-TOE - MIN-MAX AI ENGINE
// ==========================================

const HUMAN = "X";
const AI = "O";

// All possible winning combinations
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// ------------------------------------------
// Check Winner
// ------------------------------------------

function getWinner(board) {

    for (const combination of WINNING_COMBINATIONS) {

        const [a, b, c] = combination;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}


// ------------------------------------------
// Check Draw
// ------------------------------------------

function isBoardFull(board) {

    return board.every(cell => cell !== "");
}


// ------------------------------------------
// Get Available Moves
// ------------------------------------------

function getAvailableMoves(board) {

    const moves = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {
            moves.push(i);
        }
    }

    return moves;
}


// ------------------------------------------
// Min-Max Algorithm
// ------------------------------------------

function minimax(board, depth, maximizingPlayer) {

    const winner = getWinner(board);

    // AI wins
    if (winner === AI) {
        return 10 - depth;
    }

    // Human wins
    if (winner === HUMAN) {
        return depth - 10;
    }

    // Draw
    if (isBoardFull(board)) {
        return 0;
    }


    // AI's turn - MAXIMIZE score
    if (maximizingPlayer) {

        let bestScore = -Infinity;

        const availableMoves = getAvailableMoves(board);

        for (const move of availableMoves) {

            board[move] = AI;

            const score = minimax(
                board,
                depth + 1,
                false
            );

            board[move] = "";

            bestScore = Math.max(
                bestScore,
                score
            );
        }

        return bestScore;
    }


    // Human's turn - MINIMIZE score
    else {

        let bestScore = Infinity;

        const availableMoves = getAvailableMoves(board);

        for (const move of availableMoves) {

            board[move] = HUMAN;

            const score = minimax(
                board,
                depth + 1,
                true
            );

            board[move] = "";

            bestScore = Math.min(
                bestScore,
                score
            );
        }

        return bestScore;
    }
}


// ------------------------------------------
// Find Best AI Move
// ------------------------------------------

function findBestMove(board) {

    let bestScore = -Infinity;
    let bestMove = -1;

    const availableMoves = getAvailableMoves(board);

    for (const move of availableMoves) {

        board[move] = AI;

        const score = minimax(
            board,
            0,
            false
        );

        board[move] = "";

        if (score > bestScore) {

            bestScore = score;
            bestMove = move;
        }
    }

    return {
        move: bestMove,
        score: bestScore
    };
}


// ------------------------------------------
// AI Analysis Information
// ------------------------------------------

function getAIDecision(board) {

    const result = findBestMove([...board]);

    return {
        move: result.move,
        score: result.score,
        algorithm: "MIN-MAX",
        symbol: AI
    };
}