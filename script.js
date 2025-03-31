// let currentPlayer = "X";
// let array = Array(9).fill(null);
// let gameOver = false;


// function playwithComputer(){
    
// }

// // Update UI to reflect current player
// function updatePlayerIndicator() {
//     const playerXInfo = document.querySelector('.player-x');
//     const playerOInfo = document.querySelector('.player-o');
    
//     if (currentPlayer === "X") {
//         playerXInfo.classList.add('active');
//         playerOInfo.classList.remove('active');
//     } else {
//         playerXInfo.classList.remove('active');
//         playerOInfo.classList.add('active');
//     }
// }

// function checkWinner() {
//     if (gameOver) return;
    
//     const winPatterns = [
//         [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
//         [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
//         [0, 4, 8], [2, 4, 6]             // diagonals
//     ];
    
//     for (const pattern of winPatterns) {
//         const [a, b, c] = pattern;
//         if (array[a] !== null && array[a] === array[b] && array[b] === array[c]) {
//             gameOver = true;
//             const resultElement = document.getElementById("result");
//             resultElement.innerHTML = `Winner is Player ${currentPlayer}!`;
//             resultElement.className = `visible winner-${currentPlayer.toLowerCase()}`;
            
//             // Highlight winning cells
//             document.getElementById(a.toString()).style.backgroundColor = currentPlayer === "X" ? "#d6eaf8" : "#fadbd8";
//             document.getElementById(b.toString()).style.backgroundColor = currentPlayer === "X" ? "#d6eaf8" : "#fadbd8";
//             document.getElementById(c.toString()).style.backgroundColor = currentPlayer === "X" ? "#d6eaf8" : "#fadbd8";
            
//             document.querySelector('.btn-restart').classList.add('visible');
//             return;
//         }
//     }

//     if (!array.includes(null)) {
//         gameOver = true;
//         const resultElement = document.getElementById("result");
//         resultElement.innerHTML = "It's A Draw!";
//         resultElement.className = "visible draw";
//         document.querySelector('.btn-restart').classList.add('visible');
//         return;
//     }
// }

// function handleClick(el) {
//     const id = Number(el.id);

//     if (array[id] !== null || gameOver) return;

//     array[id] = currentPlayer;
//     el.textContent = currentPlayer;
//     el.classList.add(currentPlayer.toLowerCase());
//     el.classList.add('animated');
    
//     checkWinner();
    
//     if (!gameOver) {
//         currentPlayer = currentPlayer === "X" ? "O" : "X";
//         updatePlayerIndicator();
//     }
// }

// function restartGame() {
//     array = Array(9).fill(null);
//     gameOver = false;
//     currentPlayer = "X";
    
//     const cells = document.querySelectorAll('.col');
//     cells.forEach(cell => {
//         cell.textContent = '';
//         cell.style.backgroundColor = '';
//         cell.classList.remove('x', 'o', 'animated');
//     });
    
//     document.getElementById("result").className = '';
//     document.querySelector('.btn-restart').classList.remove('visible');
//     updatePlayerIndicator();
// }

// // Initialize player indicator when page loads
// window.onload = updatePlayerIndicator;

let currentPlayer = "X";
let array = Array(9).fill(null);
let gameOver = false;
let gameMode = "friends"; // Default game mode
let computerMoveTimeout; // To store the timeout for computer moves

// Play with computer mode
function playWithComputer(btn) {
    // Remove active class from all mode buttons
    document.querySelectorAll('.mode-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to the clicked button
    btn.classList.add('active');
    
    // Set game mode to computer
    gameMode = 'computer';
    
    // Reset the game
    restartGame();
}

// Play with friends mode
function playWithFriends(btn) {
    // Remove active class from all mode buttons
    document.querySelectorAll('.mode-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to the clicked button
    btn.classList.add('active');
    
    // Set game mode to friends
    gameMode = 'friends';
    
    // Reset the game
    restartGame();
}

// Computer makes a move
function makeComputerMove() {
    if (gameOver || currentPlayer === "X") return;
    
    // Clear any existing timeouts
    if (computerMoveTimeout) {
        clearTimeout(computerMoveTimeout);
    }
    
    // Add a small delay to make it seem like the computer is "thinking"
    computerMoveTimeout = setTimeout(() => {
        // First check if computer can win
        const winMove = findWinningMove("O");
        if (winMove !== -1) {
            makeMove(winMove);
            return;
        }
        
        // Then check if player can win and block
        const blockMove = findWinningMove("X");
        if (blockMove !== -1) {
            makeMove(blockMove);
            return;
        }
        
        // Try to take center if available
        if (array[4] === null) {
            makeMove(4);
            return;
        }
        
        // Try to take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => array[i] === null);
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            makeMove(randomCorner);
            return;
        }
        
        // Take any available space
        const availableSpaces = array.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (availableSpaces.length > 0) {
            const randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
            makeMove(randomSpace);
        }
    }, 600);
}

// Find winning move for a player
function findWinningMove(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        // Check if two spots have player's mark and third is empty
        if (array[a] === player && array[b] === player && array[c] === null) {
            return c;
        }
        if (array[a] === player && array[c] === player && array[b] === null) {
            return b;
        }
        if (array[b] === player && array[c] === player && array[a] === null) {
            return a;
        }
    }
    return -1;
}

