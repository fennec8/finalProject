const letters = document.querySelectorAll(".btn");
const warningContainer = document.querySelector(".warning-container");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal-bg");
const playBtn = document.querySelector(".playBtn");
const nav = document.querySelector(".nav");
const navCloseBtn = document.querySelector(".nav-closeBtn");
const statsBtn = document.querySelector(".statsBtn");
const chartBtn = document.querySelector(".chartBtn");

const statsPlayed = document.querySelector(".statsPlayed");
const statsWins = document.querySelector(".statsWins");
const statsCurrentStreak = document.querySelector(".statsCurrentStreak");
const statsMaxStreak = document.querySelector(".statsMaxStreak");
const guess1 = document.querySelector(".guess1");
const guess2 = document.querySelector(".guess2");
const guess3 = document.querySelector(".guess3");
const guess4 = document.querySelector(".guess4");
const guess5 = document.querySelector(".guess5");
const guess6 = document.querySelector(".guess6");

const winWords = [
  "great",
  "amazing",
  "awesome",
  "wonderful",
  "excellent",
  "magnificent",
  "impresive",
  "incredible",
  "nice",
];

class GameOfWords {
  constructor() {
    this.canDelete = true;
    this.canEnter = true;
  }
  
  startGame(word) {
    this.canDelete = true;
    this.canEnter = true;
    const rows = document.querySelectorAll(".row");
    const rowsArray = Array.from(rows);
    this.rowsArray = rowsArray;
    this.tiles = Array.from(rowsArray[0].children);
    this.word = word;
    this.guessed_in = 0;
  }

  // fill first empty tile with letter
  writeLetter(letter) {
    // set tiles to new empty row
    this.tiles = this.rowsArray[0].children;
    // write letter in an empty tile
    for (let i = 0, l = this.word.length; i < l; i++) {
      if (this.tiles[i].innerText == "") {
        this.tiles[i].innerText = letter;
        this.tiles[i].classList.add("tileWriteAnimation");
        break;
      }
    }
  }

  // delete letter from last filled tile
  deleteLetter() {
    if (this.canDelete) {
      for (let i = this.word.length - 1; i >= 0; i--) {
        if (this.tiles[i].innerText != "") {
          this.tiles[i].innerText = "";
          this.tiles[i].classList.remove("tileWriteAnimation");
          break;
        }
      }
    }
  }

  // check if last tile is filled with letter
  checkEnoughLetters() {
    if (this.canEnter) {
      if (this.tiles[4].innerText == "") this.showWarningDiv("Not enough letters")
      else this.checkWordList();
    }
  }
  
  // check if word list includes written word
  async checkWordList() {
    const wordGuess = "".concat(
        this.tiles[0].innerText,
        this.tiles[1].innerText,
        this.tiles[2].innerText,
        this.tiles[3].innerText,
        this.tiles[4].innerText
      ).toLowerCase();

    const response = await postWordList(wordGuess);

    if (response == "false") this.showWarningDiv("Not in word list")
    else this.checkRightLetters(wordGuess);
  }

  // check if guessed word has right letters
  checkRightLetters(wordGuess) {
    this.canDelete = false;
    this.canEnter = false;
    this.guessed_in++;
    const thisWord = Array.from(this.word);
    const rowWord = Array.from(wordGuess);
    
    // add styles to tiles
    let i = 0;
    let animationInt = setInterval(() => {
      this.tiles[i].classList.add("tileShowAnimation");
      // check if letter is in right spot, is in any spot or isn't
      if (thisWord[i] == rowWord[i]) this.tiles[i].classList.add("tileBgGreen");
      else if (thisWord.includes(rowWord[i])) this.tiles[i].classList.add("tileBgYellow");
      else this.tiles[i].classList.add("tileBgGrey");
      // do it for all letters
      i++;
      if (i >= 5) clearInterval(animationInt);
    }, 400);

    // call this.win() if word is correct
    if (JSON.stringify(thisWord) == JSON.stringify(rowWord)) setTimeout(() => this.win(), 1800);
    else { // remove one row
      setTimeout(() => {
        this.rowsArray.shift();
        // if that row was the last one call this.lose()
        if (this.rowsArray.length == 0) setTimeout(() => this.lose(), 500);
        else { // otherwise continue the game
          this.tiles = this.rowsArray[0].children;
          this.canDelete = true;
          this.canEnter = true;
        }
      }, 2600);
    }
    this.colorKeyboard(this.tiles);
  }

