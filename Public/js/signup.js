const signUpForm = document.getElementById("signform");
 

// attach the submit handler
signUpForm.addEventListener('submit', (event)) => {
    event.preventDefault();

    //gather all the info. from the form
    const userName = doc.getElementById("username").value;
    const email = doc.getElementById("email").value;
    const password = doc.getElementById("password").value;

    const userInfo = {
        username: userName,
        email: email,
        password: password
    };
    
    //make arequest to the backend server
    const result = await fetch (
        'http://127.0.0.1:3000/auth/register',
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        }
    ) 
})
