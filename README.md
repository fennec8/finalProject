# Game of Words
#### Video Demo:  <https://youtu.be/dgIfH8IkgPE>
#### Description:
## Game of Words - CS50x Final Project 2023
Game of Words is a web based app that lets you play popular word guessing game.

On the front page you can find:
### Play
Play button redirects you to the game page.
### Create account
Create account button allows you to register your new account. Registration form validation is written in JavaScript. Your username must be unique and between 1 and 50 characters. The password must contain 8 to 30 characters, a number, an uppercase and lowercase letter, and a symbol. Finally, your email address must be unique and consist of a local part, an @ symbol, and a domain. All three fields with validation are required to create an account.
### Sign in
If you already have an account, you can sign in. To do that you will have to provide your login and password. As login you can write either your username or email adress. Both fields need to be correct. When you are logged in, you will no longer see the "create an account" button and "sign in" will change to "sign out", so you can easily log out if you wish.
### About
The "About" page is just a page with a few words about the creator.
## Structure/design of program
Game of Words is written mainly in Python and Javascript (besides that I used HTML, CSS, Jinja, Flask, MySQL, Ajax, jQuery). SVG iconcs are from Font Awesome.

Main files and their functions:

- app.py. This shows the main page that is displayed when you load the site, as well as the others pages (e.g. game.html). All communication with the database takes place here, as well as receiving data from JavaScript, storing it in the database and sending it back.
  - getWord() - this function gets one random 5-letter word out of over 5000 words from the database, then sends it to the      Javascript
  - postWordList() - this function checks if the word guessed by the user is in the list of words. If so, the JavaScript        function checkRightLetters() is called and the game continues. If not, the user receives a message telling them to use      a real word.
  - getStats() - the user's stats must be shown before he even starts the game, so this function is called after the page       has loaded.
  - postStats() - after a user wins or loses, this function updates the stats in the database and then displays them            dynamically.

- game.js. All the mechanics of the game are written here. Almost all of the functions are nested in class GameOfWords. Some of them are:
  - startGame(word) - assign values to the main variables.
  - writeLetters(letter) - writing letters in correct rows.
  - checkRightLitters() - check if there are letters in the word guessed by the user in the same or different places of the     word to be guessed, and then notify the user by coloring the corresponding letters with the appropriate colors.
  - win() - call function that sends data to Python then updates stats in MySQL database, displays winning animation and        user stats.
  - async createNewGame() - draws a new word and restarts everything letting the user play again.

There is also supporting Python file (helpers.py).
