const letters = document.querySelectorAll(".btn");
const warningContainer = document.querySelector(".warning-container");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal-bg");
const playBtn = document.querySelector(".playBtn");
const nav = document.querySelector(".nav");
const navCloseBtn = document.querySelector(".nav-closeBtn");
const statsBtn = document.querySelector(".statsBtn");

const winWords = [
  "great",
  "amazing",
  "awesome",
  "wonderful",
  "excellent",
  "splendid",
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
  }

  // fill first empty tile with letter
  writeLetter(letter) {
    // set tiles to new empty row
    this.tiles = this.rowsArray[0].children;
    for (let i = 0; i < this.word.length; i++) {
      if (this.tiles[i].innerText == "") {
        this.tiles[i].innerText = letter;
        this.tiles[i].classList.add("tileWriteAnimation");
        this.tiles[i].style.borderColor = "var(--borderLight)";
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
          this.tiles[i].style.borderColor = "var(--border)";
          break;
        }
      }
    }
  }

  // check if last tile is filled with letter
  checkEnoughLetters() {
    if (this.canEnter) {
      if (this.tiles[4].innerText == "") {
        this.rowsArray[0].classList.add("rowAnimation");
        setTimeout(() => {
          this.rowsArray[0].classList.remove("rowAnimation");
        }, 500);

        let warningDiv = document.createElement("div");
        warningDiv.classList.add("warningDiv");
        warningDiv.innerText = "Not enough letters";
        warningContainer.appendChild(warningDiv);

        setTimeout(() => {
          warningDiv.classList.add("warningDivAnimation");
        }, 1000);
        setTimeout(() => {
          warningContainer.removeChild(warningDiv);
        }, 1300);
      } else {
        this.checkWordList();
      }
    }
  }
  // check if word list includes written word
  checkWordList() {
    const wordGuess = ""
      .concat(
        this.tiles[0].innerText,
        this.tiles[1].innerText,
        this.tiles[2].innerText,
        this.tiles[3].innerText,
        this.tiles[4].innerText
      )
      .toLowerCase();
    if (!WORDS.includes(wordGuess)) {
      this.rowsArray[0].classList.add("rowAnimation");
      setTimeout(() => {
        this.rowsArray[0].classList.remove("rowAnimation");
      }, 500);

      let warningDiv = document.createElement("div");
      warningDiv.classList.add("warningDiv");
      warningDiv.innerText = "Not in word list";
      warningContainer.appendChild(warningDiv);

      setTimeout(() => {
        warningDiv.classList.add("warningDivAnimation");
      }, 1000);
      setTimeout(() => {
        warningContainer.removeChild(warningDiv);
      }, 1300);
    } else {
      this.checkRightLetters(wordGuess);
    }
  }

  // check if guessed word has right letters
  checkRightLetters(wordGuess) {
    this.canDelete = false;
    this.canEnter = false;
    const thisWord = Array.from(this.word);
    const rowWord = Array.from(wordGuess);

    let i = 0;
    let animationInt = setInterval(() => {
      this.tiles[i].classList.add("tileShowAnimation");

      if (thisWord[i] == rowWord[i]) {
        this.tiles[i].classList.add("tileBgGreen");
      } else if (thisWord.includes(rowWord[i])) {
        this.tiles[i].classList.add("tileBgYellow");
      } else {
        this.tiles[i].classList.add("tileBgGrey");
      }
      i++;

      if (i >= 5) {
        clearInterval(animationInt);
      }
    }, 400);

    if (JSON.stringify(thisWord) == JSON.stringify(rowWord)) {
      setTimeout(() => {
        this.win();
      }, 1800);
    } else {
      setTimeout(() => {
        this.rowsArray.shift();

        if (this.rowsArray.length == 0) {
          setTimeout(() => {
            this.lose();
          }, 500);
        } else {
          this.tiles = this.rowsArray[0].children;
          this.canDelete = true;
          this.canEnter = true;
        }
      }, 2000);
    }

    this.colorKeyboard(this.tiles);
  }

  // match tiles colors with keyboard colors
  colorKeyboard(tiles) {
    setTimeout(() => {
      for (let i = 0; i < tiles.length; i++) {
        let currentDataset = tiles[i].innerText;
        let currentTile = tiles[i];
        let keyboardLetter = document.querySelector(
          `[data-key='${currentDataset}']`
        );

        if (currentTile.classList.contains("tileBgGreen")) {
          keyboardLetter.style.backgroundColor = "var(--green)";
        } else if (currentTile.classList.contains("tileBgYellow")) {
          if (keyboardLetter.style.backgroundColor != "var(--green)") {
            keyboardLetter.style.backgroundColor = "var(--yellow)";
          }
        } else {
          keyboardLetter.style.backgroundColor = "var(--border)";
        }
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
        i++;

        if (i >= 5) {
          clearInterval(animationInt);
        }
      }, 100);
    }, 1000);

    let random = Math.floor(Math.random() * (winWords.length - 1));
    let congrats = winWords[random];
    let warningDiv = document.createElement("div");

    setTimeout(() => {
      warningDiv.classList.add("warningDiv");
      warningDiv.innerText = congrats;
      warningContainer.appendChild(warningDiv);
    }, 700);

    setTimeout(() => {
      warningDiv.classList.add("warningDivAnimation");
    }, 2400);
    setTimeout(() => {
      warningContainer.removeChild(warningDiv);
    }, 2700);

    setTimeout(() => {
      modal.classList.add("modal-toggle");
      modalBg.classList.add("display");
    }, 3000);
  }

  // show warDiv and modal
  lose() {
    let warningDiv = document.createElement("div");
    warningDiv.classList.add("warningDiv");
    warningDiv.innerText = this.word;
    warningContainer.appendChild(warningDiv);

    setTimeout(() => {
      modal.classList.add("modal-toggle");
      modalBg.classList.add("display");
    }, 1500);
  }

  // resets everything
  async createNewGame() {
    await getRandomWord();

    // reset tiles (for every tile of every row)
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
    letters.forEach((letter) => {
      letter.style.backgroundColor = "var(--grey)";
    });

    // remove modal
    modal.classList.remove("modal-toggle");
    modalBg.classList.remove("display");

    // delete lose warning div if there is one
    let warDiv = warningContainer.children[0];
    if (warDiv == undefined) {
      return;
    } else {
      warningContainer.removeChild(warDiv);
    }
  }
}

