// ===== Global Variables =====
// Elements
const displays = document.getElementsByClassName("display");
const terminals = document.getElementsByClassName("terminal");
const xKeys = document.getElementsByClassName("k-x");
const equalsKeys = document.getElementsByClassName("k-=");
const restartKeys = document.getElementsByClassName("k-re");
const highschoreKeys = document.getElementsByClassName("k-hi");
const achievementKeys = document.getElementsByClassName("k-ac");
const timers = document.getElementsByClassName("timer");

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
  for (const listNumKey of listNumKeys) {
    let numKeys = document.getElementsByClassName(listNumKey);
    for (const numKey of numKeys) {
      numKey.addEventListener("click", () => {
        if (inputNumber.length < 4) {
          let num = numKey.getAttribute("after");
          inputNumber += num;
          for (const display of displays) {
            display.innerHTML = inputNumber;
          }
          numKey.setAttribute("disabled", "");
          numKey.classList.remove("after:-translate-y-2", "after:bg-carrot-500", "hover:after:bg-white");
          numKey.classList.add("after:translate-y-0", "after:bg-carrot-700");
        }
        if (inputNumber.length === 4) {
          for (const equalsKey of equalsKeys) {
            equalsKey.removeAttribute("disabled");
            if (equalsKey.classList.contains("desktop")) {
              equalsKey.classList.add("after:-translate-y-1");
            } else {
              equalsKey.classList.add("after:-translate-y-2");
            }
            equalsKey.classList.add("hover:after:bg-white");
          }
        }
      });
    }
  }
}

function deleteKeyListeners() {
  for (const xKey of xKeys) {
    xKey.addEventListener("click", () => {
      resetDisplay();
    });
  }
}

function resetDisplay() {
  inputNumber = "";
  for (const display of displays) {
    display.innerHTML = "";
  }

  // Reset disabled keys
  for (const listNumKey of listNumKeys) {
    let numKeys = document.getElementsByClassName(listNumKey);
    for (const numKey of numKeys) {
      numKey.removeAttribute("disabled");
      if (numKey.classList.contains("desktop")) {
        numKey.classList.add("after:-translate-y-1")
      } else {
        numKey.classList.add("after:-translate-y-2")
      }
      numKey.classList.remove("after:translate-y-0", "after:bg-carrot-700");
      numKey.classList.add("after:bg-carrot-500", "hover:after:bg-white");
    }
  }
}

function equalsKeyListeners() {
  for (const equalsKey of equalsKeys) {
    equalsKey.addEventListener("click", () => {
      compare();
      if (inputNumber === secretNumber) {
        gameState = "won";
        displayWinText();
        pauseTimer();
      }
      if (inputNumber.length === 4 && gameState === "start") {
        for (const terminal of terminals) {
          let newParagraph = document.createElement("p");
          newParagraph.classList.add("text-mint-500");
          newParagraph.textContent = `> Attempt #${count}: ${correctNumbers} correct numbers, ${correctPositions} are in the correct positions. [${inputNumber}]`;
          terminal.appendChild(newParagraph);
          // Scroll to the bottom of the terminal div
          terminal.scrollTop = terminal.scrollHeight;
        }
        
        equalsKey.setAttribute("disabled", "");
        equalsKey.classList.remove("after:-translate-y-2", "hover:after:bg-white");

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
}

function restartKeyListeners() {
  for (const restartKey of restartKeys) {
    restartKey.addEventListener("click", () => {
      // Remove all child elements of the terminal div except the first one
      for (const terminal of terminals) {
        while (terminal.childElementCount > 0) {
          terminal.removeChild(terminal.lastChild);
        }
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
}

function highscoreKeyListeners() {
  for (const highschoreKey of highschoreKeys) {
    highschoreKey.addEventListener("click", () => {
      window.location.href = "highscore.html";
    });
  }
}

function achievementKeyListeners() {
  for (const achievementKey of achievementKeys) {
    achievementKey.addEventListener("click", () => {
      window.location.href = "achievement.html";
    });
  }
}

// ===== Game Logic =====
function init() {
  for (const terminal of terminals) {
    let terminalTitle = document.createElement("p");
    terminalTitle.className = "terminal-title";
    terminalTitle.innerHTML = `Guess the 4 digit number combination! You have ${MAX_ATTEMPTS} attempts left.`;
    terminal.appendChild(terminalTitle);
  }
}

function removeOldTerminalTitle() {
  let oldTerminalTitles = document.getElementsByClassName("terminal-title");
  for (const oldTerminalTitle of oldTerminalTitles) {
    oldTerminalTitle.remove();
  }
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
    let terminalTitles = document.getElementsByClassName("terminal-title");
    for (const terminalTitle of terminalTitles) {
      terminalTitle.innerHTML = `Guess the 4 digit number combination! You have ${remainingAttempts} attempts left.`;
    }
  }
}

function displayWinText() {
  if (!isWinTextDisplayed) {
    for (const terminal of terminals) {
      let newParagraph = document.createElement("p");
      newParagraph.classList.add("text-kiwi-500");
      newParagraph.textContent = `You win! The correct number was ${secretNumber}.`;
      terminal.appendChild(newParagraph);
      // Scroll to the bottom of the terminal div
      terminal.scrollTop = terminal.scrollHeight;
    }
    
    isWinTextDisplayed = true;
    resetDisplay();
  }
}

function displayLoseText() {
  if (!isLoseTextDisplayed) {
    for (const terminal of terminals) {
      let newParagraph = document.createElement("p");
      newParagraph.classList.add("text-apple-500");
      newParagraph.textContent = `You have run out of attempts! You lost. The correct number was ${secretNumber}.`;
      terminal.appendChild(newParagraph);
      // Scroll to the bottom of the terminal div
      terminal.scrollTop = terminal.scrollHeight;
    }
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
  for (const timer of timers) {
    if (timer.classList.contains("desktop")) {
      timer.textContent = `T+: ${timeString}`;
    } else {
      timer.textContent = `Time: ${timeString}`;
    }
  }
  totalSeconds++;
}

function restartTimer() {
  pauseTimer();
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
