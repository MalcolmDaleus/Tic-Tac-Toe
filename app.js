"use strict";

// ****** DECLARATIONS ******

// Initializing DOM elements as variables for ease of use
const startButton = document.getElementById("start-game");
const resetButton = document.getElementById("reset-game");
const gameStatus = document.getElementById("game-status");

// Global game state variables
let draw = false;
let hasWon = false;

// Sound effects
const popSound = new Audio("pop.mp3");
const clickXSound = new Audio("clickX.mp3");
const clickOSound = new Audio("clickO.mp3");
const winSound = new Audio("win.mp3");
const drawSound = new Audio("draw.mp3");
const startSound = new Audio("tic-tac-toe/sounds/start.mp3");

// Empty array storage for game box element ids
const boxHTMLIds = [];

// Game objects
const player1 = {
	isPlaying: false,
	winGame: false,
	boxSign: "X",
	boxesOccupied: [],
};
const player2 = {
	isPlaying: false,
	winGame: false,
	boxSign: "O",
	boxesOccupied: [],
};
const gameBoard = {
	elementid: document.getElementById("game-board"),
	boxes: new Map([
		["box0", [0, 0]],
		["box1", [0, 1]],
		["box2", [0, 2]],
		["box3", [1, 0]],
		["box4", [1, 1]],
		["box5", [1, 2]],
		["box6", [2, 0]],
		["box7", [2, 1]],
		["box8", [2, 2]],
	]),
};

// ****** HELPER FUNCTIONS ******

// Function that returns a boolean to check if two arrays are equal.
// (Ignores length)
function arrayEquals(arr1, arr2) {
	return arr1.every((value, index) => value === arr2[index]);
}

// Delay function using a promise
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

// Runs several tests for every possible way to win the game.
function checkWinner(playerBoxes) {
	checkRow(playerBoxes);
	checkColumn(playerBoxes);
	checkDiagnonalLeft(playerBoxes);
	checkDiagnonalRight(playerBoxes);
	checkDraw();
}

// ****** GAME FUNCTIONALITY******

// Function initializes the game by creating the boxes used for the Xs and Os then sets the player's turn.
// Called by HTML "start-button".
function start() {
	// Promise to allow for certain pre-game animations.
	delay(150).then(() => {
		startButton.style.display = "none";
		startSound.play();

		// Creating the boxes with a staggered deployment using setInterval(). The "transform" CSS property is altered to create an animation and each box's HTML id is placed in an array for later use.
		let i = 0;
		const setBoxes = setInterval(() => {
			let gameBox = document.createElement("div");
			gameBox.className = "game-box";
			setTimeout(() => {
				gameBox.style.transform = "scale(1.0)";
			}, 1);
			gameBox.id = "box" + i;
			boxHTMLIds.push(gameBox.id);
			gameBoard.elementid.appendChild(gameBox);
			popSound.play();
			i++;

			// Ends the deployment once all 9 boxes are placed.
			if (i > 8) {
				clearInterval(setBoxes);
				resetButton.style.display = "block";
			}
		}, 400);

		// Sets players and creates the event listeners for gameplay after boxes are placed.
		player1.isPlaying = true;
		player2.isPlaying = false;
		setTimeout(() => {
			for (let i = 0; i < 9; i++) {
				document
					.getElementById(boxHTMLIds[i])
					.addEventListener("click", useBox);
			}
		}, 3800);
	});
}

// Resets the game state, player state(s), buttons and removes the boxes. Then calls start().
function resetGame() {
	delay(150).then(() => {
		player1.boxesOccupied = [];
		player2.boxesOccupied = [];
		for (let i = 0; i < 9; i++) {
			document.getElementById(boxHTMLIds[i]).remove();
		}
		setTimeout(start, 300);
		startButton.style.display = "none";
		gameStatus.style.display = "none";
		resetButton.style.display = "none";
		resetButton.innerHTML = "Reset";
		resetButton.style.fontSize = "60px";
		draw = false;
		hasWon = false;
	});
}

// Handles the logic of the click event for each box. Checks which player is playing and if the box being selected is a valid choice (not occupied by an X or O) then changes the HTML and CSS to place the symbol and match the color scheme. Then it calls checkWinner() with the array of occupied boxes from the player object.

function useBox(e) {
	let thisBox = gameBoard.boxes.get(e.target.id);
	// Player 1
	if (player1.isPlaying && !player2.boxesOccupied.includes(thisBox)) {
		e.target.style.color = "#ce0e0e";
		e.target.style.backgroundColor = "#fe9c9c";
		player1.boxesOccupied.push(thisBox);

		// Delayed placement of symbol to fix transition property bug
		setTimeout(() => {
			e.target.innerHTML = player1.boxSign;
			checkWinner(player1.boxesOccupied);
			clickXSound.play();
		}, 100);
		player2.isPlaying = true;
		player1.isPlaying = false;

		// Player 2
	} else if (player2.isPlaying && !player1.boxesOccupied.includes(thisBox)) {
		e.target.style.color = "#140ece";
		e.target.style.backgroundColor = "#9996ff";
		player2.boxesOccupied.push(thisBox);
		setTimeout(() => {
			e.target.innerHTML = player2.boxSign;
			checkWinner(player2.boxesOccupied);
			clickOSound.play();
		}, 100);
		player2.isPlaying = false;
		player1.isPlaying = true;
	}
}

