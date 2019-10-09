let playerChoice = null;
let computerChoice;

// Setup Start Button
let startButton = document.getElementById('startButton');
startButton.addEventListener("click", startGame, true);

// Add Event Listener To Pick Your President Options
// Set characters 
let obama = document.getElementById('Obama');
obama.addEventListener('click', characterSelect);

let trump = document.getElementById('Trump');
trump.addEventListener('click', characterSelect);


// Details about the Character options. 
let characters = {

    Obama: {
        color: "#2452d8",
        name: "OBAMA",
        isPlayer: true,
        score: 0,
        characterFill: "url(#ObamaPattern)"
    },

    Trump: {
        color: "#f4365b",
        name: "TRUMP",
        isPlayer: false,
        score: 0,
        characterFill: "url(#TrumpPattern)"
    }
};

let playerOne;
let playerTwo;
let currentPlayer;


let gameBoard = [
    0, 1, 2, 3, 4, 5, 6, 7, 8
];
console.log("gameBoard: " + gameBoard);

let gameBoardCopy = gameBoard.slice(0);
console.log("gameBoardCopy: " + gameBoardCopy);

let winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let winningCombosMatch =
    [
        [gameBoard[0], gameBoard[1], gameBoard[2]],
        [gameBoard[3], gameBoard[4], gameBoard[5]],
        [gameBoard[6], gameBoard[7], gameBoard[8]],
        [gameBoard[0], gameBoard[3], gameBoard[6]],
        [gameBoard[1], gameBoard[4], gameBoard[7]],
        [gameBoard[2], gameBoard[5], gameBoard[8]],
        [gameBoard[0], gameBoard[4], gameBoard[8]],
        [gameBoard[2], gameBoard[4], gameBoard[6]]
    ];


let winningCells = [];

function upDateWinningCombos(currentBoard) {

    winningCombosMatch =
        [
            [currentBoard[0], currentBoard[1], currentBoard[2]],
            [currentBoard[3], currentBoard[4], currentBoard[5]],
            [currentBoard[6], currentBoard[7], currentBoard[8]],
            [currentBoard[0], currentBoard[3], currentBoard[6]],
            [currentBoard[1], currentBoard[4], currentBoard[7]],
            [currentBoard[2], currentBoard[5], currentBoard[8]],
            [currentBoard[0], currentBoard[4], currentBoard[8]],
            [currentBoard[2], currentBoard[4], currentBoard[6]]
        ];

    console.log("Inside the UpdateWinningCombos Function: " + winningCombosMatch)
};



// On start, player must select a President.
function characterSelect() {

    let character = this.id;
    console.log(character);

    // Set Green Border to #fff each time a character is clicked accounts for an unsure player
    document.getElementById('borderObama').style.fill = '#fff';
    document.getElementById('borderTrump').style.fill = '#fff';

    // Apply Green Border to character to inidicate current selected President
    document.getElementById('border' + character).style.fill = '#00ff00';

    // Set up initial players
    playerChoice = character;
    currentPlayer = character;
    computerChoice = (playerChoice === "Obama") ? "Trump" : "Obama";
};


// // Setup game board. Ensure cells are blank and event listeners attached.
function setUpBoard() {
    // Ensure gameboard is blank (#fff) and Add Event Listener for Taking Turn
    for (let i = 0; i < gameBoard.length; i++) {
        document.getElementById("_" + i).style.fill = "#fff";
        gameBoard[i] = i;
        document.getElementById('_' + i).addEventListener("click", takeTurn, true);

        let cellBorders = document.getElementsByClassName('cellBorder');
        for (let i = 0; i < cellBorders.length; i++) {
            let element = cellBorders[i];
            element.style.fill = "none";
        }
    };

    currentPlayer = playerChoice;
    return true;
};


