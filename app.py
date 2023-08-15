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
# buffered=True - connector fetches all rows behind the scenes but you get only one,
# so mysql db won't complain that you still have results to be fetched
cursor = db.cursor(buffered=True)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/game")
def game():
    return render_template("game.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")

        # Ensure username or email doesn't already exist
        cursor.execute("SELECT username, email FROM users WHERE username = %s OR email = %s;", (username, email))
        db.commit()
        result = cursor.fetchone()

        if result is not None:
            if username == result[0]:
                return render_template("register.html", regFailed="This username is already in use.")
            elif email == result[1]:
                return render_template("register.html", regFailed="This email is already in use.")
            
        # Add registered user to db
        cursor.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s);", (username, generate_password_hash(password), email,))
        db.commit()
        # Remember user that has registered
        cursor.execute("SELECT id FROM users WHERE username = %s;", (username,))
        db.commit()
        result = cursor.fetchone()
        session["user_id"] = result[0]

        return render_template("index.html", account="You have successfully created an account!")
    
    else:
        return render_template("register.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/about")
def about():
    return render_template("about.html")


# Close connection to database
# db.close()