// ****** WINNER TESTS - STRAIGHT******
// Each take in the array of boxes occupied from the player object as an argument.

// Checks each row using the first element in the nested array of box locations which refers to the row of the box
function checkRow(playerBoxes) {
	let row0 = 0;
	let row1 = 0;
	let row2 = 0;
	for (let i = 0; i < playerBoxes.length; i++) {
		if (playerBoxes[i][0] == 0) {
			row0++;
		} else if (playerBoxes[i][0] == 1) {
			row1++;
		} else if (playerBoxes[i][0] == 2) {
			row2++;
		}
	}
	// If the array includes 3 boxes that come from the same row it is a valid win case and the results are displayed
	if (row0 == 3 || row1 == 3 || row2 == 3) {
		hasWon = true;
		displayResults();
	}
}

// Checks each column using the second element in the nested array of box locations which refers to the column of the box
function checkColumn(playerBoxes) {
	let column0 = 0;
	let column1 = 0;
	let column2 = 0;
	for (let i = 0; i < playerBoxes.length; i++) {
		if (playerBoxes[i][1] == 0) {
			column0++;
		} else if (playerBoxes[i][1] == 1) {
			column1++;
		} else if (playerBoxes[i][1] == 2) {
			column2++;
		}
	}
	// If the array includes 3 boxes that come from the same column it is a valid win case and the results are displayed
	if (column0 == 3 || column1 == 3 || column2 == 3) {
		hasWon = true;
		displayResults();
	}
}

// ****** WINNER TESTS - DIAGONALS ******
// Each diagonal is separated into left or right and checked against the hard coded values refering to the diagonals
// Both make use of the arrayEquals() helper function

// Checks the diagonal beginning from the top left
function checkDiagnonalLeft(playerBoxes) {
	let sum = 0;
	for (let i = 0; i < playerBoxes.length; i++) {
		if (arrayEquals(playerBoxes[i], [0, 0])) {
			sum++;
		} else if (arrayEquals(playerBoxes[i], [1, 1])) {
			sum++;
		} else if (arrayEquals(playerBoxes[i], [2, 2])) {
			sum++;
		}
	}
	// If the array includes 3 boxes that correspond to the left diagonal of the board it is a valid win case and the results are displayed
	if (sum == 3) {
		hasWon = true;
		displayResults();
	}
}

// Checks the diagonal beginning from the top right
function checkDiagnonalRight(playerBoxes) {
	let sum = 0;
	for (let i = 0; i < playerBoxes.length; i++) {
		if (arrayEquals(playerBoxes[i], [0, 2])) {
			sum++;
		} else if (arrayEquals(playerBoxes[i], [1, 1])) {
			sum++;
		} else if (arrayEquals(playerBoxes[i], [2, 0])) {
			sum++;
		}
	}
	// If the array includes 3 boxes that correspond to the right diagonal of the board it is a valid win case and the results are displayed
	if (sum == 3) {
		hasWon = true;
		displayResults();
	}
}

// ****** WINNER TESTS - DRAW ******

// If no win case is found and all 9 boxes are occupied the game will end in a draw. This checks that all 9 boxes are occupied bt Xs or Os and flags a draw if the game is not already won
function checkDraw() {
	let full = 0;
	for (let i = 0; i < 9; i++) {
		if (!document.getElementById(boxHTMLIds[i]).innerHTML == "") {
			full++;
		}
	}
	if (full == 9 && hasWon == false) {
		draw = true;
		displayResults();
	}
}

// ****** DISPLAYING RESULTS ******

// Displays the results of the game based on the game state. Hides the buttons and checks which player made the last move to win (uses !player1.isPlaying because of a bug where the player state changes before the results are displayed)
function displayResults() {
	gameStatus.style.display = "block";
	resetButton.style.display = "none";
	if (!draw && hasWon == true) {
		gameStatus.innerHTML = !player1.isPlaying
			? "Player 1 Wins!"
			: "Player 2 Wins!";
		winSound.play();
	} else {
		gameStatus.innerHTML = "Draw!";
		drawSound.play();
	}
	setTimeout(() => {
		resetButton.style.display = "block";
		resetButton.innerHTML = "Play Again?";
		resetButton.style.fontSize = "30px";
	}, 2500);
}