// Start game when Start Button is pressed.
function startGame() {


    setUpBoard();

    document.getElementById("playerName").classList.remove("nameAdjust");
    document.getElementById("computerName").classList.remove("nameAdjust");

    // Ensure a President has been selected, if not, prompt user they need to select first.
    if (playerChoice === null) {
        return alert("You need to select a President");
    };

    // Hide pickYourPresident and UnHide gameBoard
    document.getElementById("pickYourPresident").style.visibility = "hidden";
    document.getElementById("winMessage").style.visibility = "hidden";
    document.getElementById("loseMessage").style.visibility = "hidden";
    document.getElementById("tieMessage").style.visibility = "hidden";
    document.getElementById("gameBoard").style.visibility = "visible";

    // Set Score Area - Names and Colors - Changes depending on selected President
    document.getElementById("playerName").textContent = characters[playerChoice].name;
    document.getElementById("playerColor").style.fill = characters[playerChoice].color;
    document.getElementById("computerName").textContent = characters[computerChoice].name;
    document.getElementById("computerColor").style.fill = characters[computerChoice].color;

    // Setup Replay
    let elementsCharacterFill = document.getElementsByClassName('selectedPresident');
    for (let i = 1; i < elementsCharacterFill.length; i++) {
        let element = elementsCharacterFill[i];
        element.style.fill = characters[playerChoice].characterFill;
    };

    let replayButtons = document.getElementsByClassName('startButton');
    for (let i = 0; i < replayButtons.length; i++) {
        let element = replayButtons[i];
        element.addEventListener("click", startGame);
    };
};

function takeTurn(cell) {
    let cellNumber;

    if (currentPlayer === computerChoice) {
        cellNumber = cell;
        cell = "_" + cellNumber;
    } else {
        // Get the Cell
        cell = this.id;
        cellNumber = Number(cell.charAt(1));
        console.log(cellNumber);
    }
    console.log(cell);
    console.log("CellNumber: " + cellNumber);


    // Get Cell Number

    // Check to see if cell is available, and fill with President
    if (!isNaN(gameBoard[cellNumber])) {
        document.getElementById(cell).style.fill = characters[currentPlayer].characterFill;
        gameBoard[cellNumber] = currentPlayer;
        document.getElementById(cell).removeEventListener("click", takeTurn, true);
    };

    // Check to see if game has been won.
    upDateWinningCombos(gameBoard);

    //hasBeenWon();

    if (winning(gameBoard, currentPlayer)) {
        if (currentPlayer === playerChoice) {
            let index = hasBeenWon();
            weHaveAWinner(index);
        } else {
            let index = hasBeenWon();
            weHaveALoser(index);
        };
    } else {
        if (emptyIndexies(gameBoard).length === 0) {
            weHaveATie();
        }
    }

    nextTurn(currentPlayer);
};

function nextTurn(player) {
    // Change players
    if (playerChoice === player) {
        currentPlayer = computerChoice;

        let randomNumber = (Math.random());
        console.log("Random Number: " + randomNumber);

        if (randomNumber > .2) {

            // Calls the minimax function to find AI's best spot to play
            let bestSpot = minimax(gameBoard, computerChoice);
            // Returns (Calls) the Take Turn Function using the best spot index to make move
            return takeTurn(bestSpot.index);
        } else {
            let availSpots = emptyIndexies(gameBoard);
            console.log("aval " + availSpots);
            let randomIndex = Math.floor(Math.random() * (availSpots.length));
            console.log(randomIndex);
            return takeTurn(availSpots[randomIndex]);
        }





    } else {

        // Just sets the player as current, leaving Take Turn open.
        currentPlayer = playerChoice;
    };
};

function minimax(newBoard, player) {
    /* This function is code from
    https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
    and is modified to work with my code for the game. This code was largely unchanged.
    */

    // Available spots
    let availSpots = emptyIndexies(newBoard);

    // Checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(newBoard, playerChoice)) {
        return { score: -10 };
    }
    else if (winning(newBoard, computerChoice)) {
        return { score: 10 };
    }
    else if (availSpots.length === 0) {
        return { score: 0 };
    }

    // An array to collect all the objects
    let moves = [];

    // Loop through available spots
    for (let i = 0; i < availSpots.length; i++) {

        // Create an object for each and store the index of that spot that was stored as a number in the object's index key
        let move = {};
        move.index = newBoard[availSpots[i]];

        // Set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        // If collect the score resulted from calling minimax on the opponent of the current player
        if (player == computerChoice) {
            let result = minimax(newBoard, playerChoice);
            move.score = result.score;
        }
        else {
            let result = minimax(newBoard, computerChoice);
            move.score = result.score;
        }

        // Reset the spot to empty
        newBoard[availSpots[i]] = move.index;

        // Push the object to the array
        moves.push(move);
    }

    // If it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove;
    if (player === computerChoice) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {

        // Else loop over the moves and choose the move with the lowest score
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // Return the chosen move (object) from the array to the higher depth
    return moves[bestMove];
}