// Make a move at the specified position
function makeMove(position) {
    const cell = document.getElementById(position.toString());
    if (array[position] === null && !gameOver) {
        array[position] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        cell.classList.add('animated');
        
        checkWinner();
        
        if (!gameOver) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updatePlayerIndicator();
            
            // If it's computer's turn, make computer move
            if (gameMode === "computer" && currentPlayer === "O") {
                makeComputerMove();
            }
        }
    }
}

// Update UI to reflect current player
function updatePlayerIndicator() {
    const playerXInfo = document.querySelector('.player-x');
    const playerOInfo = document.querySelector('.player-o');
    
    if (currentPlayer === "X") {
        playerXInfo.classList.add('active');
        playerOInfo.classList.remove('active');
    } else {
        playerXInfo.classList.remove('active');
        playerOInfo.classList.add('active');
    }
}

function checkWinner() {
    if (gameOver) return;
    
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (array[a] !== null && array[a] === array[b] && array[b] === array[c]) {
            gameOver = true;
            const resultElement = document.getElementById("result");
            
            // Customize message based on game mode
            if (gameMode === "computer" && currentPlayer === "O") {
                resultElement.innerHTML = "Computer Wins!";
            } else if (gameMode === "computer" && currentPlayer === "X") {
                resultElement.innerHTML = "You Win!";
            } else {
                resultElement.innerHTML = `Player ${currentPlayer} Wins!`;
            }
            
            resultElement.className = `visible winner-${currentPlayer.toLowerCase()}`;
            
            // Highlight winning cells
            document.getElementById(a.toString()).style.backgroundColor = currentPlayer === "X" ? "#d6eaf8" : "#fadbd8";
            document.getElementById(b.toString()).style.backgroundColor = currentPlayer === "X" ? "#d6eaf8" : "#fadbd8";
            document.getElementById(c.toString()).style.backgroundColor = currentPlayer === "X" ? "#d6eaf8" : "#fadbd8";
            
            document.querySelector('.btn-restart').classList.add('visible');
            return;
        }
    }

    if (!array.includes(null)) {
        gameOver = true;
        const resultElement = document.getElementById("result");
        resultElement.innerHTML = "It's A Draw!";
        resultElement.className = "visible draw";
        document.querySelector('.btn-restart').classList.add('visible');
        return;
    }
}

function handleClick(el) {
    const id = Number(el.id);

    if (array[id] !== null || gameOver) return;
    
    // If it's computer's turn, don't allow player to click
    if (gameMode === "computer" && currentPlayer === "O") return;

    // Make the move
    array[id] = currentPlayer;
    el.textContent = currentPlayer;
    el.classList.add(currentPlayer.toLowerCase());
    el.classList.add('animated');
    
    checkWinner();
    
    if (!gameOver) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updatePlayerIndicator();
        
        // If it's computer's turn, make computer move
        if (gameMode === "computer" && currentPlayer === "O") {
            makeComputerMove();
        }
    }
}

function restartGame() {
    // Clear any pending computer moves
    if (computerMoveTimeout) {
        clearTimeout(computerMoveTimeout);
    }
    
    array = Array(9).fill(null);
    gameOver = false;
    currentPlayer = "X";
    
    const cells = document.querySelectorAll('.col');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
        cell.classList.remove('x', 'o', 'animated');
    });
    
    document.getElementById("result").className = '';
    document.querySelector('.btn-restart').classList.remove('visible');
    updatePlayerIndicator();
}

// Initialize game when page loads
window.onload = function() {
    updatePlayerIndicator();
    // Set friends mode as default
    document.querySelector('.mode-btn.friends').classList.add('active');
};