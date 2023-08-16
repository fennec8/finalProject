const login = document.querySelector("#login");
const password = document.querySelector("#password");
const btn = document.querySelector("#btn");

let valLogin, valPassword = false;
// Check for 8-30 characters, one uppercase, one lowercase, one digit and one symbol
const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;

check_if_all_valid();

function login_validation() {
    // Prevent spaces
    login.value = login.value.replace(/\s/g, "");

    if (!login.value) valLogin = false;
    else valLogin = true;
    // Check if all inputs were implemented correctly
    check_if_all_valid()
}

function password_validation() {
    if (!password.value.match(validPassword)) valPassword = false;
    else valPassword = true;
    // Check if all inputs were implemented correctly
    check_if_all_valid();
}

// Check if all inputs are valid
function check_if_all_valid() {
    if (!(valLogin && valPassword)) {
        btn.classList.add('btn-disabled');
        btn.setAttribute('tabindex', '-1');
    } else {
        btn.classList.remove('btn-disabled');
        btn.removeAttribute('tabindex');
    }
}

// Listen for events
login.addEventListener('input', login_validation);
password.addEventListener('input', password_validation);