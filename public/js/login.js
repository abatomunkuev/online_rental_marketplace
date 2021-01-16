const loginForm = document.querySelector('#loginForm');
const usernameField = document.querySelector('#login_username');
const passwordField = document.querySelector('#login_password');
let errorMessage = document.querySelector('#errorMessage');
loginForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    let messages = [];
    if(validator.isEmpty(usernameField.value)) {
        messages.push( 'Please provide username');
    } else if (!validator.isEmail(usernameField.value)) {
        messages.push('Please provide valid username');
    }
    if(validator.isEmpty(passwordField.value)) {
        messages.push('Please provide password');
    } else if (passwordField.value.length <= 6) {
        messages.push('Password must be longer 6 characters');
    }
    console.log(messages);
    let username = usernameField.value;
    let password = passwordField.value;
    const data = {
        username,
        password
    }
    const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    })
    const text = await response.text();
    let resp = JSON.parse(text);
    if(resp.error) {
        resp.error = resp.error.replace('Error: ', '');
        messages.push(resp.error);
    } else {
        window.location.href = '/dashboard';
    }
    if(messages.length > 0) {
        errorMessage.innerText = messages.join(', ');
    }
})