function hasBeenWon() {
    for (let i = 0; i < winningCombosMatch.length; i++) {
        if (winningCombosMatch[i][0] === currentPlayer && winningCombosMatch[i][1] === currentPlayer && winningCombosMatch[i][2] === currentPlayer) {
            return winningCombosMatch.indexOf(winningCombosMatch[i]);
        }
    }
};


function weHaveAWinner(index) {

    document.getElementById('gameBoard').style.cursor = "initial";

    for (let i = 0; i < gameBoard.length; i++) {
        document.getElementById('_' + i).removeEventListener("click", takeTurn, true);
    };

    winningCells = (winningCombos[index]);
    for (let i = 0; i < winningCells.length; i++) {
        document.getElementById("_" + winningCells[i] + "Border").style.fill = "#00ff00";
    }

    characters[playerChoice].score++;
    document.getElementById("playerScore").classList.remove("scoreAdjust");

    document.getElementById("playerScore").textContent = characters[playerChoice].score;

    setTimeout(function () {
        document.getElementById('winMessage').style.visibility = "visible";

    }, 700);
};


function weHaveALoser(index) {

    document.getElementById('gameBoard').style.cursor = "initial";

    for (let i = 0; i < gameBoard.length; i++) {
        document.getElementById('_' + i).removeEventListener("click", takeTurn, true);
    };

    winningCells = (winningCombos[index]);

    for (let i = 0; i < winningCells.length; i++) {
        document.getElementById("_" + winningCells[i] + "Border").style.fill = "#00ff00";
    }

    characters[computerChoice].score++;
    document.getElementById("computerScore").classList.remove("scoreAdjust");

    document.getElementById("computerScore").textContent = characters[computerChoice].score;

    setTimeout(function () {
        document.getElementById('loseMessage').style.visibility = "visible";

    }, 700);
};

function weHaveATie() {
    document.getElementById('gameBoard').style.cursor = "initial";

    for (let i = 0; i < gameBoard.length; i++) {
        document.getElementById('_' + i).removeEventListener("click", takeTurn, true);
    };

    setTimeout(function () {
        document.getElementById('tieMessage').style.visibility = "visible";

    }, 300);

};



// Returns the available spots on the board
function emptyIndexies(board) {
    return board.filter(s => s != "Obama" && s != "Trump");
}

// Winning combinations using the board indexies for instace the first win could be 3 in a row
function winning(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
};

function setGAInformation() {
    //console.log(`ga(‘send’, ‘event’, 'President', 'Start Game', '${playerChoice}',,);`);
    //onclick = "ga('send', 'event', 'President', 'Start Game', 'Obama')"
    //onclick = "ga('send', 'event', 'President', 'Start Game', 'Trump')"
    return `ga('send', 'event', 'President', 'Start Game', '${playerChoice}')`
};


function showHideGameInformation() {
    let gameDisplay = document.getElementById('gameAreaDiv');
    let infoDisplay = document.getElementById('informationDiv')

    // if (gameDisplay.style.visibility === 'visible') {
    //     gameDisplay.style.visibility = "hidden";
    //     infoDisplay.style.visibility = "visible";
    // } else {
    //     infoDisplay.style.visibility = "hidden";
    //     gameDisplay.style.visibility = "visible";
    // };    

    if (gameDisplay.classList.contains("showThis")) {
        gameDisplay.className = "hideThis";
        infoDisplay.className = "showThis";
    } else {
        infoDisplay.className = "hideThis";
        gameDisplay.className = "showThis";
    }


};