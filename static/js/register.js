const username = document.querySelector("#username");
const password = document.querySelector("#password");
const email = document.querySelector("#email");
const btn = document.querySelector("#btn");

let valEmail, valUsername, valPassword = false;
// Check for 8-30 characters, one uppercase, one lowercase, one digit and one symbol
const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;
// Check for valid email
const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

check_if_all_valid();

// Ensure username is valid
function username_validation() {
    // Prevent spaces
    username.value = username.value.replace(/\s/g, "");

    if (!username.value) {
        username.classList.add('invalid-input');
        username.parentElement.querySelector(".invalid-div").style.display = "block";
    } else {
        username.classList.remove('invalid-input');
        username.parentElement.querySelector(".invalid-div").style.display = "none";
        valUsername = true;
    }
    // Check if all inputs were implemented correctly
    check_if_all_valid();
}

// Ensure password is valid
function password_validation() {
    if (!password.value.match(validPassword)) {
        password.classList.add('invalid-input');
        password.parentElement.querySelector(".invalid-div").style.display = "block";
    } else {
        password.classList.remove('invalid-input');
        password.parentElement.querySelector(".invalid-div").style.display = "none";
        valPassword = true;
    }
    // Check if all inputs were implemented correctly
    check_if_all_valid();
}

// Ensure email is valid
function email_validation() {
    if (!email.value.match(validEmail)) {
        email.classList.add('invalid-input');
        email.parentElement.querySelector(".invalid-div").style.display = "block";
    } else {
        email.classList.remove('invalid-input');
        email.parentElement.querySelector(".invalid-div").style.display = "none";
        valEmail = true;
    }
    // Check if all inputs were implemented correctly
    check_if_all_valid();
}

// Check if all inputs are valid
function check_if_all_valid() {
    if (!(valUsername && valPassword && valEmail)) {
        btn.classList.add('btn-disabled');
        btn.setAttribute('tabindex', '1');
    } else {
        btn.classList.remove('btn-disabled');
        btn.setAttribute('tabindex', '-1');
    }
}

// Listen for all events
username.addEventListener('input', username_validation);
password.addEventListener('input', password_validation);
email.addEventListener('input', email_validation);
