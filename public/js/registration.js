const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#pass');
const form = document.querySelector('#registrationForm');
const errorMessageEmail = document.querySelector('#errorMessage_email');
const errorMessagePass = document.querySelector('#errorMessage_pass');
errorMessageEmail.innerText = '';
errorMessagePass.innerText = '';

form.addEventListener('submit', (e) => {
    let messages = [];
    if (!validator.isEmail(emailField.value)) {
        //messages.push('Provide valid email');
        messages.push({
            type: 'email',
            content: 'Provide valid email'
        });
    }
    if (passwordField.value.length <= 6) {
        //messages.push('Password must be longer 6 characters');
        messages.push({
            type: 'password',
            content: 'Password must be longer 6 characters'
        });
    }
    if(messages.length > 0) {
        e.preventDefault();
        messages.forEach((message) => {
            console.log(message);
            if (message.type == 'email') {
                console.log(message);
                errorMessageEmail.innerText = message.content;
            } else if (message.type == 'password') {
                errorMessagePass.innerText = message.content;
            }
        })
    }  
})