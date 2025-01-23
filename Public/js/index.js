//button linked to the register page
const register = document.getElementById('btn_reg')
register.addEventListener('click', () => {
    window.location.href = 'regist.html';
});

//button linked to the login page
const join = document.getElementById('btn_join')
join.addEventListener('click', () => {
    window.location.href = 'signin.html';
});

//button linked to the login page
const login = document.getElementById('btn_login')
login.addEventListener('click', () => {
    window.location.href = 'signin.html';
});

//button linked to the learn page
const learn = document.getElementById('btn_learn')
learn.addEventListener('click', () => {
    window.location.href = 'regist.html';
});


/*
document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.card-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Button ${button.textContent} clicked`);
            // Add your button click handling logic here
        });
    });
});
*/