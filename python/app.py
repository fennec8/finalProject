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

cursor.execute("SELECT * FROM finalProject")

for x in cursor:
    print(x)

@app.route("/")
# @login_required
def index():
    ...

# Close connection to database
db.close()