  // match tiles colors with keyboard colors
  colorKeyboard(tiles) {
    setTimeout(() => {
      for (let i = 0, l = tiles.length; i < l; i++) {
        let currentTile = tiles[i];
        let keyboardLetter = document.querySelector(`[data-key='${currentTile.innerText}']`);
        // give keyboardLetters the same colors that tiles have
        if (currentTile.classList.contains("tileBgGreen")) keyboardLetter.style.backgroundColor = "var(--green)";
        else if (currentTile.classList.contains("tileBgYellow") && keyboardLetter.style.backgroundColor != "var(--green)") keyboardLetter.style.backgroundColor = "var(--yellow)";
        else keyboardLetter.style.backgroundColor = "var(--border)";
      }
    }, 2500);
  }

  win() {
    setTimeout(() => {
      let i = 0;
      let animationInt = setInterval(() => {
        this.tiles[i].classList.add("tileBounceAnimation");
        this.tiles[i].style.backgroundColor = "var(--green)";
        this.tiles[i].style.borderColor = "var(--green)";
        // add animation for every tile
        i++;
        if (i >= 5) clearInterval(animationInt);
      }, 100);
    }, 1000);
    // pick complement at random
    let congrats = winWords[Math.floor(Math.random() * (winWords.length - 1))];
    let warningDiv = document.createElement("div");
    // show all winning animations
    setTimeout(() => {
      warningDiv.classList.add("warningDiv"); 
      warningDiv.innerText = congrats; 
      warningContainer.appendChild(warningDiv);
    }, 700);
    setTimeout(() => warningDiv.classList.add("warningDivAnimation"), 2400);
    setTimeout(() => warningContainer.removeChild(warningDiv), 2700);
    setTimeout(() => {
      modal.classList.add("modal-toggle"); 
      modalBg.classList.add("display");
    }, 3000);
    this.updateStats("win");
  }

  // show warningDiv and modal
  lose() {
    let warningDiv = document.createElement("div");
    warningDiv.classList.add("warningDiv");
    warningDiv.innerText = this.word;
    warningContainer.appendChild(warningDiv);

    setTimeout(() => {
      modal.classList.add("modal-toggle");
      modalBg.classList.add("display");
    }, 1500);
    this.updateStats("lose");
  }

  // resets everything
  async createNewGame() {
    await getRandomWord();

    // reset every tile in every row
    for (const row of this.rowsArray) {
      this.tiles = row.children;
      for (const tile of this.tiles) {
        tile.className = "";
        tile.classList.add("tile");
        tile.style.borderColor = "var(--border)";
        tile.style.backgroundColor = "unset";
        tile.innerHTML = "";
      }
    }
    // reset keyboard
    letters.forEach((letter) => letter.style.backgroundColor = "var(--grey)");
    // hide modal
    modal.classList.remove("modal-toggle");
    modalBg.classList.remove("display");
    // delete lose warning div if there is one
    let warDiv = warningContainer.children[0];
    if (warDiv != undefined) warningContainer.removeChild(warDiv);
  }

  showWarningDiv(text) {
    // add and remove animation so it can be added again
    this.rowsArray[0].classList.add("rowAnimation");
    setTimeout(() => {
      this.rowsArray[0].classList.remove("rowAnimation");
    }, 500);
    // create warning div
    let warningDiv = document.createElement("div");
    warningDiv.classList.add("warningDiv");
    warningDiv.innerText = text;
    warningContainer.appendChild(warningDiv);
    // show and delete warning div from DOM
    setTimeout(() => {
      warningDiv.classList.add("warningDivAnimation");
    }, 1000);
    setTimeout(() => {
      warningContainer.removeChild(warningDiv);
    }, 1300);
  }