const gameOfWords = new GameOfWords();

// start fetching when DOM is loaded
window.addEventListener("DOMContentLoaded", getRandomWord());

// fetching random 5-letters word from jinja element
function getRandomWord() {
  let word = document.querySelector("#word").innerText;
  document.querySelector("#word").remove();
  gameOfWords.startGame(word);
}

// write letters using mouse
letters.forEach((letter) => {
  letter.addEventListener("click", () => {
    if (letter.dataset.key === "backspace") {
        gameOfWords.deleteLetter();
    } else if (letter.dataset.key === "enter") {
        gameOfWords.checkEnoughLetters();
    } else {
        gameOfWords.writeLetter(letter.dataset.key);
    }
  });
});

// get rid of outline on btns when clicking
letters.forEach((letter) => {
  letter.addEventListener("mousedown", () => {
    letter.style.outline = "none";
  });
});

let key;
// keyboard events - write/delete letters using keyboard, check for win with enter
document.addEventListener("keydown", (e) => {
  // prevent holding key
  if (e.key == key) return;
  key = e.key;

  if (/^[a-z]+$/.test(e.key)) {
    gameOfWords.writeLetter(e.key.toUpperCase());
  }
  if (e.key === "Backspace") {
    gameOfWords.deleteLetter();
  }
  if (e.key === "Enter") {
    gameOfWords.checkEnoughLetters();
  }
});

document.addEventListener("keyup", () => {
  key = "";
});

navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("nav-toggle");
});

statsBtn.addEventListener("click", () => {
  nav.classList.remove("nav-toggle");
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
  if (modal.classList.contains("modal-toggle")) {
    if (e.target.matches(".modal-Btn") || !e.target.closest(".modal")) {
      modal.classList.remove("modal-toggle");
      modalBg.classList.remove("display");
    }
  }
});

// opening/closing nav
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("hamBtn")) {
    nav.classList.toggle("nav-toggle");
  } else if (nav.classList.contains("nav-toggle")) {
    if (!e.target.closest(".nav" && !e.target.matches(".hamBtn"))) {
      nav.classList.remove("nav-toggle");
    }
  }
});
