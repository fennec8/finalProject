from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from mysql.connector import connect

# from helpers import login_required

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

cursor = db.cursor()

# cursor.execute("SELECT * FROM finalProject")

# for x in cursor:
    # print(x)

@app.route("/")
def index():
        return render_template("index.html", style="/static/css/index.css", title="Game of Words")


@app.route("/game")
def game():
        return render_template("game.html", title="Game of Words")


@app.route("/register")
def register():
        return render_template("register.html", style="/static/css/register.css", title="Register for Game of Words")


@app.route("/login")
def login():
        return render_template("login.html", style="/static/css/login.css", title="Log in to Game of Words")


@app.route("/about")
def about():
        return render_template("about.html", style="/static/css/index.css", title="About Game of Words")


# Close connection to database
db.close()