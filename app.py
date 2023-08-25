from flask import Flask, render_template, redirect, url_for, flash, jsonify, make_response, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from mysql.connector import connect
import json

from helpers import login_required

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Define connection object
db = connect(
    user='root',
    password='',
    host='localhost',
    database='finalProject'
)
# buffered=True - connector fetches all rows behind the scenes but you get only one,
# so mysql db won't complain that you still have results to be fetched
cursor = db.cursor(buffered=True)

@app.route("/")
def index():
    # If user is not logged in
    if session.get("user_id") is None:
        return render_template("index.html")
    
    # If user is logged in
    return redirect("/home") 


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")

        # Ensure username or email doesn't already exist
        cursor.execute(
            "SELECT username, email FROM users WHERE username = %s OR email = %s;", 
            (username, email,)
        )
        db.commit()
        result = cursor.fetchone()

        if result is not None:
            if username == result[0]:
                return render_template("register.html", regFailed="This username is already in use.")
            elif email == result[1]:
                return render_template("register.html", regFailed="This email is already in use.")
            
        # Add registered user to db
        cursor.execute(
            "INSERT INTO users (username, password, email) VALUES (%s, %s, %s);", 
            (username, generate_password_hash(password), email,)
        )
        db.commit()
        # Remember user that has registered
        cursor.execute("SELECT * FROM users WHERE username = %s;", (username,))
        db.commit()
        result = cursor.fetchone()
        session["user_id"] = result[0]
        session["username"] = result[1]
        session["email"] = result[3]
        # Start new user's statistics
        cursor.execute("INSERT INTO statistics (user_id) VALUES (%s);", (session["user_id"],))
        db.commit()

        flash("You have successfully created an account!")
        return redirect(url_for("home"))
    
    else:
        return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Forget any user_id
    session.clear()

    if request.method == "POST":
        login = request.form.get("login")
        password = request.form.get("password")

        # Ensure login and password are correct
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s;", (login, login,))
        db.commit()
        result = cursor.fetchone()

        if result is None or not check_password_hash(result[2], password):
            return render_template("login.html", logFailed="Invalid username and/or password.")
        
        # Remember which user has logged in
        session["user_id"] = result[0]
        session["username"] = result[1]
        session["email"] = result[3]

        # Redirect user to homepage
        flash("You have successfully signed in!")
        return redirect(url_for("home"))

    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    # Forget any user_id
    session.clear()
    return redirect("/")


@app.route("/home")
@login_required
def home():
    return render_template("home.html")


@app.route("/game")
def game():
    # Get a random word from db
    cursor.execute("SELECT word FROM words ORDER BY RAND() LIMIT 1")
    db.commit()
    result = cursor.fetchone()[0]
    if session.get("user_id") is None:
        session["username"] = "Not logged in"
        session["email"] = "Not logged in"
    
    return render_template("game.html", username=session["username"], email=session["email"])


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/postStats", methods=["POST"])
def postStats():
  # Save stats in db 
  data = request.get_json()

  if data["wins"] == "1": # Win stats
      # Save static (python) data in dynamic (sql) column
      guessed_in = "guessed_in" + str(data["guessed_in"])
      cursor.execute("SELECT * FROM statistics WHERE user_id=%s;", (session["user_id"],))
      db.commit()
      result = cursor.fetchone()
      
      update_temp = str("UPDATE statistics SET played = played + 1, wins = wins + 1, current_streak = current_streak + 1, ") + guessed_in + str("= %s + 1 WHERE user_id=%s;",)
      update_data = (result[4 + data["guessed_in"]], session["user_id"],)
      cursor.execute(update_temp, update_data)
      db.commit()
      # Update streaks
      cursor.execute(
          "UPDATE statistics SET max_streak = current_streak WHERE current_streak > max_streak AND user_id=%s;",
          (session["user_id"],)
      )
      db.commit()
  else: # Lose stats
      cursor.execute(
          "UPDATE statistics SET played = played + 1, current_streak = 0 WHERE user_id=%s;", 
          (session["user_id"],)
      )
      db.commit()

  data = getStats()

  return data

@app.route("/getStats", methods=["GET"])
def getStats():
  # Send data to display back to javascript
  cursor.execute("SELECT * FROM statistics WHERE user_id=%s;", (session["user_id"],))
  db.commit()
  result = cursor.fetchone()
  data = {
      "played": result[1],
      "wins": result[2],
      "current_streak": result[3],
      "max_streak": result[4],
      "guessed_in1": result[5],
      "guessed_in2": result[6],
      "guessed_in3": result[7],
      "guessed_in4": result[8],
      "guessed_in5": result[9],
      "guessed_in6": result[10],
  }
  data = json.dumps(data)
  return data


@app.route("/getWord", methods=["GET"])
def getWord():
  cursor.execute("SELECT word FROM words ORDER BY RAND() LIMIT 1")
  db.commit()
  result = cursor.fetchone()[0]
  result = json.dumps(result)

  return result


@app.route("/postWordList", methods=["GET", "POST"])
def postWordList():
  word = request.get_json()
  # If no word found - return false statement
  cursor.execute("SELECT * FROM words WHERE word = %s;", (word,))
  db.commit()
  result = cursor.fetchone()
  if result is None:
      result = "false"
      result = json.dumps(result)
      return result
  # Else return word
  result = "true"
  result = json.dumps(result)
  return result