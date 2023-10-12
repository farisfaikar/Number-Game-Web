// ===== Global Variables =====
// Elements
const display = document.getElementById("display");
// const terminalTitle = document.getElementById("terminal-title");
const terminal = document.getElementById("terminal");
const xKey = document.getElementById("k-x");
const equalsKey = document.getElementById("k-=");
const restartKey = document.getElementById("k-re");
const highschoreKey = document.getElementById("k-hi");
const achievementKey = document.getElementById("k-ac");
const timer = document.getElementById("timer");

// Intervals
let timerInterval = setInterval(updateTimer, 1000);

// Constants
const MAX_ATTEMPTS = 4;

// Variables
let listNumKeys = ["k-1", "k-2", "k-3", "k-4", "k-5", "k-6", "k-7", "k-8", "k-9", "k-0"];
let gameState = "start";
let inputNumber = "";
let secretNumber = "";
let count = 1;
let correctNumbers = 0;
let correctPositions = 0;
let remainingAttempts = MAX_ATTEMPTS;
let isWinTextDisplayed = false;
let isLoseTextDisplayed = false;
let totalSeconds = 0;

// ===== Listeners =====
function numKeyListeners() {
  for (let i = 0; i < listNumKeys.length; i++) {
    let numKey = document.getElementById(listNumKeys[i]);
    numKey.addEventListener("click", () => {
      if (inputNumber.length < 4) {
        let num = numKey.getAttribute("after");
        inputNumber += num;
        display.innerHTML = inputNumber;
        numKey.setAttribute("disabled", "");
        numKey.classList.remove("after:-translate-y-2", "after:bg-carrot-500", "hover:after:bg-white");
        numKey.classList.add("after:translate-y-0", "after:bg-carrot-700");
      }
      if (inputNumber.length === 4) {
        equalsKey.removeAttribute("disabled");
        equalsKey.classList.add("after:-translate-y-2", "hover:after:bg-white");
      }
    });
  }
}

function deleteKeyListeners() {
  xKey.addEventListener("click", () => {
    resetDisplay();
  });
}

function resetDisplay() {
  inputNumber = "";
  display.innerHTML = "";

  // Reset disabled keys
  for (let i = 0; i < listNumKeys.length; i++) {
    let numKey = document.getElementById(listNumKeys[i]);
    numKey.removeAttribute("disabled");
    numKey.classList.remove("after:translate-y-0", "after:bg-carrot-700");
    numKey.classList.add("after:-translate-y-2", "after:bg-carrot-500", "hover:after:bg-white");
  }
}

function equalsKeyListeners() {
  equalsKey.addEventListener("click", () => {
    compare();
    if (inputNumber === secretNumber) {
      gameState = "won";
      displayWinText();
      pauseTimer();
    }
    if (inputNumber.length === 4 && gameState === "start") {
      let newParagraph = document.createElement("p");
      newParagraph.classList.add("text-mint-500");
      newParagraph.textContent = `> Attempt #${count}: ${correctNumbers} correct numbers, ${correctPositions} are in the correct positions. [${inputNumber}]`;
      terminal.appendChild(newParagraph);
      equalsKey.setAttribute("disabled", "");
      equalsKey.classList.remove("after:-translate-y-2", "hover:after:bg-white");

      // Scroll to the bottom of the terminal div
      terminal.scrollTop = terminal.scrollHeight;
      count++;
      resetDisplay();

      if (remainingAttempts <= 0) {
        gameState = "lost";
        displayLoseText();
        pauseTimer();
      }
    }
  });
}

function restartKeyListeners() {
  restartKey.addEventListener("click", () => {
    // Remove all child elements of the terminal div except the first one
    while (terminal.lastChild && terminal.childElementCount > 1) {
      terminal.removeChild(terminal.lastChild);
    }
    count = 1;
    isWinTextDisplayed = false;
    isLoseTextDisplayed = false;
    gameState = "start";
    remainingAttempts = MAX_ATTEMPTS;
    createSecretNumber();
    resetDisplay();
    removeOldTerminalTitle();
    restartTimer();
    init();
  });
}

function highscoreKeyListeners() {
  highschoreKey.addEventListener("click", () => {
    window.location.href = "highscore.html";
  });
}

function achievementKeyListeners() {
  achievementKey.addEventListener("click", () => {
    window.location.href = "achievement.html";
  });
}

// ===== Game Logic =====
function init() {
  let terminalTitle = document.createElement("p");
  terminalTitle.id = "terminal-title";
  terminalTitle.innerHTML = `Guess the 4 digit number combination! You have ${MAX_ATTEMPTS} attempts left.`;
  terminal.appendChild(terminalTitle);
}

function removeOldTerminalTitle() {
  let oldTerminalTitle = document.getElementById("terminal-title");
  oldTerminalTitle.remove();
}

function createSecretNumber() {
  secretNumber = "";
  while (secretNumber.length < 4) {
    let randomNum = Math.floor(Math.random() * 10);
    if (secretNumber.includes(randomNum)) {
      continue;
    } else {
      secretNumber += randomNum;
    }
  }
  console.log(secretNumber);
}

function compare() {
  correctNumbers = 0;
  correctPositions = 0;
  console.log(remainingAttempts, secretNumber);
  if (gameState === "start") {
    for (let i = 0; i < inputNumber.length; i++) {
      if (inputNumber[i] === secretNumber[i]) {
        correctPositions++;
        correctNumbers++;
      } else if (secretNumber.includes(inputNumber[i])) {
        correctNumbers++;
      }
    }
    remainingAttempts--;
    let terminalTitle = document.getElementById("terminal-title");
    terminalTitle.innerHTML = `Guess the 4 digit number combination! You have ${remainingAttempts} attempts left.`;
  }
}

function displayWinText() {
  if (!isWinTextDisplayed) {
    let newParagraph = document.createElement("p");
    newParagraph.classList.add("text-kiwi-500");
    newParagraph.textContent = `You win! The correct number was ${secretNumber}.`;
    terminal.appendChild(newParagraph);

    // Scroll to the bottom of the terminal div
    terminal.scrollTop = terminal.scrollHeight;
    isWinTextDisplayed = true;
    resetDisplay();
  }
}

function displayLoseText() {
  if (!isLoseTextDisplayed) {
    let newParagraph = document.createElement("p");
    newParagraph.classList.add("text-apple-500");
    newParagraph.textContent = `You have run out of attempts! You lost. The correct number was ${secretNumber}.`;
    terminal.appendChild(newParagraph);

    // Scroll to the bottom of the terminal div
    terminal.scrollTop = terminal.scrollHeight;
    isLoseTextDisplayed = true;
    resetDisplay();
  }
}

function updateTimer() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the time with leading zeros
  const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timer.textContent = `Time: ${timeString}`;
  totalSeconds++;
}

function restartTimer() {
  totalSeconds = 0;
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
}

function pauseTimer() {
  clearInterval(timerInterval);
}

// ===== Main Function =====
function main() {
  // Initializers
  init();
  createSecretNumber();
  updateTimer();

  // Listeners
  numKeyListeners();
  deleteKeyListeners();
  equalsKeyListeners();
  restartKeyListeners();
  highscoreKeyListeners();
  achievementKeyListeners();
}

main();
