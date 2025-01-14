const register = document.getElementById('btn_reg')
register.addEventListener('click', () => {
    window.location.href = 'regist.html';
});

const join = document.getElementById('btn_join')
join.addEventListener('click', () => {
    window.location.href = 'signin.html';
});

const login = document.getElementById('btn_login')
login.addEventListener('click', () => {
    window.location.href = 'signin.html';
});

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