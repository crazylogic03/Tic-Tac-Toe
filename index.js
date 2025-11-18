const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restartButton");
const undoButton = document.getElementById("undoButton");
const results = document.getElementById("results");

console.log("Script loaded, cells found:", cells.length);

let currentPlayer = "X";
let gameOn = true;
let moveHistory = [];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Initialize the game: attach listeners and set initial UI state
function init() {
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
  });

  undoButton.addEventListener("click", undoMove);
  restartButton.addEventListener("click", restartGame);

  updateUndoButton();
}

function handleCellClick(index) {
  if (!gameOn) return;
  const cell = cells[index];
  if (cell.textContent !== "") return;

  makeMove(index);
}

function makeMove(index) {
  cells[index].textContent = currentPlayer;
  moveHistory.push(index);

  const winComb = getWinningCombination(currentPlayer);
  if (winComb) {
    handleWin(winComb);
    return;
  }

  if (checkDraw()) {
    handleDraw();
    return;
  }

  // Swap player and update undo state
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateUndoButton();
}

function getWinningCombination(player) {
  for (const comb of winningCombinations) {
    if (comb.every(idx => cells[idx].textContent === player)) {
      return comb;
    }
  }
  return null;
}

function handleWin(comb) {
  highlightWinningCells(comb);
  results.textContent = `${currentPlayer} Wins!`;
  gameOn = false;
  updateUndoButton();
}

function handleDraw() {
  results.textContent = "Draw!";
  gameOn = false;
  updateUndoButton();
}

function checkDraw() {
  return [...cells].every(cell => cell.textContent !== "");
}

function undoMove() {
  if (moveHistory.length === 0) return;

  const lastIndex = moveHistory.pop();
  cells[lastIndex].textContent = "";
  clearHighlights();

  // Flip current player back to the one who made the undone move
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  results.textContent = "";
  gameOn = true;
  updateUndoButton();
}

function restartGame() {
  cells.forEach(c => {
    c.textContent = "";
  });
  moveHistory = [];
  currentPlayer = "X";
  gameOn = true;
  results.textContent = "";
  clearHighlights();
  updateUndoButton();
}

function highlightWinningCells(comb) {
  clearHighlights();
  comb.forEach(idx => cells[idx].classList.add("win"));
}

function clearHighlights() {
  cells.forEach(c => c.classList.remove("win"));
}

function updateUndoButton() {
  undoButton.disabled = moveHistory.length === 0;
}

// Start the game wiring
init();
