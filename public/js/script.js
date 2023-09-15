let number = "";

let listNumKeys = ["k-1", "k-2", "k-3", "k-4", "k-5", "k-6", "k-7", "k-8", "k-9", "k-0"];

let display = document.getElementById("display");
let terminal = document.getElementById("terminal");
let count = 1;
let correctNumbers = 0;
let correctPositions = 0;

for (let i = 0; i < listNumKeys.length; i++) {
  let numKey = document.getElementById(listNumKeys[i]);
  numKey.addEventListener('click', () => {
    if (number.length < 4) {
      let num = numKey.getAttribute("after");
      number += num;
      display.innerHTML = number;
    }
  });
}

// Delete Key
let xKey = document.getElementById("k-x");

xKey.addEventListener('click', () => {
  resetDisplay();
});

function resetDisplay() {
  number = "";
  display.innerHTML = "";
}

// Submit Key
let equalsKey = document.getElementById("k-=");

equalsKey.addEventListener('click', () => {
  if (number.length === 4) {
    let newParagraph = document.createElement("p");
    newParagraph.classList.add("text-mint-500");
    newParagraph.textContent = `Attempt #${count}: ${correctNumbers} correct numbers, ${correctPositions} are in the correct positions. [${number}]`;
    terminal.appendChild(newParagraph);
    // Scroll to the bottom of the terminal div
    terminal.scrollTop = terminal.scrollHeight;
    count++;
    resetDisplay();
  }
});
