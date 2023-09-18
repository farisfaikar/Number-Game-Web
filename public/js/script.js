// ===== Global Variables =====
// Elements
let display = document.getElementById("display");
let terminalTitle = document.getElementById("terminal-title");
let terminal = document.getElementById("terminal");
let xKey = document.getElementById("k-x");
let equalsKey = document.getElementById("k-=");
let restartKey = document.getElementById("k-re");
let highschoreKey = document.getElementById("k-hi");
let achievementKey = document.getElementById("k-ac");

// Variables
let listNumKeys = ["k-1", "k-2", "k-3", "k-4", "k-5", "k-6", "k-7", "k-8", "k-9", "k-0"];
let inputNumber = "";
let count = 1;
let correctNumbers = 0;
let correctPositions = 0;
let gameState = "start";
let attempts = 0;
let maxAttempts = 8;
let remainingAttempts = 0;
let secretNumber = "";
let isWinTextDisplayed = false;

// ===== Listeners =====
function numKeyListeners() {
  for (let i = 0; i < listNumKeys.length; i++) {
    let numKey = document.getElementById(listNumKeys[i]);
    numKey.addEventListener('click', () => {
      if (inputNumber.length < 4) {
        let num = numKey.getAttribute("after");
        inputNumber += num;
        display.innerHTML = inputNumber;
        numKey.setAttribute("disabled", "");
        numKey.classList.remove("after:-translate-y-2", "after:bg-carrot-500", "hover:after:bg-white");
        numKey.classList.add("after:translate-y-0", "after:bg-carrot-700");
      }
    });
  }
}

function deleteKeyListeners() {
  xKey.addEventListener('click', () => {
    resetDisplay();
  });
}

function resetDisplay() {
  inputNumber = "";
  display.innerHTML = "";
  for (let i = 0; i < listNumKeys.length; i++) {
    let numKey = document.getElementById(listNumKeys[i]);
    numKey.removeAttribute("disabled");
    numKey.classList.remove("after:translate-y-0", "after:bg-carrot-700");
    numKey.classList.add("after:-translate-y-2", "after:bg-carrot-500", "hover:after:bg-white");
  }
}

function submitKeyListeners() {
  equalsKey.addEventListener('click', () => {
    compare();
    if (inputNumber.length === 4 && gameState === "start") {
      let newParagraph = document.createElement("p");
      newParagraph.classList.add("text-mint-500");
      newParagraph.textContent = `Attempt #${count}: ${correctNumbers} correct numbers, ${correctPositions} are in the correct positions. [${inputNumber}]`;
      terminal.appendChild(newParagraph);
      // Scroll to the bottom of the terminal div
      terminal.scrollTop = terminal.scrollHeight;
      count++;
      resetDisplay();
    }
  });
}

function restartKeyListeners() {
  restartKey.addEventListener('click', () => {
    // Remove all child elements of the terminal div except the first one
    while (terminal.lastChild && terminal.childElementCount > 1) {
      terminal.removeChild(terminal.lastChild);
    };
    count = 1;
    isWinTextDisplayed = false;
    createSecretNumber();
    resetDisplay();
  });
}

function highscoreKeyListeners() {
  highschoreKey.addEventListener('click', () => {
    window.location.href = "highscore.html";
  });
}

function achievementKeyListeners() {
  achievementKey.addEventListener('click', () => {
    window.location.href = "achievement.html";
  });
}

// ===== Game Logic =====
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
  if (inputNumber === secretNumber) {
    gameState = "won";
    displayWinText();
  } else {
    for (let i = 0; i < inputNumber.length; i++) {
      if (inputNumber[i] === secretNumber[i]) {
        correctPositions++;
        correctNumbers++;
      } else if (secretNumber.includes(inputNumber[i])) {
        correctNumbers++;
      }
    }
    attempts += 1;
    remainingAttempts = maxAttempts - attempts;
    if (attempts >= maxAttempts) {
      gameState = "lost";
    }
    terminalTitle.innerHTML = `Guess the 7 digit number combination! You have ${remainingAttempts} attempts left.`;
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

// ===== Main Function =====
function main() {
  // Init
  createSecretNumber();
  // Listeners
  numKeyListeners();
  deleteKeyListeners();
  submitKeyListeners();
  restartKeyListeners();
  highscoreKeyListeners();
  achievementKeyListeners();
}

main();
