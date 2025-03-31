// let currentPlayer = "X";
// let array = Array(9).fill(null);

// function checkWinner() {
//     if (
//         (array[0] !== null && array[0] === array[1] && array[1] === array[2]) ||
//         (array[3] !== null && array[3] === array[4] && array[4] === array[5]) ||
//         (array[6] !== null && array[6] === array[7] && array[7] === array[8]) ||
//         (array[0] !== null && array[0] === array[3] && array[3] === array[6]) ||
//         (array[1] !== null && array[1] === array[4] && array[4] === array[7]) ||
//         (array[2] !== null && array[2] === array[5] && array[5] === array[8]) ||
//         (array[0] !== null && array[0] === array[4] && array[4] === array[8]) ||
//         (array[2] !== null && array[2] === array[4] && array[4] === array[6])
//     ) {
//         document.getElementById("result").innerText = `Winner is ${currentPlayer}`;
//         return;
//     }

//     if (!array.includes(null)) {
//         document.getElementById("result").innerText = "It's A Draw";
//         return;
//     }
// }

// function handleClick(el) {
//     const id = Number(el.id);

//     if (array[id] !== null) return;

//     array[id] = currentPlayer;
//     el.innerText = currentPlayer;
    
//     checkWinner();
    
//     currentPlayer = currentPlayer === "X" ? "O" : "X";
// }

let currentPlayer = "X";
let array = Array(9).fill(null);
let gameOver = false;

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
            resultElement.innerHTML = `Winner is Player ${currentPlayer}!`;
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

    array[id] = currentPlayer;
    el.textContent = currentPlayer;
    el.classList.add(currentPlayer.toLowerCase());
    el.classList.add('animated');
    
    checkWinner();
    
    if (!gameOver) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updatePlayerIndicator();
    }
}

function restartGame() {
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

// Initialize player indicator when page loads
window.onload = updatePlayerIndicator;