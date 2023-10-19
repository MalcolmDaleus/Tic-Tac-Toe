"use strict";

const button = document.getElementById("start-game");
const gameStatus = document.getElementById("game-status");
let draw = false;
const boxHTMLIds = [];
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

function start() {
  button.style.display = "none";
  document.getElementById("reset-game").style.display = "block";
  for (let i = 0; i < 9; i++) {
    let gameBox = document.createElement("div");
    gameBox.className = "game-box";
    gameBox.id = "box" + i;
    boxHTMLIds.push(gameBox.id);
    gameBox.addEventListener("click", useBox);
    gameBoard.elementid.appendChild(gameBox);
  }
  playGame();
}
function playGame() {
  player1.isPlaying = true;
  player2.isPlaying = false;
}
function useBox(e) {
  if (
    player1.isPlaying &&
    !player2.boxesOccupied.includes(gameBoard.boxes.get(e.target.id))
  ) {
    e.target.innerHTML = player1.boxSign;
    player1.boxesOccupied.push(gameBoard.boxes.get(e.target.id));
    checkWinner(player1.boxesOccupied);
    e.target.style.color = "#ce0e0e";
    player2.isPlaying = true;
    player1.isPlaying = false;
  } else if (
    player2.isPlaying &&
    !player1.boxesOccupied.includes(gameBoard.boxes.get(e.target.id))
  ) {
    e.target.innerHTML = player2.boxSign;
    player2.boxesOccupied.push(gameBoard.boxes.get(e.target.id));
    checkWinner(player2.boxesOccupied);
    e.target.style.color = "#140ece";
    player2.isPlaying = false;
    player1.isPlaying = true;
  }
}
function checkWinner(playerBoxes) {
  checkRow(playerBoxes);
  checkColumn(playerBoxes);
  checkDiagnonalLeft(playerBoxes);
  checkDiagnonalRight(playerBoxes);
  checkDraw();
}

function resetGame() {
  player1.boxesOccupied = [];
  player2.boxesOccupied = [];
  for (let i = 0; i < 9; i++) {
    document.getElementById(boxHTMLIds[i]).remove();
  }
  setTimeout(start, 200);
  button.style.display = "none";
  gameStatus.style.display = "none";
  draw = false;
}

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
  if (row0 == 3 || row1 == 3 || row2 == 3) {
    displayResults();
  }
}

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
  if (column0 == 3 || column1 == 3 || column2 == 3) {
    displayResults();
  }
}

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
  if (sum == 3) {
    displayResults();
  }
}
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
  if (sum == 3) {
    displayResults();
  }
}

function checkDraw() {
  let full = 0;
  for (let i = 0; i < 9; i++) {
    if (!document.getElementById(boxHTMLIds[i]).innerHTML == "") {
      full++;
    }
  }
  if (full == 9) {
    draw = true;
    displayResults();
  }
}

function arrayEquals(arr1, arr2) {
  return arr1.every((value, index) => value === arr2[index]);
}

function displayResults() {
  gameStatus.style.display = "block";
  if (!draw) {
    gameStatus.innerHTML = player1.isPlaying
      ? "Player 1 Wins!"
      : "Player 2 Wins!";
  } else {
    gameStatus.innerHTML = "Draw!";
  }
  setTimeout(resetGame, 2500);
}