  async updateStats(game) {
    // Send info to db
    let data;
    if (game == "win") {
      data = {
        "played": "1",
        "wins": "1",
        "current_streak": "1",
        "max_streak": "1",
        "guessed_in": this.guessed_in,
      }
    }
    else {
      data = {
        "played": "1",
        "wins": "0",
        "current_streak": "0",
        "max_streak": "0",
        "guessed_in": this.guessed_in,
      }
    }
    const response = await postStats(data);
    // Display reveived info on stats menu
    this.displayStats(response)
  }

  displayStats(data) {
    statsPlayed.innerText = data["played"]
    let wins = Math.round(data["wins"] / data["played"] * 100);
    if (isNaN(wins)) statsWins.innerText = "0"
    else statsWins.innerText = wins 
    statsCurrentStreak.innerText = data["current_streak"]
    statsMaxStreak.innerText = data["max_streak"]

    guess1.innerText = data["guessed_in1"]; 
    guess2.innerText = data["guessed_in2"]; 
    guess3.innerText = data["guessed_in3"]; 
    guess4.innerText = data["guessed_in4"]; 
    guess5.innerText = data["guessed_in5"]; 
    guess6.innerText = data["guessed_in6"]; 
  }
}

const gameOfWords = new GameOfWords();

// start fetching when DOM is loaded
window.addEventListener("DOMContentLoaded", getRandomWord());

// fetching random 5-letters word from jinja element
async function getRandomWord() {
  try {
    const response = await fetch("/getWord")
      .then(response => response.json())
      gameOfWords.startGame(response);
      console.log(response);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Check if guessed word is in db word list
async function postWordList(wordGuess) {
  try {
    const response = await fetch("/postWordList", {
      method: "POST", // or 'PUT'
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(wordGuess),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Post stats to db
async function postStats(data) {
  try {
    const response = await fetch("/postStats", {
      method: "POST", // or 'PUT'
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

// write letters using mouse
letters.forEach((letter) => {
  letter.addEventListener("click", () => {
    if (letter.dataset.key === "backspace") gameOfWords.deleteLetter();
    else if (letter.dataset.key === "enter") gameOfWords.checkEnoughLetters();
    else gameOfWords.writeLetter(letter.dataset.key);
  });
});

// get rid of outline on btns when clicking
letters.forEach((letter) => {
  letter.addEventListener("mousedown", () => {
    letter.style.outline = "none"
  });
});

let key;
// keyboard events - write/delete letters using keyboard, check for win with enter
document.addEventListener("keydown", (e) => {
  // prevent holding key
  if (e.key == key) return;
  key = e.key;

  if (/^[a-z]+$/.test(e.key)) gameOfWords.writeLetter(e.key.toUpperCase());
  if (e.key === "Backspace") gameOfWords.deleteLetter();
  if (e.key === "Enter") gameOfWords.checkEnoughLetters(), e.preventDefault();
});

document.addEventListener("keyup", () => key = "");

navCloseBtn.addEventListener("click", () => nav.classList.remove("nav-toggle"));

statsBtn.addEventListener("click", () => {
  nav.classList.remove("nav-toggle");
  setTimeout(() => {
    modal.classList.add("modal-toggle");
    modalBg.classList.add("display");
  });
});

chartBtn.addEventListener("click", () => {
  setTimeout(() => {
    modal.classList.add("modal-toggle");
    modalBg.classList.add("display");
  });
});

// create new game and delete focus from btn
playBtn.addEventListener("click", () => {
  gameOfWords.createNewGame();
  playBtn.blur();
});

// close modal on btn or outside the modal
document.addEventListener("click", (e) => {
  if (
      modal.classList.contains("modal-toggle") &&
      (e.target.matches(".modal-Btn") || !e.target.closest(".modal"))
  ) {
    modal.classList.remove("modal-toggle");
    modalBg.classList.remove("display");
  }
});

// opening/closing nav
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("hamBtn")) nav.classList.toggle("nav-toggle")
  else if (
          nav.classList.contains("nav-toggle") &&
          (e.target.matches(".hamBtn") || !e.target.closest(".nav"))
  ) { nav.classList.remove("nav-toggle") }
});

async function displayUsersStatsOnce() {
  try {
    let response = await fetch("/getStats")
      response = await response.json()
      gameOfWords.displayStats(response)
  } catch (error) {
    console.log(error);
  }
}
setTimeout(() => {
  displayUsersStatsOnce();
}, 500);