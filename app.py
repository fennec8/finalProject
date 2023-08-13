from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from mysql.connector import connect

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

@app.route("/")
def index():
    return render_template("index.html", style="/static/css/index.css", title="Game of Words")


@app.route("/game")
def game():
    return render_template("game.html", title="Game of Words")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")

        # Ensure username or email doesn't already exist
        cursor.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s)", (username, generate_password_hash(password), email))
        db.commit()
        cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?;", username, email)
        db.commit()
        result = cursor.fetchone()
        if result is not None:
            return render_template("register.html")
        else:
            return redirect("/game")
    
    else:
        return render_template("register.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/about")
def about():
    return render_template("about.html")


# Close connection to database
db.close()